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
      case 'POST':
        return await handleScheduledTask(req, supabase)
      case 'GET':
        return await handleSchedulerStatus(req, supabase)
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error: any) {
    console.error('Scheduler function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleScheduledTask(req: Request, supabase: any) {
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

  // Check if user is admin (scheduler should only be triggered by admins or cron)
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

  const { task } = await req.json()

  const results = []

  switch (task) {
    case 'weather_update':
      results.push(await updateWeatherData(supabase))
      break
    case 'generate_advisories':
      results.push(await generateAdvisories(supabase))
      break
    case 'update_yield_predictions':
      results.push(await updateYieldPredictions(supabase))
      break
    case 'update_growth_stages':
      results.push(await updateGrowthStages(supabase))
      break
    case 'generate_market_data':
      results.push(await generateMarketData(supabase))
      break
    case 'intelligence_update':
      results.push(await updateIntelligenceLayer(supabase))
      break
    case 'area_intelligence':
      results.push(await updateAreaIntelligenceBatch(supabase))
      break
    case 'all':
      results.push(await updateWeatherData(supabase))
      results.push(await generateAdvisories(supabase))
      results.push(await updateYieldPredictions(supabase))
      results.push(await updateGrowthStages(supabase))
      results.push(await generateMarketData(supabase))
      results.push(await updateIntelligenceLayer(supabase))
      results.push(await updateAreaIntelligenceBatch(supabase))
      break
    default:
      return new Response(JSON.stringify({ error: 'Invalid task' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
  }

  return new Response(JSON.stringify({ 
    message: 'Scheduled tasks completed',
    results,
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleSchedulerStatus(req: Request, supabase: any) {
  const url = new URL(req.url)
  const detailed = url.searchParams.get('detailed') === 'true'

  // Get last run times from system logs
  const { data: lastRuns } = await supabase
    .from('system_logs')
    .select('message, created_at')
    .eq('level', 'info')
    .like('message', 'Scheduled task%')
    .order('created_at', { ascending: false })
    .limit(10)

  // Get system statistics
  const { data: stats } = await supabase
    .from('profiles')
    .select('role', { count: 'exact' })

  const { data: activeCrops } = await supabase
    .from('crop_cycles')
    .select('id', { count: 'exact' })
    .eq('status', 'active')

  const { data: weatherData } = await supabase
    .from('weather_data')
    .select('id', { count: 'exact' })
    .eq('date', new Date().toISOString().split('T')[0])

  const status = {
    scheduler_active: true,
    last_runs: lastRuns || [],
    system_stats: {
      total_users: stats?.length || 0,
      active_crops: activeCrops || 0,
      weather_data_today: weatherData || 0
    },
    next_scheduled_runs: {
      weather_update: getNextRunTime('0 */6 * * *'), // Every 6 hours
      advisory_generation: getNextRunTime('0 8 * * *'), // Daily at 8 AM
      yield_prediction: getNextRunTime('0 0 * * *'), // Daily at midnight
      growth_stage_update: getNextRunTime('0 */12 * * *'), // Every 12 hours
      market_data_update: getNextRunTime('0 18 * * *') // Daily at 6 PM
    }
  }

  if (detailed) {
    // Add more detailed information
    const { data: recentErrors } = await supabase
      .from('system_logs')
      .select('*')
      .eq('level', 'error')
      .order('created_at', { ascending: false })
      .limit(5)

    status.recent_errors = recentErrors || []
  }

  return new Response(JSON.stringify(status), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function updateWeatherData(supabase: any) {
  try {
    // Get all unique locations from active crop cycles
    const { data: locations } = await supabase
      .from('crop_cycles')
      .select('location_lat, location_lng')
      .eq('status', 'active')
      .not('location_lat', 'is', null)
      .not('location_lng', 'is', null)

    if (!locations || locations.length === 0) {
      return { task: 'weather_update', status: 'skipped', reason: 'No locations found' }
    }

    // Group locations to avoid duplicates
    const uniqueLocations = locations.reduce((acc: any, loc: any) => {
      const key = `${loc.location_lat},${loc.location_lng}`
      if (!acc[key]) {
        acc[key] = { lat: loc.location_lat, lng: loc.location_lng }
      }
      return acc
    }, {})

    const locationArray = Object.values(uniqueLocations)
    let updatedCount = 0

    for (const location of locationArray) {
      try {
        // Check if we already have fresh data
        const { data: existingData } = await supabase
          .from('weather_data')
          .select('expires_at')
          .eq('location_lat', location.lat)
          .eq('location_lng', location.lng)
          .eq('date', new Date().toISOString().split('T')[0])
          .single()

        if (!existingData || new Date(existingData.expires_at) <= new Date()) {
          // Fetch new weather data
          const weatherResponse = await fetch(
            `${supabaseUrl}/functions/v1/weather?lat=${location.lat}&lng=${location.lng}`,
            {
              headers: {
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json'
              }
            }
          )

          if (weatherResponse.ok) {
            updatedCount++
          }
        }
      } catch (error) {
        console.error(`Error updating weather for ${location.lat},${location.lng}:`, error)
      }
    }

    await logSystemEvent(supabase, 'info', `Weather data updated for ${updatedCount} locations`)

    return { 
      task: 'weather_update', 
      status: 'completed', 
      locations_updated: updatedCount,
      total_locations: locationArray.length
    }
  } catch (error: any) {
    await logSystemEvent(supabase, 'error', `Weather update failed: ${error.message}`)
    return { task: 'weather_update', status: 'error', error: error.message }
  }
}

async function generateAdvisories(supabase: any) {
  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/advisories`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'generate_automated' })
      }
    )

    if (response.ok) {
      const result = await response.json()
      await logSystemEvent(supabase, 'info', `Generated ${result.count || 0} automated advisories`)
      return { task: 'generate_advisories', status: 'completed', count: result.count || 0 }
    } else {
      throw new Error('Advisory generation failed')
    }
  } catch (error: any) {
    await logSystemEvent(supabase, 'error', `Advisory generation failed: ${error.message}`)
    return { task: 'generate_advisories', status: 'error', error: error.message }
  }
}

async function updateYieldPredictions(supabase: any) {
  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/yield-prediction`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'batch_generate' })
      }
    )

    if (response.ok) {
      const result = await response.json()
      await logSystemEvent(supabase, 'info', `Updated ${result.count || 0} yield predictions`)
      return { task: 'update_yield_predictions', status: 'completed', count: result.count || 0 }
    } else {
      throw new Error('Yield prediction update failed')
    }
  } catch (error: any) {
    await logSystemEvent(supabase, 'error', `Yield prediction update failed: ${error.message}`)
    return { task: 'update_yield_predictions', status: 'error', error: error.message }
  }
}

async function updateGrowthStages(supabase: any) {
  try {
    const { data: activeCrops } = await supabase
      .from('crop_cycles')
      .select('*')
      .eq('status', 'active')

    if (!activeCrops || activeCrops.length === 0) {
      return { task: 'update_growth_stages', status: 'skipped', reason: 'No active crops' }
    }

    let updatedCount = 0

    for (const crop of activeCrops) {
      const daysSinceSowing = Math.floor((Date.now() - new Date(crop.sowing_date).getTime()) / (1000 * 60 * 60 * 24))
      
      let newStage = crop.current_stage
      
      // Determine new stage based on days since sowing
      if (daysSinceSowing >= 10 && daysSinceSowing < 25 && crop.current_stage === 'sowing') {
        newStage = 'germination'
      } else if (daysSinceSowing >= 25 && daysSinceSowing < 60 && crop.current_stage === 'germination') {
        newStage = 'vegetative'
      } else if (daysSinceSowing >= 60 && daysSinceSowing < 90 && crop.current_stage === 'vegetative') {
        newStage = 'flowering'
      } else if (daysSinceSowing >= 90 && daysSinceSowing < 120 && crop.current_stage === 'flowering') {
        newStage = 'fruiting'
      } else if (daysSinceSowing >= 120 && daysSinceSowing < 150 && crop.current_stage === 'fruiting') {
        newStage = 'harvesting'
      }

      if (newStage !== crop.current_stage) {
        await supabase
          .from('crop_cycles')
          .update({ current_stage: newStage })
          .eq('id', crop.id)

        // Create advisory for stage change
        await supabase
          .from('advisories')
          .insert({
            farmer_id: crop.farmer_id,
            crop_cycle_id: crop.id,
            type: 'general',
            title: 'Growth Stage Updated',
            description: `Your ${crop.crop_type} crop has entered the ${newStage} stage.`,
            priority: 'medium',
            action_required: false
          })

        updatedCount++
      }
    }

    await logSystemEvent(supabase, 'info', `Updated growth stages for ${updatedCount} crops`)

    return { 
      task: 'update_growth_stages', 
      status: 'completed', 
      crops_updated: updatedCount,
      total_active_crops: activeCrops.length
    }
  } catch (error: any) {
    await logSystemEvent(supabase, 'error', `Growth stage update failed: ${error.message}`)
    return { task: 'update_growth_stages', status: 'error', error: error.message }
  }
}

async function generateMarketData(supabase: any) {
  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/market-intelligence`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'generate_mock' })
      }
    )

    if (response.ok) {
      const result = await response.json()
      await logSystemEvent(supabase, 'info', `Generated ${result.count || 0} market data points`)
      return { task: 'generate_market_data', status: 'completed', count: result.count || 0 }
    } else {
      throw new Error('Market data generation failed')
    }
  } catch (error: any) {
    await logSystemEvent(supabase, 'error', `Market data generation failed: ${error.message}`)
    return { task: 'generate_market_data', status: 'error', error: error.message }
  }
}

async function logSystemEvent(supabase: any, level: string, message: string) {
  try {
    await supabase
      .from('system_logs')
      .insert({
        level,
        message,
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Failed to log system event:', error)
  }
}

function getNextRunTime(cronExpression: string): string {
  // Simple implementation - in production, use a proper cron parser
  const now = new Date()
  const nextRun = new Date(now.getTime() + 6 * 60 * 60 * 1000) // 6 hours from now
  return nextRun.toISOString()
}

// Webhook for external scheduling services (like GitHub Actions, Vercel Cron, etc.)
export async function handleWebhook(req: Request, supabase: any) {
  const signature = req.headers.get('x-signature')
  const webhookSecret = Deno.env.get('WEBHOOK_SECRET')

  if (!signature || signature !== webhookSecret) {
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const { task } = await req.json()
  
  // Create a temporary admin user context for the scheduled task
  const tempAdminToken = await createTempAdminToken(supabase)
  
  const response = await fetch(
    `${supabaseUrl}/functions/v1/scheduler`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tempAdminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task })
    }
  )

  const result = await response.json()

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function createTempAdminToken(supabase: any): Promise<string> {
  // In production, this should use a proper service role key
  // For now, return the service role key
  return supabaseServiceKey
}
