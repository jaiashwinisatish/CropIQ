import { motion } from 'framer-motion';
import { Recommendation } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const priorityConfig = {
  high: { bg: 'bg-danger/10', border: 'border-danger/20', dot: 'bg-danger' },
  medium: { bg: 'bg-warning/10', border: 'border-warning/20', dot: 'bg-warning' },
  low: { bg: 'bg-muted', border: 'border-muted-foreground/10', dot: 'bg-muted-foreground' },
};

const categoryLabels = {
  irrigation: { emoji: '💧', label: 'Irrigation' },
  fertilizer: { emoji: '🌱', label: 'Fertilizer' },
  pesticide: { emoji: '🛡️', label: 'Protection' },
  harvest: { emoji: '🌾', label: 'Harvest' },
  general: { emoji: '📋', label: 'General' },
};

const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const priority = priorityConfig[recommendation.priority];
  const category = categoryLabels[recommendation.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={`rounded-xl ${priority.bg} border ${priority.border} p-4 transition-all hover:shadow-md cursor-pointer group`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{recommendation.icon}</span>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full">
              {category.emoji} {category.label}
            </span>
            <div className={`w-2 h-2 rounded-full ${priority.dot}`} title={`${recommendation.priority} priority`} />
          </div>
          
          <h4 className="font-semibold text-foreground text-sm mb-1">{recommendation.title}</h4>
          <p className="text-muted-foreground text-xs mb-2 line-clamp-2">{recommendation.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-primary font-medium">⏱️ {recommendation.timing}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface RecommendationListProps {
  recommendations: Recommendation[];
}

export const RecommendationList = ({ recommendations }: RecommendationListProps) => {
  return (
    <div className="card-elevated p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-xl">🎯</span>
          AI Recommendations
        </h3>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <RecommendationCard recommendation={rec} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationCard;
