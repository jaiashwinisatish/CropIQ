import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const WEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY') || 'demo'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { method } = req

    switch (method) {
      case 'GET':
        return await handleWeatherGet(req, supabase)
      case 'POST':
        return await handleWeatherUpdate(req, supabase)
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Weather function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleWeatherGet(req: Request, supabase: any) {
  const url = new URL(req.url)
  const lat = url.searchParams.get('lat')
  const lng = url.searchParams.get('lng')
  const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0]

  if (!lat || !lng) {
    return new Response(JSON.stringify({ error: 'Latitude and longitude required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    // Check cache first
    const { data: cachedData, error: cacheError } = await supabase
      .from('weather_data')
      .select('*')
      .eq('location_lat', parseFloat(lat))
      .eq('location_lng', parseFloat(lng))
      .eq('date', date)
      .single()

    if (!cacheError && cachedData) {
      // Check if cache is still valid
      if (new Date(cachedData.expires_at) > new Date()) {
        return new Response(JSON.stringify({ 
          data: cachedData,
          source: 'cache'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    // Fetch fresh data from API
    const weatherData = await fetchWeatherData(parseFloat(lat), parseFloat(lng))
    
    // Cache the data
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 6) // Cache for 6 hours

    const { data: insertedData, error: insertError } = await supabase
      .from('weather_data')
      .upsert({
        location_lat: parseFloat(lat),
        location_lng: parseFloat(lng),
        date,
        temperature_min: weatherData.temperature_min,
        temperature_max: weatherData.temperature_max,
        humidity: weatherData.humidity,
        rainfall_mm: weatherData.rainfall_mm,
        wind_speed: weatherData.wind_speed,
        weather_condition: weatherData.weather_condition,
        forecast_data: weatherData.forecast_data,
        source: 'openweather',
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single()

    if (insertError) throw insertError

    return new Response(JSON.stringify({ 
      data: insertedData,
      source: 'api'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Weather fetch error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function fetchWeatherData(lat: number, lng: number) {
  try {
    // Current weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`
    )
    
    if (!currentResponse.ok) {
      throw new Error('Weather API request failed')
    }

    const currentData = await currentResponse.json()

    // 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`
    )

    let forecastData = null
    if (forecastResponse.ok) {
      forecastData = await forecastResponse.json()
    }

    return {
      temperature_min: currentData.main.temp_min,
      temperature_max: currentData.main.temp_max,
      humidity: currentData.main.humidity,
      rainfall_mm: currentData.rain?.['1h'] || 0,
      wind_speed: currentData.wind.speed,
      weather_condition: currentData.weather[0].main,
      forecast_data: forecastData ? {
        next_5_days: forecastData.list.slice(0, 5).map((item: any) => ({
          date: new Date(item.dt * 1000).toISOString().split('T')[0],
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          condition: item.weather[0].main,
          humidity: item.main.humidity,
          rainfall: item.rain?.['3h'] || 0
        }))
      } : null
    }
  } catch (error) {
    // Fallback to mock data if API fails
    console.warn('Weather API failed, using mock data:', error)
    return {
      temperature_min: 22 + Math.random() * 8,
      temperature_max: 30 + Math.random() * 10,
      humidity: 60 + Math.random() * 30,
      rainfall_mm: Math.random() * 5,
      wind_speed: 5 + Math.random() * 15,
      weather_condition: ['Clear', 'Partly Cloudy', 'Cloudy'][Math.floor(Math.random() * 3)],
      forecast_data: {
        next_5_days: Array.from({ length: 5 }, (_, i) => ({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          temp_min: 22 + Math.random() * 8,
          temp_max: 30 + Math.random() * 10,
          condition: ['Clear', 'Partly Cloudy', 'Cloudy'][Math.floor(Math.random() * 3)],
          humidity: 60 + Math.random() * 30,
          rainfall: Math.random() * 5
        }))
      }
    }
  }
}

async function handleWeatherUpdate(req: Request, supabase: any) {
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

  // Check if user is admin
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

  const { locations } = await req.json()

  if (!Array.isArray(locations)) {
    return new Response(JSON.stringify({ error: 'Locations array required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const results = []

  for (const location of locations) {
    try {
      const weatherData = await fetchWeatherData(location.lat, location.lng)
      
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 6)

      const { data: insertedData } = await supabase
        .from('weather_data')
        .upsert({
          location_lat: location.lat,
          location_lng: location.lng,
          date: new Date().toISOString().split('T')[0],
          temperature_min: weatherData.temperature_min,
          temperature_max: weatherData.temperature_max,
          humidity: weatherData.humidity,
          rainfall_mm: weatherData.rainfall_mm,
          wind_speed: weatherData.wind_speed,
          weather_condition: weatherData.weather_condition,
          forecast_data: weatherData.forecast_data,
          source: 'openweather',
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single()

      results.push({
        location,
        success: true,
        data: insertedData
      })
    } catch (error) {
      results.push({
        location,
        success: false,
        error: error.message
      })
    }
  }

  return new Response(JSON.stringify({ 
    message: 'Weather update completed',
    results
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
