import { motion } from 'framer-motion';
import { WeatherData } from '@/services/mockData';

interface WeatherCardProps {
  data: WeatherData[];
}

const WeatherCard = ({ data }: WeatherCardProps) => {
  const today = data[0];
  const forecast = data.slice(1, 6);

  return (
    <div className="card-elevated p-5">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <span className="text-xl">🌤️</span>
        Weather Forecast
      </h3>

      {/* Today's Weather */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-accent/10 to-info/10 rounded-xl p-4 mb-4 border border-accent/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Today</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">{today.temp}</span>
              <span className="text-lg text-muted-foreground">°C</span>
            </div>
            <p className="text-sm text-foreground capitalize mt-1">{today.condition}</p>
          </div>
          <div className="text-right">
            <span className="text-5xl">{today.icon}</span>
            <div className="mt-2 text-xs text-muted-foreground space-y-1">
              <p>💧 {today.humidity}% humidity</p>
              <p>🌧️ {today.rainfall}mm rain</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 5-Day Forecast */}
      <div className="grid grid-cols-5 gap-2">
        {forecast.map((day, index) => {
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });

          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="text-center p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <p className="text-xs text-muted-foreground mb-1">{dayName}</p>
              <span className="text-xl">{day.icon}</span>
              <p className="text-sm font-semibold text-foreground mt-1">{day.temp}°</p>
              {day.rainfall > 0 && (
                <p className="text-xs text-info">{day.rainfall}mm</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherCard;
