import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { method } = req

    switch (method) {
      case 'GET':
        return await handleYieldPredictionGet(req, supabase)
      case 'POST':
        return await handleYieldPredictionCreate(req, supabase)
      case 'PUT':
        return await handleYieldPredictionUpdate(req, supabase)
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error: any) {
    console.error('Yield prediction function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleYieldPredictionGet(req: Request, supabase: any) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Authorization required' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const url = new URL(req.url)
  const cropCycleId = url.searchParams.get('crop_cycle_id')

  if (cropCycleId) {
    // Get specific yield prediction
    const { data: prediction, error: predictionError } = await supabase
      .from('yield_predictions')
      .select(`
        *,
        crop_cycle:crop_cycles(
          id,
          crop_type,
          crop_variety,
          sowing_date,
          field_size_acres,
          farmer_id
        )
      `)
      .eq('crop_cycle_id', cropCycleId)
      .order('prediction_date', { ascending: false })
      .limit(1)

    if (predictionError) throw predictionError

    // Check access permissions
    if (prediction.length > 0) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'farmer' && prediction[0].crop_cycle.farmer_id !== user.id) {
        return new Response(JSON.stringify({ error: 'Access denied' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    return new Response(JSON.stringify({ 
      prediction: prediction[0] || null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } else {
    // Get all yield predictions for user
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    let query = supabase
      .from('yield_predictions')
      .select(`
        *,
        crop_cycle:crop_cycles(
          id,
          crop_type,
          crop_variety,
          sowing_date,
          field_size_acres,
          farmer_id
        )
      `)
      .order('prediction_date', { ascending: false })

    if (profile?.role === 'farmer') {
      query = query.eq('crop_cycle.farmer_id', user.id)
    }

    const { data: predictions, error: predictionsError } = await query

    if (predictionsError) throw predictionsError

    return new Response(JSON.stringify({ 
      predictions,
      count: predictions.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function handleYieldPredictionCreate(req: Request, supabase: any) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Authorization required' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const { crop_cycle_id } = await req.json()

  if (!crop_cycle_id) {
    return new Response(JSON.stringify({ error: 'Crop cycle ID required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Get crop cycle details
  const { data: cropCycle, error: cropError } = await supabase
    .from('crop_cycles')
    .select('*')
    .eq('id', crop_cycle_id)
    .single()

  if (cropError || !cropCycle) {
    return new Response(JSON.stringify({ error: 'Crop cycle not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Check permissions
  if (cropCycle.farmer_id !== user.id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Access denied' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  }

  // Generate yield prediction
  const prediction = await calculateYieldPrediction(cropCycle, supabase)

  const { data: newPrediction, error: insertError } = await supabase
    .from('yield_predictions')
    .insert({
      crop_cycle_id,
      predicted_yield_tons: prediction.yield,
      confidence_score: prediction.confidence,
      prediction_date: new Date().toISOString().split('T')[0],
      factors: prediction.factors
    })
    .select()
    .single()

  if (insertError) throw insertError

  return new Response(JSON.stringify({ 
    message: 'Yield prediction created successfully',
    prediction: newPrediction
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleYieldPredictionUpdate(req: Request, supabase: any) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Authorization required' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const url = new URL(req.url)
  const predictionId = url.searchParams.get('id')

  if (!predictionId) {
    return new Response(JSON.stringify({ error: 'Prediction ID required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Only admins can update predictions
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Admin access required' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const updates = await req.json()

  const { data: updatedPrediction, error: updateError } = await supabase
    .from('yield_predictions')
    .update(updates)
    .eq('id', predictionId)
    .select()
    .single()

  if (updateError) throw updateError

  return new Response(JSON.stringify({ 
    message: 'Yield prediction updated successfully',
    prediction: updatedPrediction
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function calculateYieldPrediction(cropCycle: any, supabase: any): Promise<{
  yield: number
  confidence: number
  factors: any
}> {
  try {
    // Base yield by crop type (tons per acre)
    const baseYields = {
      'rice': 2.8,
      'wheat': 3.0,
      'cotton': 1.2,
      'sugarcane': 25.0,
      'maize': 2.5,
      'pulses': 1.8,
      'vegetables': 15.0,
      'fruits': 8.0,
      'spices': 0.8,
      'oilseeds': 1.5,
      'other': 2.0
    }

    const baseYield = baseYields[cropCycle.crop_type] || 2.0

    // Get weather data for the crop cycle period
    const { data: weatherData } = await supabase
      .from('weather_data')
      .select('*')
      .eq('location_lat', cropCycle.location_lat)
      .eq('location_lng', cropCycle.location_lng)
      .gte('date', cropCycle.sowing_date)
      .lte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })

    // Calculate weather factors
    let weatherFactor = 1.0
    let temperatureScore = 1.0
    let rainfallScore = 1.0

    if (weatherData && weatherData.length > 0) {
      const avgTemp = weatherData.reduce((sum: number, w: any) => sum + w.temperature_max, 0) / weatherData.length
      const totalRainfall = weatherData.reduce((sum: number, w: any) => sum + w.rainfall_mm, 0)

      // Temperature factor (optimal range varies by crop)
      const optimalTemp = getOptimalTemperature(cropCycle.crop_type)
      if (avgTemp > optimalTemp + 5) {
        temperatureScore = 0.85 // Too hot
      } else if (avgTemp < optimalTemp - 5) {
        temperatureScore = 0.9 // Too cold
      }

      // Rainfall factor
      const optimalRainfall = getOptimalRainfall(cropCycle.crop_type)
      if (totalRainfall < optimalRainfall * 0.5) {
        rainfallScore = 0.8 // Too dry
      } else if (totalRainfall > optimalRainfall * 1.5) {
        rainfallScore = 0.85 // Too wet
      }

      weatherFactor = (temperatureScore + rainfallScore) / 2
    }

    // Growth stage factor
    const daysSinceSowing = Math.floor((Date.now() - new Date(cropCycle.sowing_date).getTime()) / (1000 * 60 * 60 * 24))
    let stageFactor = 1.0

    if (cropCycle.current_stage === 'vegetative') {
      stageFactor = 0.7 // Still growing
    } else if (cropCycle.current_stage === 'flowering') {
      stageFactor = 0.85 // Flowering stage
    } else if (cropCycle.current_stage === 'fruiting') {
      stageFactor = 0.95 // Near harvest
    }

    // Field size factor (smaller fields often have better management)
    let fieldSizeFactor = 1.0
    if (cropCycle.field_size_acres && cropCycle.field_size_acres < 2) {
      fieldSizeFactor = 1.1 // Small field advantage
    } else if (cropCycle.field_size_acres && cropCycle.field_size_acres > 10) {
      fieldSizeFactor = 0.95 // Large field disadvantage
    }

    // Calculate final yield
    const finalYield = baseYield * weatherFactor * stageFactor * fieldSizeFactor

    // Calculate confidence based on data availability
    let confidence = 0.7 // Base confidence
    if (weatherData && weatherData.length > 10) {
      confidence += 0.1 // Good weather data
    }
    if (daysSinceSowing > 60) {
      confidence += 0.1 // Crop well established
    }
    if (cropCycle.current_stage === 'fruiting' || cropCycle.current_stage === 'harvesting') {
      confidence += 0.1 // Near harvest
    }

    confidence = Math.min(confidence, 0.95)

    return {
      yield: Math.round(finalYield * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      factors: {
        base_yield: baseYield,
        weather_factor: Math.round(weatherFactor * 100) / 100,
        stage_factor: Math.round(stageFactor * 100) / 100,
        field_size_factor: Math.round(fieldSizeFactor * 100) / 100,
        temperature_score: Math.round(temperatureScore * 100) / 100,
        rainfall_score: Math.round(rainfallScore * 100) / 100,
        days_since_sowing: daysSinceSowing,
        current_stage: cropCycle.current_stage
      }
    }
  } catch (error: any) {
    console.error('Error calculating yield prediction:', error)
    // Return conservative estimate
    return {
      yield: 2.0,
      confidence: 0.5,
      factors: { error: 'Calculation failed' }
    }
  }
}

function getOptimalTemperature(cropType: string): number {
  const optimalTemps = {
    'rice': 28,
    'wheat': 22,
    'cotton': 30,
    'sugarcane': 25,
    'maize': 26,
    'pulses': 24,
    'vegetables': 22,
    'fruits': 24,
    'spices': 26,
    'oilseeds': 25,
    'other': 24
  }
  return optimalTemps[cropType] || 24
}

function getOptimalRainfall(cropType: string): number {
  const optimalRainfall = {
    'rice': 1200, // mm per season
    'wheat': 500,
    'cotton': 700,
    'sugarcane': 1500,
    'maize': 600,
    'pulses': 400,
    'vegetables': 800,
    'fruits': 1000,
    'spices': 900,
    'oilseeds': 600,
    'other': 700
  }
  return optimalRainfall[cropType] || 700
}

// Batch yield prediction for all active crops
export async function generateBatchYieldPredictions(supabase: any) {
  try {
    // Get all active crop cycles without recent predictions
    const { data: activeCrops } = await supabase
      .from('crop_cycles')
      .select('*')
      .eq('status', 'active')

    if (!activeCrops || activeCrops.length === 0) {
      return { message: 'No active crops found' }
    }

    const results = []

    for (const crop of activeCrops) {
      // Check if prediction already exists for today
      const { data: existingPrediction } = await supabase
        .from('yield_predictions')
        .select('id')
        .eq('crop_cycle_id', crop.id)
        .eq('prediction_date', new Date().toISOString().split('T')[0])
        .single()

      if (!existingPrediction) {
        const prediction = await calculateYieldPrediction(crop, supabase)

        const { data: newPrediction } = await supabase
          .from('yield_predictions')
          .insert({
            crop_cycle_id: crop.id,
            predicted_yield_tons: prediction.yield,
            confidence_score: prediction.confidence,
            prediction_date: new Date().toISOString().split('T')[0],
            factors: prediction.factors
          })
          .select()
          .single()

        results.push({
          crop_cycle_id: crop.id,
          crop_type: crop.crop_type,
          prediction: newPrediction
        })
      }
    }

    return {
      message: 'Batch yield predictions completed',
      count: results.length,
      results
    }
  } catch (error: any) {
    console.error('Error in batch yield prediction:', error)
    throw error
  }
}
