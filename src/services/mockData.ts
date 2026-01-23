// Mock data service for CropIQ - structured for easy backend integration

export interface WeatherData {
  date: string;
  temp: number;
  humidity: number;
  rainfall: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  icon: string;
}

export interface CropHealthData {
  score: number;
  status: 'excellent' | 'good' | 'moderate' | 'poor';
  issues: string[];
  lastUpdated: string;
}

export interface Alert {
  id: string;
  type: 'pest' | 'disease' | 'weather' | 'market' | 'irrigation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  action: string;
  timestamp: string;
}

export interface Recommendation {
  id: string;
  category: 'irrigation' | 'fertilizer' | 'pesticide' | 'harvest' | 'general';
  title: string;
  description: string;
  timing: string;
  priority: 'low' | 'medium' | 'high';
  icon: string;
}

export interface YieldPrediction {
  month: string;
  predicted: number;
  optimal: number;
  previous: number;
}

export interface CropOption {
  id: string;
  name: string;
  nameHi: string;
  yield: number;
  cost: number;
  profit: number;
  waterNeed: 'low' | 'medium' | 'high';
  duration: number;
  riskLevel: 'low' | 'medium' | 'high';
  suitability: number;
  image: string;
}

export interface FarmerProfile {
  id: string;
  name: string;
  location: string;
  farmSize: number;
  crops: string[];
  joinedDate: string;
}

export interface CropStage {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  status: 'completed' | 'current' | 'upcoming';
  tasks: string[];
  tips: string[];
}

// Weather forecast data
export const getWeatherForecast = (): WeatherData[] => [
  { date: '2025-01-23', temp: 28, humidity: 65, rainfall: 0, condition: 'sunny', icon: '☀️' },
  { date: '2025-01-24', temp: 26, humidity: 70, rainfall: 5, condition: 'cloudy', icon: '⛅' },
  { date: '2025-01-25', temp: 24, humidity: 80, rainfall: 15, condition: 'rainy', icon: '🌧️' },
  { date: '2025-01-26', temp: 25, humidity: 75, rainfall: 8, condition: 'cloudy', icon: '⛅' },
  { date: '2025-01-27', temp: 29, humidity: 60, rainfall: 0, condition: 'sunny', icon: '☀️' },
  { date: '2025-01-28', temp: 30, humidity: 55, rainfall: 0, condition: 'sunny', icon: '☀️' },
  { date: '2025-01-29', temp: 27, humidity: 68, rainfall: 3, condition: 'cloudy', icon: '⛅' },
];

// Crop health data
export const getCropHealth = (): CropHealthData => ({
  score: 82,
  status: 'good',
  issues: ['Minor nitrogen deficiency detected', 'Slight water stress in sector B'],
  lastUpdated: '2025-01-23T10:30:00',
});

// Active alerts
export const getAlerts = (): Alert[] => [
  {
    id: '1',
    type: 'pest',
    severity: 'high',
    title: 'Aphid Infestation Risk',
    description: 'Weather conditions favor aphid growth. Monitor your wheat crop closely.',
    action: 'Apply neem oil spray within 48 hours',
    timestamp: '2025-01-23T08:00:00',
  },
  {
    id: '2',
    type: 'weather',
    severity: 'medium',
    title: 'Heavy Rain Expected',
    description: 'Rainfall of 15-20mm expected on Jan 25. Delay irrigation.',
    action: 'Skip next irrigation cycle',
    timestamp: '2025-01-23T06:00:00',
  },
  {
    id: '3',
    type: 'market',
    severity: 'low',
    title: 'Wheat Prices Rising',
    description: 'Wheat prices increased 8% in local mandi. Consider holding stock.',
    action: 'Review harvest timing',
    timestamp: '2025-01-22T18:00:00',
  },
  {
    id: '4',
    type: 'irrigation',
    severity: 'medium',
    title: 'Irrigation Scheduled',
    description: 'Next irrigation due in 2 days based on soil moisture levels.',
    action: 'Prepare irrigation system',
    timestamp: '2025-01-23T07:00:00',
  },
];

// AI Recommendations
export const getRecommendations = (): Recommendation[] => [
  {
    id: '1',
    category: 'irrigation',
    title: 'Reduce Watering',
    description: 'Soil moisture is adequate. Rain expected in 2 days. Skip irrigation on Jan 24.',
    timing: 'Next 48 hours',
    priority: 'high',
    icon: '💧',
  },
  {
    id: '2',
    category: 'fertilizer',
    title: 'Apply Urea',
    description: 'Nitrogen levels dropping. Apply 25kg urea per acre after rain stops.',
    timing: 'Jan 26-27',
    priority: 'medium',
    icon: '🌱',
  },
  {
    id: '3',
    category: 'pesticide',
    title: 'Preventive Spray',
    description: 'Apply neem-based spray to prevent aphid attack. Early morning application recommended.',
    timing: 'Tomorrow morning',
    priority: 'high',
    icon: '🛡️',
  },
  {
    id: '4',
    category: 'harvest',
    title: 'Optimal Harvest Window',
    description: 'Based on crop maturity and weather, optimal harvest date is Feb 15-20.',
    timing: '3 weeks away',
    priority: 'low',
    icon: '🌾',
  },
];

// Yield prediction data
export const getYieldPrediction = (): YieldPrediction[] => [
  { month: 'Nov', predicted: 0, optimal: 0, previous: 0 },
  { month: 'Dec', predicted: 15, optimal: 18, previous: 12 },
  { month: 'Jan', predicted: 45, optimal: 50, previous: 38 },
  { month: 'Feb', predicted: 78, optimal: 85, previous: 65 },
  { month: 'Mar', predicted: 95, optimal: 100, previous: 82 },
];

// Crop options for planning
export const getCropOptions = (): CropOption[] => [
  {
    id: '1',
    name: 'Wheat',
    nameHi: 'गेहूं',
    yield: 45,
    cost: 25000,
    profit: 55000,
    waterNeed: 'medium',
    duration: 120,
    riskLevel: 'low',
    suitability: 92,
    image: '/placeholder.svg',
  },
  {
    id: '2',
    name: 'Mustard',
    nameHi: 'सरसों',
    yield: 18,
    cost: 18000,
    profit: 42000,
    waterNeed: 'low',
    duration: 110,
    riskLevel: 'low',
    suitability: 88,
    image: '/placeholder.svg',
  },
  {
    id: '3',
    name: 'Chickpea',
    nameHi: 'चना',
    yield: 22,
    cost: 20000,
    profit: 48000,
    waterNeed: 'low',
    duration: 100,
    riskLevel: 'medium',
    suitability: 85,
    image: '/placeholder.svg',
  },
  {
    id: '4',
    name: 'Potato',
    nameHi: 'आलू',
    yield: 280,
    cost: 45000,
    profit: 85000,
    waterNeed: 'high',
    duration: 90,
    riskLevel: 'medium',
    suitability: 78,
    image: '/placeholder.svg',
  },
  {
    id: '5',
    name: 'Onion',
    nameHi: 'प्याज',
    yield: 220,
    cost: 35000,
    profit: 72000,
    waterNeed: 'medium',
    duration: 120,
    riskLevel: 'high',
    suitability: 75,
    image: '/placeholder.svg',
  },
];

// Crop lifecycle stages
export const getCropStages = (): CropStage[] => [
  {
    id: '1',
    name: 'Soil Preparation',
    startDay: -15,
    endDay: 0,
    status: 'completed',
    tasks: ['Plough field 2-3 times', 'Add organic manure', 'Level the field'],
    tips: ['Best done when soil is moist', 'Remove previous crop residue'],
  },
  {
    id: '2',
    name: 'Sowing',
    startDay: 1,
    endDay: 7,
    status: 'completed',
    tasks: ['Use certified seeds', 'Maintain row spacing', 'Apply basal fertilizer'],
    tips: ['Sow in morning hours', 'Check seed germination rate before sowing'],
  },
  {
    id: '3',
    name: 'Germination',
    startDay: 8,
    endDay: 21,
    status: 'completed',
    tasks: ['Light irrigation', 'Monitor germination rate', 'Gap filling if needed'],
    tips: ['Avoid waterlogging', 'Protect from birds'],
  },
  {
    id: '4',
    name: 'Tillering',
    startDay: 22,
    endDay: 45,
    status: 'current',
    tasks: ['First irrigation', 'Apply nitrogen fertilizer', 'Weed control'],
    tips: ['Critical stage for yield', 'Monitor for aphids'],
  },
  {
    id: '5',
    name: 'Heading',
    startDay: 46,
    endDay: 75,
    status: 'upcoming',
    tasks: ['Second irrigation', 'Monitor for pests', 'Apply potash if needed'],
    tips: ['Water stress reduces grain formation', 'Watch for rust disease'],
  },
  {
    id: '6',
    name: 'Grain Filling',
    startDay: 76,
    endDay: 100,
    status: 'upcoming',
    tasks: ['Third irrigation', 'Pest monitoring', 'Prepare for harvest'],
    tips: ['Critical for grain weight', 'Avoid excess nitrogen'],
  },
  {
    id: '7',
    name: 'Maturity & Harvest',
    startDay: 101,
    endDay: 120,
    status: 'upcoming',
    tasks: ['Check grain moisture', 'Arrange harvesting', 'Post-harvest storage'],
    tips: ['Harvest at 14% moisture', 'Avoid delays to prevent losses'],
  },
];

// FPO/Organization aggregate data
export const getFPOStats = () => ({
  totalFarmers: 2847,
  activeFarmers: 2456,
  totalArea: 12500,
  avgYield: 42.5,
  alertsToday: 23,
  cropDistribution: [
    { crop: 'Wheat', area: 5200, farmers: 1120 },
    { crop: 'Mustard', area: 3100, farmers: 680 },
    { crop: 'Chickpea', area: 2400, farmers: 520 },
    { crop: 'Potato', area: 1200, farmers: 280 },
    { crop: 'Others', area: 600, farmers: 247 },
  ],
  regionalRisk: [
    { region: 'North Block', riskLevel: 'low', farmers: 450 },
    { region: 'East Block', riskLevel: 'medium', farmers: 680 },
    { region: 'South Block', riskLevel: 'low', farmers: 720 },
    { region: 'West Block', riskLevel: 'high', farmers: 606 },
  ],
});

// Sample farmer profile
export const getFarmerProfile = (): FarmerProfile => ({
  id: '1',
  name: 'Ramesh Kumar',
  location: 'Hisar, Haryana',
  farmSize: 5.5,
  crops: ['Wheat', 'Mustard'],
  joinedDate: '2024-10-15',
});
