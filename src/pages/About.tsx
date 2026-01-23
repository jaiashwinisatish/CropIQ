import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  Users, 
  Shield, 
  TrendingUp, 
  Cloud, 
  Smartphone, 
  Award,
  Target,
  Zap,
  Globe,
  Leaf,
  Droplets,
  Sun
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const About = () => {
  const [activeTab, setActiveTab] = useState("mission");

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-green-600" />,
      title: "AI-Powered Intelligence",
      description: "Advanced machine learning algorithms analyze weather patterns, crop data, and regional trends to provide predictive insights.",
      color: "bg-green-100 text-green-800"
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Pre-Damage Alerts",
      description: "Early warning system that predicts disease outbreaks, pest infestations, and stress conditions before visible damage occurs.",
      color: "bg-blue-100 text-blue-800"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Community Intelligence",
      description: "Area-level risk mapping using anonymized data from nearby farms for collective protection and knowledge sharing.",
      color: "bg-purple-100 text-purple-800"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      title: "Economic Impact Analysis",
      description: "Every recommendation includes detailed financial analysis showing ROI, loss prevention, and cost of inaction.",
      color: "bg-orange-100 text-orange-800"
    },
    {
      icon: <Cloud className="h-8 w-8 text-cyan-600" />,
      title: "Real-Time Weather",
      description: "Hyperlocal weather data with 6-hour caching and forecasting for precise agricultural planning.",
      color: "bg-cyan-100 text-cyan-800"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-pink-600" />,
      title: "Mobile First Design",
      description: "Optimized for mobile devices with offline capabilities and push notifications for critical alerts.",
      color: "bg-pink-100 text-pink-800"
    }
  ];

  const stats = [
    { label: "Farmers Helped", value: "10,000+", icon: <Users className="h-5 w-5" /> },
    { label: "Crops Monitored", value: "50+", icon: <Leaf className="h-5 w-5" /> },
    { label: "Risk Accuracy", value: "95%", icon: <Target className="h-5 w-5" /> },
    { label: "Savings Generated", value: "₹50Cr+", icon: <TrendingUp className="h-5 w-5" /> }
  ];

  const team = [
    {
      name: "Agricultural Experts",
      role: "Crop Science Specialists",
      description: "PhD-level agronomists with decades of field experience in Indian agriculture."
    },
    {
      name: "Data Scientists",
      role: "ML & AI Engineers",
      description: "Experts in agricultural data modeling, predictive analytics, and machine learning."
    },
    {
      name: "Software Engineers",
      role: "Full-Stack Developers",
      description: "Specialized in building scalable agricultural technology platforms."
    },
    {
      name: "Weather Scientists",
      role: "Meteorology Experts",
      description: "Specialists in agricultural meteorology and climate impact analysis."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              About CropIQ
            </Badge>
            <h1 className="text-5xl font-bold mb-6">
              Revolutionizing Smart Farming with AI
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Empowering farmers with predictive intelligence, early-warning systems, and data-driven insights 
              to transform agriculture from reactive to proactive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Smartphone className="mr-2 h-4 w-4" />
                Download App
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-20 text-white" viewBox="0 0 1440 120" fill="none">
            <path d="M0,120 L1440,120 L1440,0 L0,0 Z" fill="currentColor" opacity="0.1"/>
            <path d="M0,120 L1440,120 L1440,40 L0,40 Z" fill="currentColor" opacity="0.05"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4 text-green-600">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Mission: Democratizing Agricultural Intelligence
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              We believe every farmer deserves access to the same advanced intelligence and predictive capabilities 
              that were once available only to large agricultural corporations. CropIQ bridges this gap by 
              providing sophisticated AI-driven insights in a simple, actionable format.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Precision Agriculture</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base">
                  Hyperlocal recommendations based on your specific location, crop type, and current conditions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Predictive Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base">
                  Early warning systems that predict problems before they occur, enabling proactive action.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Economic Empowerment</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base">
                  Clear financial impact analysis showing ROI and cost of inaction for every recommendation.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Features for Modern Farming
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge technology designed specifically for Indian agricultural conditions and challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gray-50">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leveraging cutting-edge technology stack for reliability, scalability, and performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="font-semibold mb-2">React & TypeScript</h3>
                <p className="text-sm text-gray-600">Modern frontend with type safety</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">🗄️</div>
                <h3 className="font-semibold mb-2">Supabase</h3>
                <p className="text-sm text-gray-600">PostgreSQL database with real-time sync</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">☁️</div>
                <h3 className="font-semibold mb-2">Edge Functions</h3>
                <p className="text-sm text-gray-600">Serverless backend with auto-scaling</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="font-semibold mb-2">Mobile First</h3>
                <p className="text-sm text-gray-600">Optimized for smartphones and tablets</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Behind CropIQ
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A multidisciplinary team passionate about transforming Indian agriculture through technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-green-600 font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 text-center">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">
            Join thousands of farmers who are already using CropIQ to increase their yields, 
            reduce losses, and make data-driven decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-700 hover:bg-green-50">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
