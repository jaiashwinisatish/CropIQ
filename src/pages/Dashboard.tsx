import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, MapPin, Wheat, Calendar, ChevronRight, Menu, X, Sun } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StatCard from '@/components/dashboard/StatCard';
import WeatherCard from '@/components/dashboard/WeatherCard';
import CropHealthCard from '@/components/dashboard/CropHealthCard';
import { RecommendationList } from '@/components/dashboard/RecommendationCard';
import YieldChart from '@/components/dashboard/YieldChart';
import AlertCard from '@/components/dashboard/AlertCard';
import { Button } from '@/components/ui/button';
import {
  getWeatherForecast,
  getCropHealth,
  getAlerts,
  getRecommendations,
  getYieldPrediction,
  getFarmerProfile,
} from '@/services/mockData';

const Dashboard = () => {
  const [alerts, setAlerts] = useState(getAlerts());
  const weatherData = getWeatherForecast();
  const cropHealth = getCropHealth();
  const recommendations = getRecommendations();
  const yieldData = getYieldPrediction();
  const farmer = getFarmerProfile();

  const handleDismissAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-card rounded-2xl p-6 border border-border">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  नमस्ते, {farmer.name}! 🙏
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    {farmer.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wheat className="w-4 h-4 text-primary" />
                    {farmer.crops.join(', ')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-primary" />
                    {farmer.farmSize} acres
                  </span>
                </div>
              </div>
              <Button variant="outline" className="shrink-0">
                <Bell className="w-4 h-4 mr-2" />
                {alerts.length} Alerts
              </Button>
            </div>
          </motion.div>

          {/* Alerts Banner */}
          {alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="bg-danger/5 border-2 border-danger/20 rounded-xl p-4">
                <h3 className="font-semibold text-danger mb-3 flex items-center gap-2">
                  ⚠️ High Priority Alerts
                </h3>
                <div className="space-y-3">
                  {alerts
                    .filter(a => a.severity === 'high' || a.severity === 'critical')
                    .slice(0, 2)
                    .map(alert => (
                      <AlertCard key={alert.id} alert={alert} onDismiss={handleDismissAlert} />
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Crop Health"
              value={`${cropHealth.score}%`}
              subtitle={cropHealth.status}
              icon={Wheat}
              color="success"
              trend={{ value: 5, isPositive: true }}
            />
            <StatCard
              title="Today's Temp"
              value={`${weatherData[0].temp}°C`}
              subtitle={weatherData[0].condition}
              icon={Sun}
              color="warning"
            />
            <StatCard
              title="Active Alerts"
              value={alerts.length}
              subtitle="Requires attention"
              icon={Bell}
              color={alerts.length > 2 ? 'danger' : 'primary'}
            />
            <StatCard
              title="Days to Harvest"
              value="52"
              subtitle="Estimated"
              icon={Calendar}
              color="accent"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <CropHealthCard data={cropHealth} cropName="Wheat" />
              <YieldChart data={yieldData} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <WeatherCard data={weatherData} />
              <RecommendationList recommendations={recommendations} />
            </div>
          </div>

          {/* All Alerts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                All Alerts
              </h2>
              <Button variant="ghost" size="sm">
                View History <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {alerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} onDismiss={handleDismissAlert} />
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
