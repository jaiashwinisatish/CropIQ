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
        return await handleDashboardGet(req, supabase)
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error: any) {
    console.error('Dashboard function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleDashboardGet(req: Request, supabase: any) {
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
  const dashboardType = url.searchParams.get('type') || 'farmer'

  // Get user profile to determine role
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

  switch (profile.role) {
    case 'farmer':
      return await getFarmerDashboard(user.id, supabase)
    case 'fpo':
      return await getFPODashboard(user.id, supabase)
    case 'admin':
      return await getAdminDashboard(supabase)
    default:
      return new Response(JSON.stringify({ error: 'Invalid user role' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
  }
}

async function getFarmerDashboard(farmerId: string, supabase: any) {
  // Get farmer's basic info
  const { data: farmer } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', farmerId)
    .single()

  // Get active crop cycles
  const { data: activeCrops } = await supabase
    .from('crop_cycles')
    .select(`
      *,
      yield_predictions:yield_predictions(
        predicted_yield_tons,
        confidence_score,
        prediction_date
      )
    `)
    .eq('farmer_id', farmerId)
    .eq('status', 'active')

  // Get unread advisories
  const { data: unreadAdvisories } = await supabase
    .from('advisories')
    .select(`
      *,
      crop_cycle:crop_cycles(
        crop_type,
        current_stage
      )
    `)
    .eq('farmer_id', farmerId)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(5)

  // Get recent yield predictions
  const { data: recentPredictions } = await supabase
    .from('yield_predictions')
    .select(`
      *,
      crop_cycle:crop_cycles(
        crop_type,
        field_size_acres
      )
    `)
    .eq('crop_cycle.farmer_id', farmerId)
    .order('prediction_date', { ascending: false })
    .limit(10)

  // Get weather data for farmer's location
  let weatherData = null
  if (farmer.location_lat && farmer.location_lng) {
    const { data: weather } = await supabase
      .from('weather_data')
      .select('*')
      .eq('location_lat', farmer.location_lat)
      .eq('location_lng', farmer.location_lng)
      .eq('date', new Date().toISOString().split('T')[0])
      .single()

    weatherData = weather
  }

  // Calculate summary statistics
  const totalActiveCrops = activeCrops?.length || 0
  const totalUnreadAdvisories = unreadAdvisories?.length || 0
  const totalPredictedYield = recentPredictions?.reduce((sum: number, p: any) => 
    sum + (p.predicted_yield_tons || 0), 0) || 0

  // Get crop distribution
  const cropDistribution = activeCrops?.reduce((acc: any, crop: any) => {
    acc[crop.crop_type] = (acc[crop.crop_type] || 0) + 1
    return acc
  }, {}) || {}

  // Get upcoming tasks based on advisories
  const upcomingTasks = unreadAdvisories?.filter((a: any) => a.action_required).slice(0, 3) || []

  const dashboard = {
    farmer: {
      name: farmer.full_name,
      location: `${farmer.district}, ${farmer.state}`,
      farm_size: farmer.farm_size_acres,
      language: farmer.language
    },
    overview: {
      active_crops: totalActiveCrops,
      unread_advisories: totalUnreadAdvisories,
      total_predicted_yield: Math.round(totalPredictedYield * 100) / 100,
      crop_distribution: cropDistribution
    },
    active_crops: activeCrops || [],
    unread_advisories: unreadAdvisories || [],
    recent_predictions: recentPredictions || [],
    current_weather: weatherData,
    upcoming_tasks: upcomingTasks
  }

  return new Response(JSON.stringify(dashboard), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getFPODashboard(fpoId: string, supabase: any) {
  // Get FPO information
  const { data: fpo } = await supabase
    .from('fpos')
    .select('*')
    .eq('id', fpoId)
    .single()

  if (!fpo) {
    return new Response(JSON.stringify({ error: 'FPO not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Get member farmers
  const { data: memberFarmers } = await supabase
    .from('fpo_farmers')
    .select(`
      farmer_id,
      profiles:farmer_id(
        full_name,
        farm_size_acres,
        district,
        state
      )
    `)
    .eq('fpo_id', fpoId)
    .eq('is_active', true)

  // Get all active crops from member farmers
  const farmerIds = memberFarmers?.map((f: any) => f.farmer_id) || []
  let activeCrops = []

  if (farmerIds.length > 0) {
    const { data: crops } = await supabase
      .from('crop_cycles')
      .select(`
        *,
        profiles:farmer_id(
          full_name,
          district
        ),
        yield_predictions:yield_predictions(
          predicted_yield_tons,
          confidence_score
        )
      `)
      .in('farmer_id', farmerIds)
      .eq('status', 'active')

    activeCrops = crops || []
  }

  // Get unread advisories for all members
  let unreadAdvisories = []
  if (farmerIds.length > 0) {
    const { data: advisories } = await supabase
      .from('advisories')
      .select(`
        *,
        profiles:farmer_id(
          full_name
        ),
        crop_cycle:crop_cycles(
          crop_type
        )
      `)
      .in('farmer_id', farmerIds)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(20)

    unreadAdvisories = advisories || []
  }

  // Calculate aggregate statistics
  const totalFarmers = memberFarmers?.length || 0
  const totalArea = memberFarmers?.reduce((sum: number, f: any) => 
    sum + (f.profiles?.farm_size_acres || 0), 0) || 0
  const totalActiveCrops = activeCrops.length
  const totalUnreadAdvisories = unreadAdvisories.length
  const totalPredictedYield = activeCrops.reduce((sum: number, crop: any) => 
    sum + (crop.yield_predictions?.[0]?.predicted_yield_tons || 0), 0)

  // Get crop distribution across all members
  const cropDistribution = activeCrops.reduce((acc: any, crop: any) => {
    acc[crop.crop_type] = (acc[crop.crop_type] || 0) + 1
    return acc
  }, {})

  // Get district-wise distribution
  const districtDistribution = memberFarmers?.reduce((acc: any, f: any) => {
    const district = f.profiles?.district || 'Unknown'
    acc[district] = (acc[district] || 0) + 1
    return acc
  }, {}) || {}

  // Get high-priority advisories
  const highPriorityAdvisories = unreadAdvisories.filter((a: any) => 
    a.priority === 'high' || a.priority === 'critical').slice(0, 5)

  const dashboard = {
    fpo: {
      name: fpo.name,
      registration_number: fpo.registration_number,
      total_farmers: totalFarmers,
      total_area: Math.round(totalArea * 100) / 100
    },
    overview: {
      active_crops: totalActiveCrops,
      unread_advisories: totalUnreadAdvisories,
      total_predicted_yield: Math.round(totalPredictedYield * 100) / 100,
      crop_distribution: cropDistribution,
      district_distribution: districtDistribution
    },
    member_farmers: memberFarmers || [],
    active_crops: activeCrops,
    high_priority_advisories: highPriorityAdvisories
  }

  return new Response(JSON.stringify(dashboard), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getAdminDashboard(supabase: any) {
  // Get overall system statistics
  const { data: totalStats } = await supabase
    .from('profiles')
    .select('role')
    .then(({ data }) => {
      const stats = {
        total_users: data?.length || 0,
        farmers: data?.filter((p: any) => p.role === 'farmer').length || 0,
        fpos: data?.filter((p: any) => p.role === 'fpo').length || 0,
        admins: data?.filter((p: any) => p.role === 'admin').length || 0
      }
      return { data: stats }
    })

  // Get active crop cycles
  const { data: activeCrops } = await supabase
    .from('crop_cycles')
    .select('crop_type, status')
    .eq('status', 'active')

  // Get total FPOs
  const { data: totalFPOs } = await supabase
    .from('fpos')
    .select('id')

  // Get recent advisories
  const { data: recentAdvisories } = await supabase
    .from('advisories')
    .select(`
      *,
      profiles:farmer_id(
        full_name,
        role
      ),
      crop_cycle:crop_cycles(
        crop_type
      )
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  // Get system health metrics
  const { data: weatherDataCount } = await supabase
    .from('weather_data')
    .select('id', { count: 'exact' })

  const { data: marketDataCount } = await supabase
    .from('market_prices')
    .select('id', { count: 'exact' })

  // Get crop distribution across all users
  const cropDistribution = activeCrops?.reduce((acc: any, crop: any) => {
    acc[crop.crop_type] = (acc[crop.crop_type] || 0) + 1
    return acc
  }, {}) || {}

  // Get recent system logs
  const { data: recentLogs } = await supabase
    .from('system_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  // Calculate growth metrics (simplified)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  
  const { data: newUsers } = await supabase
    .from('profiles')
    .select('id')
    .gte('created_at', thirtyDaysAgo)

  const { data: newCrops } = await supabase
    .from('crop_cycles')
    .select('id')
    .gte('created_at', thirtyDaysAgo)

  const dashboard = {
    system_overview: {
      ...totalStats,
      total_fpos: totalFPOs?.length || 0,
      active_crops: activeCrops?.length || 0,
      weather_data_points: weatherDataCount || 0,
      market_data_points: marketDataCount || 0
    },
    growth_metrics: {
      new_users_last_30_days: newUsers?.length || 0,
      new_crops_last_30_days: newCrops?.length || 0
    },
    crop_distribution: cropDistribution,
    recent_advisories: recentAdvisories || [],
    system_logs: recentLogs || []
  }

  return new Response(JSON.stringify(dashboard), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

// Analytics endpoint for detailed insights
export async function getAnalytics(req: Request, supabase: any) {
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
  const metric = url.searchParams.get('metric')
  const period = url.searchParams.get('period') || '30'

  // Get user profile to determine role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return new Response(JSON.stringify({ error: 'Profile not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  switch (metric) {
    case 'yield_trends':
      return await getYieldTrends(user.id, profile.role, period, supabase)
    case 'advisory_effectiveness':
      return await getAdvisoryEffectiveness(user.id, profile.role, period, supabase)
    case 'crop_performance':
      return await getCropPerformance(user.id, profile.role, period, supabase)
    default:
      return new Response(JSON.stringify({ error: 'Invalid metric' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
  }
}

async function getYieldTrends(userId: string, role: string, period: string, supabase: any) {
  let query = supabase
    .from('yield_predictions')
    .select(`
      prediction_date,
      predicted_yield_tons,
      confidence_score,
      crop_cycle:crop_cycles(
        crop_type,
        farmer_id
      )
    `)
    .gte('prediction_date', new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    .order('prediction_date', { ascending: true })

  if (role === 'farmer') {
    query = query.eq('crop_cycle.farmer_id', userId)
  }

  const { data: predictions } = await query

  // Process data for trends
  const trends = predictions?.reduce((acc: any, p: any) => {
    const date = p.prediction_date
    const cropType = p.crop_cycle.crop_type
    
    if (!acc[date]) {
      acc[date] = {}
    }
    
    if (!acc[date][cropType]) {
      acc[date][cropType] = []
    }
    
    acc[date][cropType].push({
      yield: p.predicted_yield_tons,
      confidence: p.confidence_score
    })
    
    return acc
  }, {}) || {}

  return new Response(JSON.stringify({ trends }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getAdvisoryEffectiveness(userId: string, role: string, period: string, supabase: any) {
  let query = supabase
    .from('advisories')
    .select(`
      type,
      priority,
      is_read,
      created_at,
      crop_cycle:crop_cycles(
        crop_type,
        farmer_id
      )
    `)
    .gte('created_at', new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString())

  if (role === 'farmer') {
    query = query.eq('farmer_id', userId)
  }

  const { data: advisories } = await query

  // Calculate effectiveness metrics
  const totalAdvisories = advisories?.length || 0
  const readAdvisories = advisories?.filter((a: any) => a.is_read).length || 0
  const readRate = totalAdvisories > 0 ? (readAdvisories / totalAdvisories) * 100 : 0

  const typeDistribution = advisories?.reduce((acc: any, a: any) => {
    acc[a.type] = (acc[a.type] || 0) + 1
    return acc
  }, {}) || {}

  const priorityDistribution = advisories?.reduce((acc: any, a: any) => {
    acc[a.priority] = (acc[a.priority] || 0) + 1
    return acc
  }, {}) || {}

  return new Response(JSON.stringify({
    total_advisories: totalAdvisories,
    read_advisories: readAdvisories,
    read_rate: Math.round(readRate * 100) / 100,
    type_distribution: typeDistribution,
    priority_distribution: priorityDistribution
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getCropPerformance(userId: string, role: string, period: string, supabase: any) {
  let query = supabase
    .from('crop_cycles')
    .select(`
      crop_type,
      status,
      sowing_date,
      field_size_acres,
      current_stage,
      yield_predictions:yield_predictions(
        predicted_yield_tons,
        confidence_score
      ),
      advisories:advisories(count)
    `)
    .gte('created_at', new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString())

  if (role === 'farmer') {
    query = query.eq('farmer_id', userId)
  }

  const { data: crops } = await query

  // Calculate performance metrics by crop type
  const performance = crops?.reduce((acc: any, crop: any) => {
    const cropType = crop.crop_type
    
    if (!acc[cropType]) {
      acc[cropType] = {
        total_crops: 0,
        active_crops: 0,
        completed_crops: 0,
        total_area: 0,
        total_predicted_yield: 0,
        avg_confidence: 0,
        total_advisories: 0
      }
    }
    
    acc[cropType].total_crops += 1
    acc[cropType].total_area += crop.field_size_acres || 0
    acc[cropType].total_advisories += crop.advisories?.[0]?.count || 0
    
    if (crop.status === 'active') {
      acc[cropType].active_crops += 1
    } else if (crop.status === 'completed') {
      acc[cropType].completed_crops += 1
    }
    
    const prediction = crop.yield_predictions?.[0]
    if (prediction) {
      acc[cropType].total_predicted_yield += prediction.predicted_yield_tons
      acc[cropType].avg_confidence += prediction.confidence_score
    }
    
    return acc
  }, {}) || {}

  // Calculate averages
  Object.keys(performance).forEach(cropType => {
    const data = performance[cropType]
    if (data.total_crops > 0) {
      data.avg_confidence = Math.round((data.avg_confidence / data.total_crops) * 100) / 100
    }
  })

  return new Response(JSON.stringify(performance), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
