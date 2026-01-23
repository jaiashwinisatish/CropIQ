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
        return await handleMarketGet(req, supabase)
      case 'POST':
        return await handleMarketUpdate(req, supabase)
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error: any) {
    console.error('Market intelligence function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleMarketGet(req: Request, supabase: any) {
  const url = new URL(req.url)
  const cropType = url.searchParams.get('crop_type')
  const state = url.searchParams.get('state')
  const days = parseInt(url.searchParams.get('days') || '30')
  const trend = url.searchParams.get('trend') === 'true'

  let query = supabase
    .from('market_prices')
    .select('*')
    .order('date', { ascending: false })
    .limit(days * 10) // Approximate daily data

  if (cropType) {
    query = query.eq('crop_type', cropType)
  }

  if (state) {
    query = query.eq('state', state)
  }

  const { data: prices, error: pricesError } = await query

  if (pricesError) throw pricesError

  if (trend && prices.length > 0) {
    // Calculate trends
    const trends = calculatePriceTrends(prices)
    return new Response(JSON.stringify({ 
      prices,
      trends,
      count: prices.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ 
    prices,
    count: prices.length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleMarketUpdate(req: Request, supabase: any) {
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

  const { market_data } = await req.json()

  if (!Array.isArray(market_data)) {
    return new Response(JSON.stringify({ error: 'Market data array required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const results = []

  for (const data of market_data) {
    try {
      const { data: insertedData } = await supabase
        .from('market_prices')
        .upsert({
          crop_type: data.crop_type,
          market_name: data.market_name,
          district: data.district,
          state: data.state,
          price_per_quintal: data.price_per_quintal,
          price_change_percent: data.price_change_percent || 0,
          date: data.date || new Date().toISOString().split('T')[0],
          source: data.source || 'admin'
        })
        .select()
        .single()

      results.push({
        success: true,
        data: insertedData
      })
    } catch (error: any) {
      results.push({
        success: false,
        error: error.message,
        data
      })
    }
  }

  return new Response(JSON.stringify({ 
    message: 'Market data update completed',
    results
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

function calculatePriceTrends(prices: any[]) {
  const trends = {}
  const cropTypes = [...new Set(prices.map(p => p.crop_type))]

  for (const cropType of cropTypes) {
    const cropPrices = prices.filter(p => p.crop_type === cropType)
    
    if (cropPrices.length >= 2) {
      const latest = cropPrices[0]
      const previous = cropPrices[1]
      
      const priceChange = latest.price_per_quintal - previous.price_per_quintal
      const priceChangePercent = (priceChange / previous.price_per_quintal) * 100
      
      // Calculate 7-day average if enough data
      let sevenDayAvg = null
      if (cropPrices.length >= 7) {
        const lastSeven = cropPrices.slice(0, 7)
        sevenDayAvg = lastSeven.reduce((sum, p) => sum + p.price_per_quintal, 0) / 7
      }
      
      // Calculate 30-day average if enough data
      let thirtyDayAvg = null
      if (cropPrices.length >= 30) {
        const lastThirty = cropPrices.slice(0, 30)
        thirtyDayAvg = lastThirty.reduce((sum, p) => sum + p.price_per_quintal, 0) / 30
      }
      
      trends[cropType] = {
        current_price: latest.price_per_quintal,
        previous_price: previous.price_per_quintal,
        price_change: Math.round(priceChange * 100) / 100,
        price_change_percent: Math.round(priceChangePercent * 100) / 100,
        seven_day_average: sevenDayAvg ? Math.round(sevenDayAvg * 100) / 100 : null,
        thirty_day_average: thirtyDayAvg ? Math.round(thirtyDayAvg * 100) / 100 : null,
        trend_direction: priceChangePercent > 2 ? 'up' : priceChangePercent < -2 ? 'down' : 'stable',
        volatility: calculateVolatility(cropPrices.slice(0, 10))
      }
    }
  }

  return trends
}

function calculateVolatility(prices: any[]) {
  if (prices.length < 2) return 0
  
  const returns = []
  for (let i = 1; i < prices.length; i++) {
    const returnRate = (prices[i].price_per_quintal - prices[i-1].price_per_quintal) / prices[i-1].price_per_quintal
    returns.push(returnRate)
  }
  
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length
  const standardDeviation = Math.sqrt(variance)
  
  return Math.round(standardDeviation * 10000) / 100 // Convert to percentage
}

// Generate mock market data for testing
export async function generateMockMarketData(supabase: any) {
  const cropTypes = ['rice', 'wheat', 'cotton', 'sugarcane', 'maize', 'pulses']
  const markets = [
    { name: 'Mandi Market', state: 'Punjab', district: 'Ludhiana' },
    { name: 'Grain Market', state: 'Haryana', district: 'Karnal' },
    { name: 'Cotton Market', state: 'Gujarat', district: 'Ahmedabad' },
    { name: 'Sugar Market', state: 'Uttar Pradesh', district: 'Lucknow' },
    { name: 'Pulse Market', state: 'Madhya Pradesh', district: 'Indore' }
  ]

  const basePrices = {
    'rice': 2200,
    'wheat': 2100,
    'cotton': 6500,
    'sugarcane': 320,
    'maize': 1800,
    'pulses': 4500
  }

  const mockData = []

  // Generate data for the last 30 days
  for (let day = 0; day < 30; day++) {
    const date = new Date()
    date.setDate(date.getDate() - day)
    const dateStr = date.toISOString().split('T')[0]

    for (const cropType of cropTypes) {
      for (const market of markets) {
        const basePrice = basePrices[cropType]
        const randomVariation = (Math.random() - 0.5) * 0.1 // ±5% variation
        const seasonalFactor = 1 + Math.sin(day / 30 * Math.PI * 2) * 0.05 // Seasonal variation
        const price = basePrice * (1 + randomVariation) * seasonalFactor
        
        mockData.push({
          crop_type: cropType,
          market_name: market.name,
          district: market.district,
          state: market.state,
          price_per_quintal: Math.round(price * 100) / 100,
          price_change_percent: day > 0 ? Math.round((Math.random() - 0.5) * 10 * 100) / 100 : 0,
          date: dateStr,
          source: 'mock'
        })
      }
    }
  }

  // Insert mock data
  const { data: insertedData, error } = await supabase
    .from('market_prices')
    .upsert(mockData, { onConflict: 'crop_type,market_name,district,state,date' })
    .select()

  if (error) {
    console.error('Error inserting mock market data:', error)
    throw error
  }

  return {
    message: 'Mock market data generated successfully',
    count: mockData.length,
    inserted: insertedData?.length || 0
  }
}

// Market price prediction
export async function predictMarketPrices(req: Request, supabase: any) {
  const url = new URL(req.url)
  const cropType = url.searchParams.get('crop_type')
  const days = parseInt(url.searchParams.get('days') || '7')

  if (!cropType) {
    return new Response(JSON.stringify({ error: 'Crop type required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Get historical data
  const { data: historicalData } = await supabase
    .from('market_prices')
    .select('*')
    .eq('crop_type', cropType)
    .order('date', { ascending: false })
    .limit(30)

  if (!historicalData || historicalData.length < 7) {
    return new Response(JSON.stringify({ error: 'Insufficient historical data' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Simple linear regression for prediction
  const prices = historicalData.map(d => d.price_per_quintal).reverse()
  const predictions = []

  for (let i = 1; i <= days; i++) {
    const trend = calculateLinearTrend(prices)
    const predictedPrice = trend.intercept + trend.slope * (prices.length + i)
    
    // Add some randomness for realism
    const randomFactor = 1 + (Math.random() - 0.5) * 0.05
    const finalPrice = predictedPrice * randomFactor
    
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + i)
    
    predictions.push({
      date: futureDate.toISOString().split('T')[0],
      predicted_price: Math.round(finalPrice * 100) / 100,
      confidence: Math.max(0.5, 0.9 - (i * 0.05)), // Decreasing confidence
      trend_direction: trend.slope > 0 ? 'up' : trend.slope < 0 ? 'down' : 'stable'
    })
  }

  return new Response(JSON.stringify({ 
    crop_type: cropType,
    predictions,
    model: 'linear_regression',
    data_points: prices.length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

function calculateLinearTrend(data: number[]) {
  const n = data.length
  const x = Array.from({ length: n }, (_, i) => i)
  const y = data

  const sumX = x.reduce((sum, val) => sum + val, 0)
  const sumY = y.reduce((sum, val) => sum + val, 0)
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0)
  const sumXX = x.reduce((sum, val) => sum + val * val, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  return { slope, intercept }
}
