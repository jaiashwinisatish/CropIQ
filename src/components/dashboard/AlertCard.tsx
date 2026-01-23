import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { Alert as AlertType } from '@/services/mockData';
import { Button } from '@/components/ui/button';

interface AlertCardProps {
  alert: AlertType;
  onDismiss?: (id: string) => void;
}

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    bgClass: 'bg-danger/10',
    borderClass: 'border-danger/30',
    iconClass: 'text-danger',
    labelClass: 'bg-danger text-danger-foreground',
  },
  high: {
    icon: AlertTriangle,
    bgClass: 'bg-warning/10',
    borderClass: 'border-warning/30',
    iconClass: 'text-warning',
    labelClass: 'bg-warning text-warning-foreground',
  },
  medium: {
    icon: AlertCircle,
    bgClass: 'bg-info/10',
    borderClass: 'border-info/30',
    iconClass: 'text-info',
    labelClass: 'bg-info text-info-foreground',
  },
  low: {
    icon: Info,
    bgClass: 'bg-muted',
    borderClass: 'border-muted-foreground/20',
    iconClass: 'text-muted-foreground',
    labelClass: 'bg-muted-foreground text-background',
  },
};

const typeLabels = {
  pest: '🐛 Pest',
  disease: '🦠 Disease',
  weather: '🌦️ Weather',
  market: '📈 Market',
  irrigation: '💧 Irrigation',
};

const AlertCard = ({ alert, onDismiss }: AlertCardProps) => {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`rounded-xl border-2 ${config.bgClass} ${config.borderClass} p-4 relative group`}
    >
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onDismiss(alert.id)}
        >
          <X className="w-4 h-4" />
        </Button>
      )}

      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg ${config.bgClass} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${config.iconClass}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.labelClass}`}>
              {alert.severity.toUpperCase()}
            </span>
            <span className="text-xs text-muted-foreground">
              {typeLabels[alert.type]}
            </span>
          </div>

          <h4 className="font-semibold text-foreground text-sm mb-1">{alert.title}</h4>
          <p className="text-muted-foreground text-xs mb-2">{alert.description}</p>

          <div className="bg-background/50 rounded-lg px-3 py-2 border border-border/50">
            <p className="text-xs font-medium text-foreground">
              👉 {alert.action}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertCard;
