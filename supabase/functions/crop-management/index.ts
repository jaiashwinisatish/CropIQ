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
        return await handleCropGet(req, supabase)
      case 'POST':
        return await handleCropCreate(req, supabase)
      case 'PUT':
        return await handleCropUpdate(req, supabase)
      case 'DELETE':
        return await handleCropDelete(req, supabase)
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error: any) {
    console.error('Crop management function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleCropGet(req: Request, supabase: any) {
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
  const cropId = url.searchParams.get('id')
  const status = url.searchParams.get('status')
  const includeYield = url.searchParams.get('include_yield') === 'true'

  if (cropId) {
    // Get specific crop cycle
    let query = supabase
      .from('crop_cycles')
      .select(`
        *,
        advisories:advisories(count),
        yield_predictions:yield_predictions(
          id,
          predicted_yield_tons,
          confidence_score,
          prediction_date
        )
      `)
      .eq('id', cropId)

    if (includeYield) {
      query = supabase
        .from('crop_cycles')
        .select(`
          *,
          advisories:advisories(count),
          yield_predictions:yield_predictions(
            id,
            predicted_yield_tons,
            confidence_score,
            prediction_date,
            factors
          )
        `)
        .eq('id', cropId)
    }

    const { data: crop, error: cropError } = await query.single()

    if (cropError) throw cropError

    // Check permissions
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'farmer' && crop.farmer_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Access denied' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ crop }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } else {
    // Get all crop cycles for user
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    let query = supabase
      .from('crop_cycles')
      .select(`
        *,
        advisories:advisories(count),
        yield_predictions:yield_predictions(
          id,
          predicted_yield_tons,
          confidence_score,
          prediction_date
        )
      `)
      .order('created_at', { ascending: false })

    if (profile?.role === 'farmer') {
      query = query.eq('farmer_id', user.id)
    } else if (profile?.role === 'fpo') {
      // Get farmers under this FPO
      const { data: memberFarmers } = await supabase
        .from('fpo_farmers')
        .select('farmer_id')
        .eq('fpo_id', user.id)
        .eq('is_active', true)

      const farmerIds = memberFarmers?.map((f: any) => f.farmer_id) || []
      if (farmerIds.length > 0) {
        query = query.in('farmer_id', farmerIds)
      }
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: crops, error: cropsError } = await query

    if (cropsError) throw cropsError

    return new Response(JSON.stringify({ 
      crops,
      count: crops.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function handleCropCreate(req: Request, supabase: any) {
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

  const cropData = await req.json()

  // Validate required fields
  if (!cropData.crop_type || !cropData.sowing_date) {
    return new Response(JSON.stringify({ 
      error: 'Crop type and sowing date are required' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Set default values and farmer_id
  const crop = {
    farmer_id: user.id,
    crop_type: cropData.crop_type,
    crop_variety: cropData.crop_variety,
    sowing_date: cropData.sowing_date,
    expected_harvest_date: calculateExpectedHarvestDate(cropData.crop_type, cropData.sowing_date),
    field_size_acres: cropData.field_size_acres,
    location_lat: cropData.location_lat,
    location_lng: cropData.location_lng,
    soil_type: cropData.soil_type,
    irrigation_method: cropData.irrigation_method,
    current_stage: 'sowing',
    status: 'active'
  }

  const { data: newCrop, error: insertError } = await supabase
    .from('crop_cycles')
    .insert(crop)
    .select()
    .single()

  if (insertError) throw insertError

  // Generate initial yield prediction
  try {
    const prediction = await calculateYieldPrediction(newCrop, supabase)
    await supabase
      .from('yield_predictions')
      .insert({
        crop_cycle_id: newCrop.id,
        predicted_yield_tons: prediction.yield,
        confidence_score: prediction.confidence,
        prediction_date: new Date().toISOString().split('T')[0],
        factors: prediction.factors
      })
  } catch (error) {
    console.error('Error generating initial yield prediction:', error)
  }

  // Generate welcome advisory
  await supabase
    .from('advisories')
    .insert({
      farmer_id: user.id,
      crop_cycle_id: newCrop.id,
      type: 'general',
      title: 'New Crop Cycle Started',
      description: `Your ${cropData.crop_type} crop cycle has been successfully registered. We'll provide personalized advisories throughout the growing season.`,
      priority: 'medium',
      action_required: false
    })

  return new Response(JSON.stringify({ 
    message: 'Crop cycle created successfully',
    crop: newCrop
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleCropUpdate(req: Request, supabase: any) {
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
  const cropId = url.searchParams.get('id')

  if (!cropId) {
    return new Response(JSON.stringify({ error: 'Crop ID required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const updates = await req.json()

  // Check if user owns this crop
  const { data: existingCrop } = await supabase
    .from('crop_cycles')
    .select('farmer_id')
    .eq('id', cropId)
    .single()

  if (!existingCrop || existingCrop.farmer_id !== user.id) {
    return new Response(JSON.stringify({ error: 'Access denied' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const { data: updatedCrop, error: updateError } = await supabase
    .from('crop_cycles')
    .update(updates)
    .eq('id', cropId)
    .select()
    .single()

  if (updateError) throw updateError

  // If status changed to completed, generate final advisory
  if (updates.status === 'completed') {
    await supabase
      .from('advisories')
      .insert({
        farmer_id: user.id,
        crop_cycle_id: cropId,
        type: 'harvest_timing',
        title: 'Crop Cycle Completed',
        description: 'Your crop cycle has been marked as completed. Please update the actual harvest date and yield for better future predictions.',
        priority: 'high',
        action_required: true
      })
  }

  return new Response(JSON.stringify({ 
    message: 'Crop cycle updated successfully',
    crop: updatedCrop
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleCropDelete(req: Request, supabase: any) {
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
  const cropId = url.searchParams.get('id')

  if (!cropId) {
    return new Response(JSON.stringify({ error: 'Crop ID required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Check if user owns this crop
  const { data: existingCrop } = await supabase
    .from('crop_cycles')
    .select('farmer_id')
    .eq('id', cropId)
    .single()

  if (!existingCrop || existingCrop.farmer_id !== user.id) {
    return new Response(JSON.stringify({ error: 'Access denied' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const { error: deleteError } = await supabase
    .from('crop_cycles')
    .delete()
    .eq('id', cropId)

  if (deleteError) throw deleteError

  return new Response(JSON.stringify({ 
    message: 'Crop cycle deleted successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

function calculateExpectedHarvestDate(cropType: string, sowingDate: string): string {
  const harvestDays = {
    'rice': 120,
    'wheat': 110,
    'cotton': 160,
    'sugarcane': 365,
    'maize': 90,
    'pulses': 75,
    'vegetables': 60,
    'fruits': 180,
    'spices': 90,
    'oilseeds': 100,
    'other': 100
  }

  const days = harvestDays[cropType] || 100
  const harvestDate = new Date(sowingDate)
  harvestDate.setDate(harvestDate.getDate() + days)
  
  return harvestDate.toISOString().split('T')[0]
}

async function calculateYieldPrediction(cropCycle: any, supabase: any) {
  // Simplified yield prediction for initial setup
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

  return {
    yield: baseYield,
    confidence: 0.6,
    factors: {
      base_yield: baseYield,
      stage: 'initial',
      data_availability: 'limited'
    }
  }
}

// Crop recommendations endpoint
export async function generateCropRecommendations(req: Request, supabase: any) {
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

  // Get user profile for location
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return new Response(JSON.stringify({ error: 'Profile not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Generate recommendations based on location and season
  const recommendations = generateRecommendationsByLocation(
    profile.location_lat,
    profile.location_lng,
    new Date().getMonth()
  )

  // Save recommendations to database
  for (const rec of recommendations) {
    await supabase
      .from('crop_recommendations')
      .insert({
        farmer_id: user.id,
        ...rec
      })
  }

  return new Response(JSON.stringify({ 
    message: 'Crop recommendations generated',
    recommendations
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

function generateRecommendationsByLocation(lat: number, lng: number, month: number) {
  // Simplified recommendation logic based on Indian agricultural seasons
  const recommendations = []

  // Kharif season (June-October)
  if (month >= 5 && month <= 9) {
    recommendations.push({
      recommended_crop: 'rice',
      suitability_score: 0.85,
      expected_yield_range_min: 2.5,
      expected_yield_range_max: 3.2,
      estimated_cost_per_acre: 15000,
      estimated_profit_range_min: 8000,
      estimated_profit_range_max: 15000,
      risk_factors: { flood_risk: 'low', pest_risk: 'medium' },
      market_outlook: 'Stable prices expected due to government procurement',
      season: 'Kharif'
    })

    recommendations.push({
      recommended_crop: 'cotton',
      suitability_score: 0.78,
      expected_yield_range_min: 1.0,
      expected_yield_range_max: 1.5,
      estimated_cost_per_acre: 25000,
      estimated_profit_range_min: 12000,
      estimated_profit_range_max: 20000,
      risk_factors: { pest_risk: 'high', price_volatility: 'medium' },
      market_outlook: 'Good export demand expected',
      season: 'Kharif'
    })
  }

  // Rabi season (October-March)
  if (month >= 9 || month <= 2) {
    recommendations.push({
      recommended_crop: 'wheat',
      suitability_score: 0.82,
      expected_yield_range_min: 2.8,
      expected_yield_range_max: 3.5,
      estimated_cost_per_acre: 12000,
      estimated_profit_range_min: 10000,
      estimated_profit_range_max: 18000,
      risk_factors: { frost_risk: 'low', drought_risk: 'medium' },
      market_outlook: 'Good market outlook with increasing demand',
      season: 'Rabi'
    })

    recommendations.push({
      recommended_crop: 'pulses',
      suitability_score: 0.75,
      expected_yield_range_min: 1.5,
      expected_yield_range_max: 2.0,
      estimated_cost_per_acre: 10000,
      estimated_profit_range_min: 8000,
      estimated_profit_range_max: 12000,
      risk_factors: { pest_risk: 'medium', price_volatility: 'high' },
      market_outlook: 'Government support prices available',
      season: 'Rabi'
    })
  }

  // Zaid season (March-June)
  if (month >= 2 && month <= 5) {
    recommendations.push({
      recommended_crop: 'maize',
      suitability_score: 0.80,
      expected_yield_range_min: 2.0,
      expected_yield_range_max: 2.8,
      estimated_cost_per_acre: 14000,
      estimated_profit_range_min: 9000,
      estimated_profit_range_max: 14000,
      risk_factors: { heat_stress: 'medium', water_requirement: 'high' },
      market_outlook: 'Steady demand from feed industry',
      season: 'Zaid'
    })
  }

  return recommendations
}
