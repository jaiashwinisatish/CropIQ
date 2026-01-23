import { motion } from 'framer-motion';
import { YieldPrediction } from '@/services/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface YieldChartProps {
  data: YieldPrediction[];
}

const YieldChart = ({ data }: YieldChartProps) => {
  const currentPredicted = data[data.length - 1]?.predicted || 0;
  const previousYield = data[data.length - 1]?.previous || 0;
  const improvement = previousYield > 0 ? Math.round(((currentPredicted - previousYield) / previousYield) * 100) : 0;

  return (
    <div className="card-elevated p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Yield Prediction
        </h3>
        <div className="flex items-center gap-2">
          {improvement > 0 && (
            <span className="text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-full">
              ↑ {improvement}% vs last year
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-2xl font-bold text-primary">{currentPredicted}</p>
          <p className="text-xs text-muted-foreground">Predicted (q/acre)</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <p className="text-2xl font-bold text-accent">{data[data.length - 1]?.optimal || 0}</p>
          <p className="text-xs text-muted-foreground">Optimal (q/acre)</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p className="text-2xl font-bold text-secondary">{previousYield}</p>
          <p className="text-xs text-muted-foreground">Last Year (q/acre)</p>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOptimal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="optimal"
              stroke="hsl(199, 89%, 48%)"
              fill="url(#colorOptimal)"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="hsl(142, 71%, 45%)"
              fill="url(#colorPredicted)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="hsl(var(--secondary))"
              strokeWidth={2}
              strokeDasharray="3 3"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Predicted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-muted-foreground">Optimal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary" />
          <span className="text-muted-foreground">Last Year</span>
        </div>
      </div>
    </div>
  );
};

export default YieldChart;
