import { motion } from 'framer-motion';
import { Users, Building, Briefcase, Landmark, Heart } from 'lucide-react';

const userTypes = [
  {
    icon: Users,
    title: 'Individual Farmers',
    description: 'Get personalized crop advice, weather alerts, and market insights directly on your phone.',
    benefits: ['Daily recommendations', 'Pest alerts', 'Market prices', 'Yield tracking'],
    color: 'bg-primary',
  },
  {
    icon: Building,
    title: 'FPOs & Cooperatives',
    description: 'Aggregate insights for all member farmers. Plan collectively, market better.',
    benefits: ['Regional analytics', 'Bulk planning', 'Member management', 'Trend reports'],
    color: 'bg-secondary',
  },
  {
    icon: Briefcase,
    title: 'Agri-Enterprises',
    description: 'Data-driven decisions for supply chain, procurement, and farmer engagement.',
    benefits: ['Supply forecasting', 'Quality prediction', 'Risk assessment', 'Traceability'],
    color: 'bg-accent',
  },
  {
    icon: Landmark,
    title: 'Government Bodies',
    description: 'Policy insights, crop monitoring, and early warning systems at scale.',
    benefits: ['District analytics', 'Drought monitoring', 'Scheme targeting', 'Impact tracking'],
    color: 'bg-info',
  },
  {
    icon: Heart,
    title: 'NGOs & Development',
    description: 'Measure impact, identify vulnerable farmers, and deliver targeted interventions.',
    benefits: ['Impact metrics', 'Vulnerability mapping', 'Program monitoring', 'Outcome tracking'],
    color: 'bg-danger',
  },
];

const UsersSection = () => {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wide">Who Benefits</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Built for India's Agriculture Ecosystem
          </h2>
          <p className="text-muted-foreground text-lg">
            From individual farmers to government programs, CropIQ scales to serve everyone in the agriculture value chain.
          </p>
        </motion.div>

        {/* Users Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTypes.slice(0, 3).map((user, index) => (
            <motion.div
              key={user.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className={`w-14 h-14 rounded-xl ${user.color} flex items-center justify-center mb-4 shadow-md`}>
                <user.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-2">{user.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{user.description}</p>
              <ul className="space-y-2">
                {user.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Row - 2 Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto">
          {userTypes.slice(3).map((user, index) => (
            <motion.div
              key={user.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index + 3) * 0.1 }}
              className="bg-background rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className={`w-14 h-14 rounded-xl ${user.color} flex items-center justify-center mb-4 shadow-md`}>
                <user.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-2">{user.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{user.description}</p>
              <ul className="space-y-2">
                {user.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UsersSection;
