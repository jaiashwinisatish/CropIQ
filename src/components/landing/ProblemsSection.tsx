import { motion } from 'framer-motion';
import { CloudRain, Bug, Droplets, TrendingDown, AlertTriangle, HelpCircle } from 'lucide-react';

const problems = [
  {
    icon: CloudRain,
    title: 'Unpredictable Weather',
    description: 'Sudden rains, droughts, and temperature changes damage crops without warning.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/20',
  },
  {
    icon: Bug,
    title: 'Pest & Disease Attacks',
    description: 'Late detection of pests and diseases leads to massive crop losses.',
    color: 'text-danger',
    bgColor: 'bg-danger/10',
    borderColor: 'border-danger/20',
  },
  {
    icon: Droplets,
    title: 'Water Mismanagement',
    description: 'Over-irrigation or under-irrigation wastes resources and harms crops.',
    color: 'text-info',
    bgColor: 'bg-info/10',
    borderColor: 'border-info/20',
  },
  {
    icon: AlertTriangle,
    title: 'Excessive Fertilizers',
    description: 'Wrong timing and quantity of fertilizers reduces soil health and profits.',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/20',
  },
  {
    icon: TrendingDown,
    title: 'Low Productivity',
    description: 'Lack of scientific guidance keeps yields below potential.',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    borderColor: 'border-secondary/20',
  },
  {
    icon: HelpCircle,
    title: 'No Timely Information',
    description: 'Critical decisions made without data lead to unstable income.',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    borderColor: 'border-muted-foreground/20',
  },
];

const ProblemsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <span className="text-sm font-semibold text-danger uppercase tracking-wide">The Challenges</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Problems Farmers Face Daily
          </h2>
          <p className="text-muted-foreground text-lg">
            Indian farmers lose billions every year due to lack of timely, actionable information. 
            These are the challenges CropIQ solves.
          </p>
        </motion.div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`card-elevated p-6 ${problem.borderColor} border-2 hover:shadow-lg transition-all group`}
            >
              <div className={`w-14 h-14 rounded-xl ${problem.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <problem.icon className={`w-7 h-7 ${problem.color}`} />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{problem.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;
