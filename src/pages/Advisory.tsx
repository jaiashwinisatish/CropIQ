import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, ChevronRight, Leaf, Droplets, Bug, Sun, Sprout } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { getCropStages, getRecommendations } from '@/services/mockData';

const stageIcons: Record<string, typeof Leaf> = {
  'Soil Preparation': Sprout,
  'Sowing': Leaf,
  'Germination': Sprout,
  'Tillering': Leaf,
  'Heading': Sun,
  'Grain Filling': Droplets,
  'Maturity & Harvest': CheckCircle,
};

const Advisory = () => {
  const stages = getCropStages();
  const recommendations = getRecommendations();
  const currentStage = stages.find(s => s.status === 'current');

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
              Crop Advisory
            </h1>
            <p className="text-muted-foreground text-lg">
              Step-by-step guidance for your Wheat crop lifecycle
            </p>
          </motion.div>

          {/* Current Stage Highlight */}
          {currentStage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-2xl p-6 border border-primary/20 mb-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shrink-0">
                  <Clock className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-primary font-semibold mb-1">Current Stage</p>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{currentStage.name}</h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    Day {currentStage.startDay} - {currentStage.endDay} of the crop cycle
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-background/50 rounded-xl p-4 border border-border">
                      <h4 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Tasks for This Stage
                      </h4>
                      <ul className="space-y-2">
                        {currentStage.tasks.map((task, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary">•</span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-background/50 rounded-xl p-4 border border-border">
                      <h4 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-success" />
                        Expert Tips
                      </h4>
                      <ul className="space-y-2">
                        {currentStage.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-success">💡</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-primary" />
              Complete Crop Lifecycle
            </h2>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

              <div className="space-y-4">
                {stages.map((stage, index) => {
                  const Icon = stageIcons[stage.name] || Leaf;
                  const isCompleted = stage.status === 'completed';
                  const isCurrent = stage.status === 'current';

                  return (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative flex gap-4 ${isCurrent ? '' : ''}`}
                    >
                      {/* Icon */}
                      <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isCompleted ? 'bg-success text-success-foreground' :
                        isCurrent ? 'bg-primary text-primary-foreground shadow-glow' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                      </div>

                      {/* Content */}
                      <div className={`flex-1 rounded-xl border p-4 ${
                        isCurrent ? 'bg-primary-soft/30 border-primary/30' :
                        isCompleted ? 'bg-muted/30 border-border' :
                        'bg-card border-border'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-semibold ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                            {stage.name}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isCompleted ? 'bg-success/10 text-success' :
                            isCurrent ? 'bg-primary/10 text-primary' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {isCompleted ? '✓ Completed' : isCurrent ? '🔄 In Progress' : `Day ${stage.startDay}-${stage.endDay}`}
                          </span>
                        </div>

                        {!isCompleted && (
                          <div className="space-y-2">
                            {stage.tasks.slice(0, 2).map((task, i) => (
                              <p key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                <Circle className="w-3 h-3" />
                                {task}
                              </p>
                            ))}
                            {stage.tasks.length > 2 && (
                              <p className="text-xs text-primary cursor-pointer hover:underline">
                                +{stage.tasks.length - 2} more tasks
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Today's Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              🎯 Today's Priority Actions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {recommendations.slice(0, 4).map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-all cursor-pointer group"
                >
                  <span className="text-2xl">{rec.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-sm mb-1">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                    <span className="text-xs text-primary font-medium">⏱️ {rec.timing}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Advisory;
