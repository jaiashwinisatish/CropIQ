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
        return await handleAdvisoriesGet(req, supabase)
      case 'POST':
        return await handleAdvisoryCreate(req, supabase)
      case 'PUT':
        return await handleAdvisoryUpdate(req, supabase)
      case 'DELETE':
        return await handleAdvisoryDelete(req, supabase)
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error: any) {
    console.error('Advisories function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleAdvisoriesGet(req: Request, supabase: any) {
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
  const unreadOnly = url.searchParams.get('unread_only') === 'true'
  const type = url.searchParams.get('type')
  const limit = parseInt(url.searchParams.get('limit') || '50')

  // Get user profile to check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  let query = supabase
    .from('advisories')
    .select(`
      *,
      crop_cycle:crop_cycles(
        id,
        crop_type,
        crop_variety,
        sowing_date,
        current_stage
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  // Apply filters based on user role
  if (profile?.role === 'farmer') {
    query = query.eq('farmer_id', user.id)
  } else if (profile?.role === 'fpo') {
    // Get farmers under this FPO
    const { data: memberFarmers } = await supabase
      .from('fpo_farmers')
      .select('farmer_id')
      .eq('fpo_id', user.id)
      .eq('is_active', true)

    const farmerIds = memberFarmers?.map(f => f.farmer_id) || []
    if (farmerIds.length > 0) {
      query = query.in('farmer_id', farmerIds)
    }
  } else if (profile?.role === 'admin') {
    // Admins can see all advisories
  }

  // Apply additional filters
  if (unreadOnly) {
    query = query.eq('is_read', false)
  }

  if (type) {
    query = query.eq('type', type)
  }

  const { data: advisories, error: advisoriesError } = await query

  if (advisoriesError) throw advisoriesError

  return new Response(JSON.stringify({ 
    advisories,
    count: advisories.length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleAdvisoryCreate(req: Request, supabase: any) {
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

  const advisoryData = await req.json()

  // Validate required fields
  if (!advisoryData.type || !advisoryData.title || !advisoryData.description) {
    return new Response(JSON.stringify({ 
      error: 'Type, title, and description are required' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Set default values
  const advisory = {
    farmer_id: user.id,
    type: advisoryData.type,
    title: advisoryData.title,
    description: advisoryData.description,
    priority: advisoryData.priority || 'medium',
    action_required: advisoryData.action_required || false,
    crop_cycle_id: advisoryData.crop_cycle_id,
    valid_until: advisoryData.valid_until,
    metadata: advisoryData.metadata || {}
  }

  const { data: newAdvisory, error: insertError } = await supabase
    .from('advisories')
    .insert(advisory)
    .select()
    .single()

  if (insertError) throw insertError

  return new Response(JSON.stringify({ 
    message: 'Advisory created successfully',
    advisory: newAdvisory
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleAdvisoryUpdate(req: Request, supabase: any) {
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
  const advisoryId = url.searchParams.get('id')

  if (!advisoryId) {
    return new Response(JSON.stringify({ error: 'Advisory ID required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const updates = await req.json()

  // Check if user owns this advisory
  const { data: existingAdvisory } = await supabase
    .from('advisories')
    .select('farmer_id')
    .eq('id', advisoryId)
    .single()

  if (!existingAdvisory || existingAdvisory.farmer_id !== user.id) {
    return new Response(JSON.stringify({ error: 'Access denied' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const { data: updatedAdvisory, error: updateError } = await supabase
    .from('advisories')
    .update(updates)
    .eq('id', advisoryId)
    .select()
    .single()

  if (updateError) throw updateError

  return new Response(JSON.stringify({ 
    message: 'Advisory updated successfully',
    advisory: updatedAdvisory
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleAdvisoryDelete(req: Request, supabase: any) {
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
  const advisoryId = url.searchParams.get('id')

  if (!advisoryId) {
    return new Response(JSON.stringify({ error: 'Advisory ID required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Check if user owns this advisory
  const { data: existingAdvisory } = await supabase
    .from('advisories')
    .select('farmer_id')
    .eq('id', advisoryId)
    .single()

  if (!existingAdvisory || existingAdvisory.farmer_id !== user.id) {
    return new Response(JSON.stringify({ error: 'Access denied' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const { error: deleteError } = await supabase
    .from('advisories')
    .delete()
    .eq('id', advisoryId)

  if (deleteError) throw deleteError

  return new Response(JSON.stringify({ 
    message: 'Advisory deleted successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

// Auto-generate advisories based on weather and crop data
export async function generateAutomatedAdvisories(supabase: any) {
  try {
    // Get all active crop cycles
    const { data: activeCrops } = await supabase
      .from('crop_cycles')
      .select('*')
      .eq('status', 'active')

    if (!activeCrops || activeCrops.length === 0) {
      return { message: 'No active crops found' }
    }

    const generatedAdvisories = []

    for (const crop of activeCrops) {
      // Get weather data for crop location
      const { data: weatherData } = await supabase
        .from('weather_data')
        .select('*')
        .eq('location_lat', crop.location_lat)
        .eq('location_lng', crop.location_lng)
        .eq('date', new Date().toISOString().split('T')[0])
        .single()

      if (weatherData) {
        // Generate weather-based advisories
        const weatherAdvisories = generateWeatherAdvisories(crop, weatherData)
        
        for (const advisory of weatherAdvisories) {
          // Check if similar advisory already exists today
          const { data: existingAdvisory } = await supabase
            .from('advisories')
            .select('id')
            .eq('farmer_id', crop.farmer_id)
            .eq('crop_cycle_id', crop.id)
            .eq('type', advisory.type)
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            .single()

          if (!existingAdvisory) {
            const { data: newAdvisory } = await supabase
              .from('advisories')
              .insert({
                farmer_id: crop.farmer_id,
                crop_cycle_id: crop.id,
                ...advisory
              })
              .select()
              .single()

            if (newAdvisory) {
              generatedAdvisories.push(newAdvisory)
            }
          }
        }

        // Generate growth stage-based advisories
        const growthAdvisories = generateGrowthStageAdvisories(crop)
        
        for (const advisory of growthAdvisories) {
          const { data: newAdvisory } = await supabase
            .from('advisories')
            .insert({
              farmer_id: crop.farmer_id,
              crop_cycle_id: crop.id,
              ...advisory
            })
            .select()
            .single()

          if (newAdvisory) {
            generatedAdvisories.push(newAdvisory)
          }
        }
      }
    }

    return { 
      message: 'Advisories generated successfully',
      count: generatedAdvisories.length,
      advisories: generatedAdvisories
    }
  } catch (error: any) {
    console.error('Error generating automated advisories:', error)
    throw error
  }
}

function generateWeatherAdvisories(crop: any, weather: any) {
  const advisories = []

  // Heat stress advisory
  if (weather.temperature_max > 38) {
    advisories.push({
      type: 'weather_warning',
      title: 'High Temperature Alert',
      description: `Temperature above 38°C detected. Ensure adequate irrigation and consider providing shade to your ${crop.crop_type} crop.`,
      priority: 'high',
      action_required: true
    })
  }

  // Rainfall advisory
  if (weather.rainfall_mm > 50) {
    advisories.push({
      type: 'weather_warning',
      title: 'Heavy Rainfall Warning',
      description: 'Heavy rainfall expected. Ensure proper drainage and avoid fertilizer application for the next 3 days.',
      priority: 'medium',
      action_required: true
    })
  }

  // Irrigation advisory
  if (weather.rainfall_mm < 2 && weather.temperature_max > 30) {
    advisories.push({
      type: 'irrigation',
      title: 'Irrigation Recommended',
      description: 'Low rainfall and high temperatures indicate the need for irrigation. Consider light irrigation for optimal crop growth.',
      priority: 'medium',
      action_required: true
    })
  }

  return advisories
}

function generateGrowthStageAdvisories(crop: any) {
  const advisories = []
  const daysSinceSowing = Math.floor((Date.now() - new Date(crop.sowing_date).getTime()) / (1000 * 60 * 60 * 24))

  // Stage-specific advisories
  if (daysSinceSowing >= 20 && daysSinceSowing <= 25 && crop.current_stage === 'germination') {
    advisories.push({
      type: 'fertilizer',
      title: 'First Fertilizer Application',
      description: `Your ${crop.crop_type} crop is ready for the first fertilizer application. Apply urea at 40 kg per acre for optimal vegetative growth.`,
      priority: 'high',
      action_required: true
    })
  }

  if (daysSinceSowing >= 45 && daysSinceSowing <= 50 && crop.current_stage === 'vegetative') {
    advisories.push({
      type: 'fertilizer',
      title: 'Second Fertilizer Application',
      description: 'Time for the second fertilizer dose. Apply NPK fertilizer as per soil test recommendations.',
      priority: 'medium',
      action_required: true
    })
  }

  // Pest monitoring advisory
  if (daysSinceSowing >= 30 && daysSinceSowing <= 35) {
    advisories.push({
      type: 'pest_control',
      title: 'Pest Monitoring Required',
      description: 'Regular pest monitoring is crucial at this stage. Look for signs of common pests and take preventive measures if needed.',
      priority: 'medium',
      action_required: false
    })
  }

  return advisories
}
