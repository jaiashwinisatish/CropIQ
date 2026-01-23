import { motion } from 'framer-motion';
import { Satellite, CloudSun, LineChart, Shield, MapPin, Calendar, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Satellite,
    title: 'Satellite Imagery',
    description: 'Monitor crop health and growth patterns using advanced satellite data analysis.',
  },
  {
    icon: CloudSun,
    title: 'Weather Intelligence',
    description: 'Hyperlocal weather forecasts and alerts tailored to your farm location.',
  },
  {
    icon: LineChart,
    title: 'Market Trends',
    description: 'Real-time market prices and demand predictions for better selling decisions.',
  },
  {
    icon: Shield,
    title: 'Risk Alerts',
    description: 'Early warning for pest attacks, diseases, and extreme weather events.',
  },
  {
    icon: MapPin,
    title: 'Location-Based',
    description: 'Recommendations specific to your soil, climate, and regional conditions.',
  },
  {
    icon: Calendar,
    title: 'Lifecycle Guidance',
    description: 'Step-by-step tasks for every stage from sowing to harvest.',
  },
];

const SolutionSection = () => {
  return (
    <section className="py-16 md:py-24 bg-card relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-field-pattern opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">The Solution</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-6">
              Your Digital{' '}
              <span className="text-gradient-primary">Farming Assistant</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              CropIQ combines satellite imagery, weather patterns, historical crop data, and market intelligence 
              into simple, actionable recommendations. Just enter your location, crop, and sowing date – 
              we handle the complex analysis.
            </p>

            {/* How it Works Steps */}
            <div className="space-y-4">
              {[
                { step: '1', text: 'Enter your farm location and crop details' },
                { step: '2', text: 'AI analyzes satellite, weather & market data' },
                { step: '3', text: 'Get personalized actions in simple language' },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0">
                    {item.step}
                  </div>
                  <p className="text-foreground font-medium">{item.text}</p>
                  {index < 2 && <ArrowRight className="w-4 h-4 text-muted-foreground hidden md:block" />}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-background rounded-xl p-4 border border-border hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
