import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wheat, Droplets, Clock, TrendingUp, IndianRupee, Check, Star, ArrowUpDown } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { getCropOptions } from '@/services/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CropPlanning = () => {
  const crops = getCropOptions();
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['1', '2']);
  const [sortBy, setSortBy] = useState<'profit' | 'suitability' | 'risk'>('suitability');

  const toggleCrop = (id: string) => {
    if (selectedCrops.includes(id)) {
      setSelectedCrops(selectedCrops.filter(c => c !== id));
    } else if (selectedCrops.length < 3) {
      setSelectedCrops([...selectedCrops, id]);
    }
  };

  const sortedCrops = [...crops].sort((a, b) => {
    if (sortBy === 'profit') return b.profit - a.profit;
    if (sortBy === 'suitability') return b.suitability - a.suitability;
    if (sortBy === 'risk') {
      const riskOrder = { low: 1, medium: 2, high: 3 };
      return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
    }
    return 0;
  });

  const comparisonData = crops
    .filter(c => selectedCrops.includes(c.id))
    .map(c => ({
      name: c.name,
      profit: c.profit / 1000,
      cost: c.cost / 1000,
      yield: c.yield,
    }));

  const waterLabels = { low: '💧', medium: '💧💧', high: '💧💧💧' };
  const riskColors = { low: 'text-success', medium: 'text-warning', high: 'text-danger' };
  const chartColors = ['hsl(142, 71%, 45%)', 'hsl(199, 89%, 48%)', 'hsl(30, 60%, 35%)'];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Crop Planning & Profitability
            </h1>
            <p className="text-muted-foreground text-lg">
              Compare crops based on yield, cost, profit, and climate suitability for your region
            </p>
          </motion.div>

          {/* Sort Options */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <span className="text-sm text-muted-foreground shrink-0">Sort by:</span>
            {[
              { key: 'suitability', label: 'Best Match', icon: Star },
              { key: 'profit', label: 'Highest Profit', icon: TrendingUp },
              { key: 'risk', label: 'Lowest Risk', icon: ArrowUpDown },
            ].map(option => (
              <Button
                key={option.key}
                variant={sortBy === option.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy(option.key as typeof sortBy)}
                className="shrink-0"
              >
                <option.icon className="w-4 h-4 mr-1" />
                {option.label}
              </Button>
            ))}
          </div>

          {/* Crop Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {sortedCrops.map((crop, index) => {
              const isSelected = selectedCrops.includes(crop.id);
              
              return (
                <motion.div
                  key={crop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => toggleCrop(crop.id)}
                  className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all hover:shadow-lg ${
                    isSelected ? 'border-primary bg-primary-soft/30' : 'border-border bg-card hover:border-primary/30'
                  }`}
                >
                  {/* Selection Badge */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}

                  {/* Suitability Score */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{crop.name}</h3>
                      <p className="text-sm text-muted-foreground">{crop.nameHi}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{crop.suitability}%</div>
                      <p className="text-xs text-muted-foreground">Match</p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <IndianRupee className="w-3 h-3" />
                        <span className="text-xs">Profit/acre</span>
                      </div>
                      <p className="font-bold text-success">₹{(crop.profit / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Wheat className="w-3 h-3" />
                        <span className="text-xs">Yield</span>
                      </div>
                      <p className="font-bold text-foreground">{crop.yield} q/acre</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Droplets className="w-3 h-3" />
                        <span className="text-xs">Water Need</span>
                      </div>
                      <p className="font-bold text-foreground">{waterLabels[crop.waterNeed]}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">Duration</span>
                      </div>
                      <p className="font-bold text-foreground">{crop.duration} days</p>
                    </div>
                  </div>

                  {/* Risk Badge */}
                  <div className={`text-sm font-medium ${riskColors[crop.riskLevel]}`}>
                    Risk Level: {crop.riskLevel.charAt(0).toUpperCase() + crop.riskLevel.slice(1)}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Comparison Chart */}
          {selectedCrops.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                📊 Profit Comparison
              </h2>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      label={{ value: '₹ (thousands)', angle: -90, position: 'insideLeft', fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`₹${value}K`, '']}
                    />
                    <Bar dataKey="cost" name="Cost" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="profit" name="Profit" radius={[4, 4, 0, 0]}>
                      {comparisonData.map((_, index) => (
                        <Cell key={index} fill={chartColors[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Click on crop cards above to add/remove from comparison (max 3)
              </p>
            </motion.div>
          )}

          {/* Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-2xl p-6 border border-primary/20"
          >
            <h3 className="font-bold text-lg text-foreground mb-2 flex items-center gap-2">
              🌟 AI Recommendation
            </h3>
            <p className="text-muted-foreground mb-4">
              Based on your location (Hisar, Haryana), soil type, and current market trends, 
              <strong className="text-foreground"> Wheat</strong> offers the best balance of profit and low risk for the Rabi season. 
              Consider <strong className="text-foreground">Mustard</strong> as an intercrop for additional income.
            </p>
            <Button variant="hero">
              <Wheat className="w-4 h-4 mr-2" />
              Start Wheat Advisory
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CropPlanning;
