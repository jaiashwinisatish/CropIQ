import { motion } from 'framer-motion';
import { CropHealthData } from '@/services/mockData';
import { Leaf, AlertTriangle, CheckCircle } from 'lucide-react';

interface CropHealthCardProps {
  data: CropHealthData;
  cropName?: string;
}

const statusConfig = {
  excellent: { color: 'text-success', bg: 'bg-success', label: 'Excellent' },
  good: { color: 'text-primary', bg: 'bg-primary', label: 'Good' },
  moderate: { color: 'text-warning', bg: 'bg-warning', label: 'Moderate' },
  poor: { color: 'text-danger', bg: 'bg-danger', label: 'Poor' },
};

const CropHealthCard = ({ data, cropName = 'Wheat' }: CropHealthCardProps) => {
  const config = statusConfig[data.status];
  const lastUpdated = new Date(data.lastUpdated).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="card-elevated p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Leaf className="w-5 h-5 text-primary" />
          Crop Health
        </h3>
        <span className="text-xs text-muted-foreground">Updated {lastUpdated}</span>
      </div>

      <div className="flex items-center gap-6 mb-6">
        {/* Health Score Circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative"
        >
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="42"
              className="fill-none stroke-muted stroke-[8]"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="42"
              className={`fill-none ${config.bg} stroke-current stroke-[8]`}
              strokeLinecap="round"
              strokeDasharray={264}
              initial={{ strokeDashoffset: 264 }}
              animate={{ strokeDashoffset: 264 - (264 * data.score) / 100 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{data.score}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </motion.div>

        {/* Status Info */}
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{cropName}</p>
          <p className={`text-xl font-bold ${config.color}`}>{config.label}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Based on satellite imagery & weather analysis
          </p>
        </div>
      </div>

      {/* Issues */}
      {data.issues.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            Attention Needed
          </p>
          {data.issues.map((issue, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-2 text-sm text-muted-foreground bg-warning/5 rounded-lg px-3 py-2 border border-warning/10"
            >
              <span className="text-warning">•</span>
              {issue}
            </motion.div>
          ))}
        </div>
      )}

      {data.issues.length === 0 && (
        <div className="flex items-center gap-2 text-success bg-success/5 rounded-lg px-4 py-3">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">No issues detected. Crop is healthy!</span>
        </div>
      )}
    </div>
  );
};

export default CropHealthCard;
