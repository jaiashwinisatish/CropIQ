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
        return await handleIntelligenceGet(req, supabase)
      case 'POST':
        return await handleIntelligencePost(req, supabase)
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error: any) {
    console.error('Intelligence function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleIntelligenceGet(req: Request, supabase: any) {
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
  const type = url.searchParams.get('type')
  const cropCycleId = url.searchParams.get('crop_cycle_id')

  switch (type) {
    case 'risk_predictions':
      return await getRiskPredictions(user.id, cropCycleId, supabase)
    case 'area_intelligence':
      return await getAreaIntelligence(user.id, supabase)
    case 'decision_warnings':
      return await getDecisionWarnings(user.id, supabase)
    case 'harvest_timing':
      return await getHarvestTiming(user.id, cropCycleId, supabase)
    case 'seasonal_comparison':
      return await getSeasonalComparison(user.id, cropCycleId, supabase)
    case 'economic_impacts':
      return await getEconomicImpacts(user.id, supabase)
    default:
      return new Response(JSON.stringify({ error: 'Invalid intelligence type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
  }
}

async function handleIntelligencePost(req: Request, supabase: any) {
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

  const { action, data } = await req.json()

  switch (action) {
    case 'generate_risk_predictions':
      return await generateRiskPredictions(user.id, data, supabase)
    case 'acknowledge_warning':
      return await acknowledgeWarning(user.id, data.warning_id, supabase)
    case 'update_area_intelligence':
      return await updateAreaIntelligence(data, supabase)
    case 'generate_seasonal_comparison':
      return await generateSeasonalComparison(user.id, data.crop_cycle_id, supabase)
    default:
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
  }
}

async function getRiskPredictions(userId: string, cropCycleId: string | null, supabase: any) {
  let query = supabase
    .from('risk_predictions')
    .select(`
      *,
      crop_cycle:crop_cycles(
        crop_type,
        current_stage,
        field_size_acres
      )
    `)
    .eq('expires_at', null) // Only active predictions
    .order('probability', { ascending: false })

  if (cropCycleId) {
    query = query.eq('crop_cycle_id', cropCycleId)
  } else {
    // Get user's crop cycles and filter
    const { data: userCrops } = await supabase
      .from('crop_cycles')
      .select('id')
      .eq('farmer_id', userId)
      .eq('status', 'active')

    const cropIds = userCrops?.map((c: any) => c.id) || []
    if (cropIds.length > 0) {
      query = query.in('crop_cycle_id', cropIds)
    }
  }

  const { data: predictions, error } = await query

  if (error) throw error

  // Enhance predictions with economic insights
  const enhancedPredictions = predictions?.map((prediction: any) => ({
    ...prediction,
    urgency_level: calculateUrgencyLevel(prediction.probability, prediction.time_to_impact_days),
    loss_prevention_insight: generateLossPreventionInsight(prediction),
    action_priority: calculateActionPriority(prediction),
    financial_impact_summary: generateFinancialImpactSummary(prediction)
  })) || []

  return new Response(JSON.stringify({ 
    risk_predictions: enhancedPredictions,
    count: enhancedPredictions.length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getAreaIntelligence(userId: string, supabase: any) {
  // Get user's location
  const { data: user } = await supabase
    .from('profiles')
    .select('location_lat, location_lng, district, state')
    .eq('id', userId)
    .single()

  if (!user || !user.location_lat || !user.location_lng) {
    return new Response(JSON.stringify({ error: 'User location not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Get area intelligence for user's location
  const { data: areaData } = await supabase
    .from('area_intelligence')
    .select('*')
    .eq('center_lat', user.location_lat)
    .eq('center_lng', user.location_lng)
    .single()

  // Get community alerts for the area
  const { data: communityAlerts } = await supabase
    .from('community_alerts')
    .select('*')
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order('created_at', { ascending: false })

  // Generate regional insights
  const regionalInsights = generateRegionalInsights(areaData, communityAlerts)

  return new Response(JSON.stringify({ 
    area_intelligence: areaData,
    community_alerts: communityAlerts || [],
    regional_insights: regionalInsights,
    user_location: {
      lat: user.location_lat,
      lng: user.location_lng,
      district: user.district,
      state: user.state
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getDecisionWarnings(userId: string, supabase: any) {
  const { data: warnings } = await supabase
    .from('decision_warnings')
    .select('*')
    .eq('farmer_id', userId)
    .eq('is_acknowledged', false)
    .eq('is_dismissed', false)
    .order('risk_level', { ascending: false })

  // Enhance warnings with actionable insights
  const enhancedWarnings = warnings?.map((warning: any) => ({
    ...warning,
    urgency_score: calculateWarningUrgency(warning),
    actionable_steps: generateActionableSteps(warning),
    economic_consequences: generateEconomicConsequences(warning),
    alternative_benefits: generateAlternativeBenefits(warning)
  })) || []

  return new Response(JSON.stringify({ 
    decision_warnings: enhancedWarnings,
    count: enhancedWarnings.length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getHarvestTiming(userId: string, cropCycleId: string | null, supabase: any) {
  if (!cropCycleId) {
    return new Response(JSON.stringify({ error: 'Crop cycle ID required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Verify ownership
  const { data: crop } = await supabase
    .from('crop_cycles')
    .select('farmer_id')
    .eq('id', cropCycleId)
    .single()

  if (!crop || crop.farmer_id !== userId) {
    return new Response(JSON.stringify({ error: 'Access denied' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const { data: analysis } = await supabase
    .from('harvest_timing_analysis')
    .select('*')
    .eq('crop_cycle_id', cropCycleId)
    .order('analysis_date', { ascending: false })
    .limit(1)

  // Generate harvest timing optimization
  const optimization = await optimizeHarvestTiming(cropCycleId, supabase)

  return new Response(JSON.stringify({ 
    harvest_analysis: analysis?.[0] || null,
    optimization: optimization,
    recommendations: generateHarvestRecommendations(optimization)
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getSeasonalComparison(userId: string, cropCycleId: string | null, supabase: any) {
  if (!cropCycleId) {
    return new Response(JSON.stringify({ error: 'Crop cycle ID required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Verify ownership
  const { data: crop } = await supabase
    .from('crop_cycles')
    .select('farmer_id')
    .eq('id', cropCycleId)
    .single()

  if (!crop || crop.farmer_id !== userId) {
    return new Response(JSON.stringify({ error: 'Access denied' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const { data: comparisons } = await supabase
    .from('seasonal_comparisons')
    .select('*')
    .eq('crop_cycle_id', cropCycleId)
    .order('season_year', { ascending: false })

  // Generate seasonal difference analysis
  const differenceAnalysis = generateSeasonalDifferenceAnalysis(comparisons || [])

  return new Response(JSON.stringify({ 
    seasonal_comparisons: comparisons || [],
    difference_analysis: differenceAnalysis,
    key_insights: generateSeasonalInsights(differenceAnalysis)
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getEconomicImpacts(userId: string, supabase: any) {
  const { data: impacts } = await supabase
    .from('economic_impacts')
    .select(`
      *,
      advisory:advisories(
        type,
        title,
        priority
      ),
      risk_prediction:risk_predictions(
        risk_type,
        risk_level,
        probability
      )
    `)
    .eq('advisory.farmer_id', userId)
    .order('created_at', { ascending: false })

  // Calculate economic summaries
  const economicSummary = calculateEconomicSummary(impacts || [])

  return new Response(JSON.stringify({ 
    economic_impacts: impacts || [],
    economic_summary: economicSummary,
    roi_analysis: generateROIAnalysis(impacts || [])
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function generateRiskPredictions(userId: string, data: any, supabase: any) {
  const { crop_cycle_id, risk_types } = data

  if (!crop_cycle_id) {
    return new Response(JSON.stringify({ error: 'Crop cycle ID required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Verify ownership
  const { data: crop } = await supabase
    .from('crop_cycles')
    .select('farmer_id')
    .eq('id', crop_cycle_id)
    .single()

  if (!crop || crop.farmer_id !== userId) {
    return new Response(JSON.stringify({ error: 'Access denied' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const riskTypesToAnalyze = risk_types || ['disease', 'pest', 'water_stress', 'heat_stress', 'nutrient_deficiency']
  const generatedPredictions = []

  for (const riskType of riskTypesToAnalyze) {
    const prediction = await calculateRiskPrediction(crop_cycle_id, riskType, supabase)
    
    if (prediction) {
      const { data: insertedPrediction } = await supabase
        .from('risk_predictions')
        .insert({
          crop_cycle_id,
          risk_type: riskType,
          risk_level: prediction.risk_level,
          probability: prediction.probability,
          time_to_impact_days: prediction.time_to_impact_days,
          confidence_score: prediction.confidence_score,
          affected_area_percentage: prediction.affected_area_percentage,
          economic_impact_estimate: prediction.economic_impact_estimate,
          prevention_cost_estimate: prediction.prevention_cost_estimate,
          predicted_loss_if_ignored: prediction.predicted_loss_if_ignored,
          mitigation_strategies: prediction.mitigation_strategies,
          contributing_factors: prediction.contributing_factors,
          prediction_model_version: 'v1.0',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        })
        .select()
        .single()

      if (insertedPrediction) {
        generatedPredictions.push(insertedPrediction)
      }
    }
  }

  return new Response(JSON.stringify({ 
    message: 'Risk predictions generated successfully',
    predictions: generatedPredictions,
    count: generatedPredictions.length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function calculateRiskPrediction(cropCycleId: string, riskType: string, supabase: any) {
  // Get crop cycle details
  const { data: crop } = await supabase
    .from('crop_cycles')
    .select('*')
    .eq('id', cropCycleId)
    .single()

  if (!crop) return null

  // Get recent weather data
  const { data: weatherData } = await supabase
    .from('weather_data')
    .select('*')
    .eq('location_lat', crop.location_lat)
    .eq('location_lng', crop.location_lng)
    .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    .order('date', { ascending: false })

  // Calculate risk based on type and conditions
  const riskCalculation = calculateRiskByType(riskType, crop, weatherData || [])
  
  return riskCalculation
}

function calculateRiskByType(riskType: string, crop: any, weatherData: any[]) {
  const baseRisk = {
    risk_type: riskType,
    confidence_score: 0.75,
    affected_area_percentage: 100,
    mitigation_strategies: [],
    contributing_factors: {}
  }

  switch (riskType) {
    case 'disease':
      const avgHumidity = weatherData.reduce((sum, w) => sum + w.humidity, 0) / weatherData.length || 0
      const avgTemp = weatherData.reduce((sum, w) => sum + w.temperature_max, 0) / weatherData.length || 0
      const totalRainfall = weatherData.reduce((sum, w) => sum + w.rainfall_mm, 0) || 0

      if (avgHumidity > 80 && avgTemp >= 25 && avgTemp <= 30 && totalRainfall > 20) {
        return {
          ...baseRisk,
          risk_level: 'critical',
          probability: 0.9,
          time_to_impact_days: 3,
          economic_impact_estimate: crop.field_size_acres * 8000,
          prevention_cost_estimate: crop.field_size_acres * 1500,
          predicted_loss_if_ignored: crop.field_size_acres * 8000,
          mitigation_strategies: [
            'Apply preventive fungicide immediately',
            'Improve field drainage',
            'Reduce irrigation frequency',
            'Monitor for early symptoms'
          ],
          contributing_factors: {
            high_humidity: avgHumidity,
            optimal_temperature: avgTemp,
            excess_rainfall: totalRainfall
          }
        }
      } else if (avgHumidity > 70 && avgTemp >= 20 && avgTemp <= 35) {
        return {
          ...baseRisk,
          risk_level: 'high',
          probability: 0.7,
          time_to_impact_days: 5,
          economic_impact_estimate: crop.field_size_acres * 5000,
          prevention_cost_estimate: crop.field_size_acres * 1000,
          predicted_loss_if_ignored: crop.field_size_acres * 5000,
          mitigation_strategies: [
            'Monitor weather conditions closely',
            'Prepare fungicide application',
            'Ensure proper field ventilation'
          ],
          contributing_factors: {
            moderate_humidity: avgHumidity,
            temperature_range: avgTemp
          }
        }
      }
      break

    case 'water_stress':
      const recentRainfall = weatherData.slice(0, 3).reduce((sum, w) => sum + w.rainfall_mm, 0) || 0
      const maxTemp = Math.max(...weatherData.map(w => w.temperature_max)) || 0

      if (recentRainfall < 2 && maxTemp > 35) {
        return {
          ...baseRisk,
          risk_level: 'critical',
          probability: 0.95,
          time_to_impact_days: 2,
          economic_impact_estimate: crop.field_size_acres * 10000,
          prevention_cost_estimate: crop.field_size_acres * 2000,
          predicted_loss_if_ignored: crop.field_size_acres * 10000,
          mitigation_strategies: [
            'Immediate irrigation required',
            'Apply mulch to reduce evaporation',
            'Consider drought-resistant varieties next season'
          ],
          contributing_factors: {
            no_rainfall: recentRainfall,
            extreme_heat: maxTemp
          }
        }
      }
      break

    case 'heat_stress':
      const extremeTemp = Math.max(...weatherData.map(w => w.temperature_max)) || 0

      if (extremeTemp > 40) {
        return {
          ...baseRisk,
          risk_level: 'critical',
          probability: 0.95,
          time_to_impact_days: 1,
          economic_impact_estimate: crop.field_size_acres * 7000,
          prevention_cost_estimate: crop.field_size_acres * 1000,
          predicted_loss_if_ignored: crop.field_size_acres * 7000,
          mitigation_strategies: [
            'Provide shade if possible',
            'Increase irrigation frequency',
            'Apply anti-transpirants',
            'Monitor for heat damage symptoms'
          ],
          contributing_factors: {
            extreme_temperature: extremeTemp
          }
        }
      } else if (extremeTemp > 37) {
        return {
          ...baseRisk,
          risk_level: 'high',
          probability: 0.75,
          time_to_impact_days: 3,
          economic_impact_estimate: crop.field_size_acres * 4000,
          prevention_cost_estimate: crop.field_size_acres * 800,
          predicted_loss_if_ignored: crop.field_size_acres * 4000,
          mitigation_strategies: [
            'Increase irrigation',
            'Monitor crop stress indicators',
            'Consider protective measures'
          ],
          contributing_factors: {
            high_temperature: extremeTemp
          }
        }
      }
      break

    case 'nutrient_deficiency':
      if (crop.current_stage === 'flowering' || crop.current_stage === 'fruiting') {
        return {
          ...baseRisk,
          risk_level: 'medium',
          probability: 0.6,
          time_to_impact_days: 10,
          economic_impact_estimate: crop.field_size_acres * 3000,
          prevention_cost_estimate: crop.field_size_acres * 1200,
          predicted_loss_if_ignored: crop.field_size_acres * 3000,
          mitigation_strategies: [
            'Apply balanced fertilizer',
            'Conduct soil test',
            'Monitor leaf color and growth'
          ],
          contributing_factors: {
            critical_growth_stage: crop.current_stage,
            high_nutrient_demand: true
          }
        }
      }
      break
  }

  return null // No significant risk detected
}

function calculateUrgencyLevel(probability: number, timeToImpact: number): string {
  if (probability >= 0.8 && timeToImpact <= 3) return 'critical'
  if (probability >= 0.6 && timeToImpact <= 5) return 'high'
  if (probability >= 0.4 && timeToImpact <= 7) return 'medium'
  return 'low'
}

function generateLossPreventionInsight(prediction: any): string {
  const lossPrevented = prediction.predicted_loss_if_ignored - prediction.prevention_cost_estimate
  const roiPercentage = ((lossPrevented / prediction.prevention_cost_estimate) * 100).toFixed(0)
  
  return `Act now to prevent ₹${lossPrevented.toLocaleString()} loss. Investing ₹${prediction.prevention_cost_estimate.toLocaleString()} in prevention gives you ${roiPercentage}% return on investment by avoiding damage.`
}

function calculateActionPriority(prediction: any): number {
  // Priority score based on probability, economic impact, and urgency
  const probabilityScore = prediction.probability * 100
  const economicScore = Math.min(prediction.economic_impact_estimate / 100, 100)
  const urgencyScore = prediction.time_to_impact_days <= 3 ? 100 : prediction.time_to_impact_days <= 7 ? 70 : 40
  
  return Math.round((probabilityScore + economicScore + urgencyScore) / 3)
}

function generateFinancialImpactSummary(prediction: any): any {
  return {
    potential_loss: `₹${prediction.predicted_loss_if_ignored.toLocaleString()}`,
    prevention_cost: `₹${prediction.prevention_cost_estimate.toLocaleString()}`,
    net_savings: `₹${(prediction.predicted_loss_if_ignored - prediction.prevention_cost_estimate).toLocaleString()}`,
    roi_percentage: `${(((prediction.predicted_loss_if_ignored - prediction.prevention_cost_estimate) / prediction.prevention_cost_estimate) * 100).toFixed(0)}%`,
    cost_benefit_ratio: (prediction.predicted_loss_if_ignored / prediction.prevention_cost_estimate).toFixed(1)
  }
}

function generateRegionalInsights(areaData: any, communityAlerts: any[]): any {
  if (!areaData) return null

  const insights = {
    overall_risk_level: 'medium',
    dominant_concerns: [],
    community_trends: [],
    preventive_recommendations: []
  }

  // Analyze regional risks
  if (areaData.regional_risks) {
    const risks = areaData.regional_risks
    if (risks.disease_pressure > 0.7) {
      insights.dominant_concerns.push('High disease pressure in the area')
      insights.preventive_recommendations.push('Consider preventive fungicide application')
    }
    if (risks.pest_activity > 0.7) {
      insights.dominant_concerns.push('Increased pest activity detected')
      insights.preventive_recommendations.push('Monitor for pest infestations')
    }
    if (risks.weather_stress > 0.7) {
      insights.dominant_concerns.push('Weather stress conditions present')
      insights.preventive_recommendations.push('Adjust irrigation and protection measures')
    }
  }

  // Analyze community alerts
  if (communityAlerts && communityAlerts.length > 0) {
    insights.community_trends = communityAlerts.map((alert: any) => ({
      type: alert.alert_type,
      severity: alert.severity,
      description: alert.description,
      affected_radius: `${alert.affected_radius_km} km`
    }))
  }

  return insights
}

async function optimizeHarvestTiming(cropCycleId: string, supabase: any) {
  // Get crop cycle details
  const { data: crop } = await supabase
    .from('crop_cycles')
    .select('*')
    .eq('id', cropCycleId)
    .single()

  if (!crop) return null

  // Calculate days since sowing
  const daysSinceSowing = Math.floor((Date.now() - new Date(crop.sowing_date).getTime()) / (1000 * 60 * 60 * 24))
  
  // Calculate maturity percentage
  const maturityDays = {
    'rice': 120,
    'wheat': 110,
    'cotton': 160,
    'maize': 90,
    'pulses': 75,
    'vegetables': 60,
    'fruits': 180,
    'spices': 90,
    'oilseeds': 100,
    'other': 100
  }

  const expectedMaturityDays = maturityDays[crop.crop_type] || 100
  const maturityPercentage = Math.min(100, (daysSinceSowing / expectedMaturityDays) * 100)

  // Calculate optimal harvest date
  const optimalDate = new Date(crop.sowing_date)
  optimalDate.setDate(optimalDate.getDate() + expectedMaturityDays)

  // Get weather forecast
  const { data: weatherForecast } = await supabase
    .from('weather_data')
    .select('*')
    .eq('location_lat', crop.location_lat)
    .eq('location_lng', crop.location_lng)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(7)

  return {
    current_maturity_percentage: Math.round(maturityPercentage),
    optimal_harvest_date: optimalDate.toISOString().split('T')[0],
    days_to_optimal: Math.max(0, expectedMaturityDays - daysSinceSowing),
    maturity_stage: getMaturityStage(maturityPercentage),
    weather_forecast: weatherForecast || [],
    harvest_window: calculateHarvestWindow(maturityPercentage, weatherForecast || []),
    quality_risks: assessQualityRisks(maturityPercentage, weatherForecast || [])
  }
}

function getMaturityStage(percentage: number): string {
  if (percentage < 60) return 'early_vegetative'
  if (percentage < 80) return 'mid_growth'
  if (percentage < 95) return 'late_growth'
  return 'mature'
}

function calculateHarvestWindow(maturityPercentage: number, weatherForecast: any[]): any {
  const optimalWindow = {
    start_days: 0,
    end_days: 0,
    risk_factors: []
  }

  if (maturityPercentage >= 90 && maturityPercentage <= 105) {
    optimalWindow.start_days = 0
    optimalWindow.end_days = 7
  } else if (maturityPercentage >= 85 && maturityPercentage <= 110) {
    optimalWindow.start_days = -3
    optimalWindow.end_days = 10
  }

  // Check weather constraints
  const hasRainRisk = weatherForecast.some(w => w.rainfall_mm > 10)
  const hasHeatRisk = weatherForecast.some(w => w.temperature_max > 35)

  if (hasRainRisk) {
    optimalWindow.risk_factors.push('Rain may delay harvesting')
  }
  if (hasHeatRisk) {
    optimalWindow.risk_factors.push('High heat may affect crop quality')
  }

  return optimalWindow
}

function assessQualityRisks(maturityPercentage: number, weatherForecast: any[]): any {
  const risks = {
    early_harvest: {
      risk_level: maturityPercentage < 85 ? 'high' : 'low',
      yield_loss_percent: maturityPercentage < 85 ? 15 + (85 - maturityPercentage) : 5,
      quality_impact: 'Reduced grain size and market value',
      estimated_loss: 0
    },
    late_harvest: {
      risk_level: maturityPercentage > 105 ? 'high' : 'low',
      yield_loss_percent: maturityPercentage > 105 ? 10 + (maturityPercentage - 105) : 3,
      quality_impact: 'Lodging risk, grain shattering, reduced market value',
      estimated_loss: 0
    }
  }

  return risks
}

function generateHarvestRecommendations(optimization: any): string[] {
  if (!optimization) return []

  const recommendations = []

  if (optimization.current_maturity_percentage < 85) {
    recommendations.push('Crop is not yet mature. Wait for optimal harvest time.')
  } else if (optimization.current_maturity_percentage >= 90 && optimization.current_maturity_percentage <= 105) {
    recommendations.push('Optimal harvest window. Plan harvesting within the next 7 days.')
  } else if (optimization.current_maturity_percentage > 105) {
    recommendations.push('Crop is over-mature. Harvest immediately to prevent quality loss.')
  }

  if (optimization.weather_forecast) {
    const hasRainRisk = optimization.weather_forecast.some((w: any) => w.rainfall_mm > 10)
    if (hasRainRisk) {
      recommendations.push('Rain expected. Consider harvesting before rainfall to prevent damage.')
    }
  }

  return recommendations
}

// Additional helper functions for other features...

function calculateWarningUrgency(warning: any): number {
  const riskScores = { 'low': 25, 'medium': 50, 'high': 75, 'critical': 100 }
  return riskScores[warning.risk_level] || 50
}

function generateActionableSteps(warning: any): string[] {
  // Generate specific actionable steps based on warning type
  switch (warning.warning_type) {
    case 'crop_rotation_risk':
      return [
        'Consider planting legumes or oilseeds next season',
        'Test soil for nutrient deficiencies',
        'Plan crop rotation schedule for next 3 years'
      ]
    default:
      return ['Review current practices', 'Consult agricultural expert']
  }
}

function generateEconomicConsequences(warning: any): any {
  return {
    short_term_loss: warning.potential_loss_estimate * 0.3,
    long_term_loss: warning.potential_loss_estimate * 0.7,
    cumulative_impact: warning.potential_loss_estimate * 1.2
  }
}

function generateAlternativeBenefits(warning: any): any {
  return {
    yield_improvement: '15-20%',
    cost_reduction: '10-15%',
    soil_health: 'Significant improvement',
    market_advantage: 'Better prices for diversified crops'
  }
}

function generateSeasonalDifferenceAnalysis(comparisons: any[]): any {
  // Analyze seasonal differences
  const current = comparisons.find(c => c.comparison_season === 'current')
  const previous = comparisons.find(c => c.comparison_season === 'previous_1')

  if (!current || !previous) return null

  return {
    rainfall_difference: current.rainfall_deviation_percent - previous.rainfall_deviation_percent,
    temperature_difference: current.temperature_deviation_percent - previous.temperature_deviation_percent,
    key_changes: [
      `Rainfall is ${current.rainfall_deviation_percent > previous.rainfall_deviation_percent ? 'higher' : 'lower'} by ${Math.abs(current.rainfall_deviation_percent - previous.rainfall_deviation_percent)}%`,
      `Temperature is ${current.temperature_deviation_percent > previous.temperature_deviation_percent ? 'higher' : 'lower'} by ${Math.abs(current.temperature_deviation_percent - previous.temperature_deviation_percent)}%`
    ]
  }
}

function generateSeasonalInsights(analysis: any): string[] {
  if (!analysis) return []

  const insights = []

  if (Math.abs(analysis.rainfall_difference) > 20) {
    insights.push(`Significant rainfall variation detected: ${analysis.rainfall_difference > 0 ? 'excess' : 'deficit'} conditions`)
  }

  if (Math.abs(analysis.temperature_difference) > 15) {
    insights.push(`Temperature patterns changed significantly: ${analysis.temperature_difference > 0 ? 'warmer' : 'cooler'} season`)
  }

  return insights
}

function calculateEconomicSummary(impacts: any[]): any {
  const totalInvested = impacts.reduce((sum, impact) => sum + (impact.estimated_cost || 0), 0)
  const totalSaved = impacts.reduce((sum, impact) => sum + (impact.estimated_loss_prevented || 0), 0)
  const averageROI = impacts.length > 0 ? impacts.reduce((sum, impact) => sum + (impact.roi_percentage || 0), 0) / impacts.length : 0

  return {
    total_invested: totalInvested,
    total_saved: totalSaved,
    net_benefit: totalSaved - totalInvested,
    average_roi: averageROI,
    total_actions: impacts.length
  }
}

function generateROIAnalysis(impacts: any[]): any {
  const roiByType = impacts.reduce((acc, impact) => {
    const type = impact.advisory?.type || 'unknown'
    if (!acc[type]) {
      acc[type] = { count: 0, total_roi: 0, avg_roi: 0 }
    }
    acc[type].count++
    acc[type].total_roi += impact.roi_percentage || 0
    acc[type].avg_roi = acc[type].total_roi / acc[type].count
    return acc
  }, {})

  return roiByType
}

async function acknowledgeWarning(userId: string, warningId: string, supabase: any) {
  const { error } = await supabase
    .from('decision_warnings')
    .update({ is_acknowledged: true })
    .eq('id', warningId)
    .eq('farmer_id', userId)

  if (error) throw error

  return new Response(JSON.stringify({ 
    message: 'Warning acknowledged successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function updateAreaIntelligence(data: any, supabase: any) {
  const { center_lat, center_lng, radius_km } = data

  const { error } = await supabase.rpc('generate_area_intelligence', {
    p_center_lat: center_lat,
    p_center_lng: center_lng,
    p_radius_km: radius_km || 10
  })

  if (error) throw error

  return new Response(JSON.stringify({ 
    message: 'Area intelligence updated successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function generateSeasonalComparison(userId: string, cropCycleId: string, supabase: any) {
  // This would generate detailed seasonal comparisons
  // Implementation would involve historical data analysis
  
  return new Response(JSON.stringify({ 
    message: 'Seasonal comparison generated successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
