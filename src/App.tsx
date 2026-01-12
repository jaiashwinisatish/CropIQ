import { Sprout, Cloud, Bug, TrendingUp, DollarSign, Languages, Satellite, Brain, MapPin, LineChart, Droplets, Leaf, AlertTriangle, BarChart3, Users, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-2 rounded-lg">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-green-600">CropIQ</span>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Join CropIQ
          </button>
        </nav>
      </header>

      <main className="pt-20">
        <section className="bg-gradient-to-br from-green-50 to-white py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                CropIQ – AI-Powered Smart Farming Intelligence
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Make data-driven farming decisions without hardware
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2">
                  Get Started <ArrowRight className="h-5 w-5" />
                </button>
                <button className="bg-white hover:bg-gray-50 text-green-600 border-2 border-green-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                The Challenges Farmers Face
              </h2>
              <p className="text-lg text-gray-600">
                Traditional farming methods leave farmers vulnerable to uncertainty
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="text-center p-6">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Guesswork</h3>
                <p className="text-gray-600">Farmers depend on guesswork for critical decisions</p>
              </div>
              <div className="text-center p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cloud className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Unpredictable Weather</h3>
                <p className="text-gray-600">Climate variability causes crop losses and stress</p>
              </div>
              <div className="text-center p-6">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bug className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Late Detection</h3>
                <p className="text-gray-600">Pests and diseases identified too late to prevent damage</p>
              </div>
              <div className="text-center p-6">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Income Instability</h3>
                <p className="text-gray-600">High input costs and unpredictable yields hurt profits</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-green-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Introducing CropIQ
                </h2>
                <p className="text-xl text-gray-600">
                  A software-only AI platform that transforms farming with intelligence
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <Satellite className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Satellite Data</h3>
                  <p className="text-gray-600">Real-time crop monitoring using satellite imagery and remote sensing</p>
                </div>
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <Cloud className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Weather Intelligence</h3>
                  <p className="text-gray-600">Hyperlocal weather forecasts and climate analysis</p>
                </div>
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Models</h3>
                  <p className="text-gray-600">Machine learning powered insights trained on agricultural data</p>
                </div>
              </div>
              <div className="mt-12 text-center">
                <div className="inline-block bg-white rounded-lg px-6 py-3 shadow-md">
                  <p className="text-green-600 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    No sensors or devices required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
                How It Works
              </h2>
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Farmer Enters Details</h3>
                        <p className="text-gray-600">Enter your location, crop type, and sowing date through our simple interface</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <LineChart className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analyzes Data</h3>
                        <p className="text-gray-600">Our AI processes satellite imagery, weather patterns, and historical agricultural data for your region</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <Zap className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Personalized Recommendations</h3>
                        <p className="text-gray-600">Receive actionable insights tailored to your specific farm and conditions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
                Powerful Features
              </h2>
              <p className="text-center text-gray-600 mb-16 text-lg">
                Everything you need to farm smarter, not harder
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                  <Droplets className="h-10 w-10 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Weather-Based Irrigation</h3>
                  <p className="text-gray-600">Smart irrigation planning based on rainfall predictions and soil moisture estimates</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                  <Leaf className="h-10 w-10 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Fertilizer Recommendations</h3>
                  <p className="text-gray-600">Optimized fertilizer application schedules to maximize yield and minimize cost</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                  <Bug className="h-10 w-10 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Pest & Disease Alerts</h3>
                  <p className="text-gray-600">Early warnings about potential pest outbreaks and disease risks in your area</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                  <BarChart3 className="h-10 w-10 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Yield Prediction</h3>
                  <p className="text-gray-600">Accurate harvest forecasts to help you plan better and negotiate prices</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                  <DollarSign className="h-10 w-10 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Profitable Crop Suggestions</h3>
                  <p className="text-gray-600">AI-driven crop recommendations based on market demand and your land conditions</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                  <Languages className="h-10 w-10 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Regional Language Support</h3>
                  <p className="text-gray-600">Access CropIQ in your preferred language for seamless understanding</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-green-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                Why CropIQ Is Unique
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-8 w-8 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Zero Hardware Dependency</h3>
                    <p className="text-green-50">No need for expensive sensors or devices. Just your smartphone and CropIQ.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-8 w-8 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Affordable for Small Farmers</h3>
                    <p className="text-green-50">Designed with accessibility in mind. Premium features at prices farmers can afford.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-8 w-8 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Location-Specific AI Insights</h3>
                    <p className="text-green-50">Recommendations tailored to your exact location, soil type, and microclimate.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-8 w-8 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Simple & Multilingual Interface</h3>
                    <p className="text-green-50">Easy to use for all farmers, available in multiple regional languages.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
                Business Model
              </h2>
              <p className="text-center text-gray-600 mb-16 text-lg">
                Sustainable growth through multiple revenue streams
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-green-50 rounded-xl p-8 border-2 border-green-200">
                  <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Basic Version</h3>
                  <p className="text-gray-600">Core features available for free to empower all farmers with essential insights</p>
                </div>
                <div className="bg-green-50 rounded-xl p-8 border-2 border-green-200">
                  <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Subscription</h3>
                  <p className="text-gray-600">Advanced analytics, detailed reports, and priority support for power users</p>
                </div>
                <div className="bg-green-50 rounded-xl p-8 border-2 border-green-200">
                  <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Sprout className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Licensing</h3>
                  <p className="text-gray-600">Custom solutions for FPOs, agricultural enterprises, and cooperatives</p>
                </div>
                <div className="bg-green-50 rounded-xl p-8 border-2 border-green-200">
                  <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Partnerships</h3>
                  <p className="text-gray-600">Collaborations with government programs and NGOs for wider reach</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-green-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
                The CropIQ Impact
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Higher Crop Yield</h3>
                  <p className="text-gray-600">Optimize every farming decision to maximize your harvest and income</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <DollarSign className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Reduced Input Cost</h3>
                  <p className="text-gray-600">Use resources efficiently and cut unnecessary expenses with precision farming</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Leaf className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Sustainable Farming</h3>
                  <p className="text-gray-600">Climate-smart practices that protect the environment for future generations</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-green-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Empowering Farmers Through AI
              </h2>
              <p className="text-xl text-green-50 mb-8">
                Join thousands of farmers making smarter decisions with CropIQ
              </p>
              <button className="bg-white text-green-600 hover:bg-green-50 px-10 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center gap-2">
                Join CropIQ <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-green-600 p-2 rounded-lg">
                    <Sprout className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold">CropIQ</span>
                </div>
                <p className="text-gray-400 text-lg">Smart Farming Made Simple</p>
              </div>
              <div className="flex flex-col md:items-end gap-4">
                <div className="flex flex-wrap gap-6">
                  <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a>
                  <a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a>
                  <a href="#privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>&copy; 2024 CropIQ. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
