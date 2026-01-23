import { motion } from 'framer-motion';
import { Droplets, Leaf, Bug, Clock, BarChart3, Sprout } from 'lucide-react';

const outputs = [
  {
    icon: Droplets,
    title: 'Irrigation Planning',
    description: 'Know exactly when and how much to water based on soil moisture and weather.',
    sample: 'Skip irrigation on Jan 24 – rain expected (15mm)',
    color: 'from-info to-accent',
  },
  {
    icon: Leaf,
    title: 'Fertilizer Recommendations',
    description: 'Right fertilizer, right quantity, right time for maximum efficiency.',
    sample: 'Apply 25kg Urea per acre on Jan 27 morning',
    color: 'from-primary to-success',
  },
  {
    icon: Bug,
    title: 'Pest & Disease Alerts',
    description: 'Early warning and treatment guidance before damage occurs.',
    sample: '⚠️ High aphid risk – apply neem spray within 48hrs',
    color: 'from-danger to-warning',
  },
  {
    icon: Clock,
    title: 'Harvest Timing',
    description: 'Optimal harvest window for maximum yield and quality.',
    sample: 'Best harvest: Feb 15-20 (grain moisture: 14%)',
    color: 'from-secondary to-primary',
  },
  {
    icon: BarChart3,
    title: 'Yield Prediction',
    description: 'AI-based forecasts to plan storage and sales.',
    sample: 'Expected yield: 42 quintals/acre (↑ 15% vs last year)',
    color: 'from-success to-primary',
  },
  {
    icon: Sprout,
    title: 'Crop Alternatives',
    description: 'Suggestions for more profitable crops based on climate and market.',
    sample: 'Consider mustard next season – 22% higher profit margin',
    color: 'from-warning to-secondary',
  },
];

const OutputsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wide">What You Get</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Simple, Actionable Insights
          </h2>
          <p className="text-muted-foreground text-lg">
            No complex reports. Just clear recommendations in language every farmer understands.
          </p>
        </motion.div>

        {/* Outputs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outputs.map((output, index) => (
            <motion.div
              key={output.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="card-elevated p-6 h-full hover:shadow-lg transition-all">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${output.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  <output.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{output.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{output.description}</p>
                
                {/* Sample Output */}
                <div className="bg-muted rounded-lg px-4 py-3 border-l-4 border-primary">
                  <p className="text-sm font-medium text-foreground">{output.sample}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutputsSection;
