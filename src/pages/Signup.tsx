import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, User, Phone, MapPin, ArrowRight, Wheat, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const crops = [
  { value: 'wheat', label: 'Wheat (गेहूं)' },
  { value: 'rice', label: 'Rice (धान)' },
  { value: 'mustard', label: 'Mustard (सरसों)' },
  { value: 'chickpea', label: 'Chickpea (चना)' },
  { value: 'potato', label: 'Potato (आलू)' },
  { value: 'sugarcane', label: 'Sugarcane (गन्ना)' },
  { value: 'cotton', label: 'Cotton (कपास)' },
  { value: 'maize', label: 'Maize (मक्का)' },
];

const states = [
  'Haryana', 'Punjab', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan',
  'Bihar', 'Gujarat', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh',
];

const Signup = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-soft via-background to-accent-soft p-4">
      <div className="absolute inset-0 bg-satellite-grid opacity-30" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-md">
            <Leaf className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-2xl text-foreground">CropIQ</span>
            <span className="text-xs text-muted-foreground -mt-1">AI Smart Farming</span>
          </div>
        </Link>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>1</div>
          <div className={`w-12 h-1 rounded ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</div>
        </div>

        {/* Card */}
        <div className="card-elevated p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {step === 1 ? 'Create Your Account' : 'Farm Details'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {step === 1 ? 'Join thousands of smart farmers' : 'Help us personalize your experience'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="state" className="text-foreground">State</Label>
                  <Select>
                    <SelectTrigger className="h-12 mt-1">
                      <MapPin className="w-5 h-5 text-muted-foreground mr-2" />
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map(state => (
                        <SelectItem key={state} value={state.toLowerCase()}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="district" className="text-foreground">District / Village</Label>
                  <Input
                    id="district"
                    type="text"
                    placeholder="Enter your district or village"
                    className="h-12 mt-1"
                    required
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <Label htmlFor="crop" className="text-foreground">Primary Crop</Label>
                  <Select>
                    <SelectTrigger className="h-12 mt-1">
                      <Wheat className="w-5 h-5 text-muted-foreground mr-2" />
                      <SelectValue placeholder="Select your main crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {crops.map(crop => (
                        <SelectItem key={crop.value} value={crop.value}>{crop.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="farmSize" className="text-foreground">Farm Size (acres)</Label>
                  <Input
                    id="farmSize"
                    type="number"
                    placeholder="Enter farm size in acres"
                    className="h-12 mt-1"
                    min="0.5"
                    step="0.5"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sowingDate" className="text-foreground">Sowing Date</Label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="sowingDate"
                      type="date"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="bg-primary-soft/50 rounded-lg p-4 border border-primary/20">
                  <p className="text-sm text-foreground font-medium mb-1">✨ What happens next?</p>
                  <p className="text-xs text-muted-foreground">
                    Based on your location and crop, we'll analyze satellite data, weather patterns, 
                    and market trends to give you personalized recommendations.
                  </p>
                </div>
              </>
            )}

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <>
                  {step === 1 ? 'Continue' : 'Start Smart Farming'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>

            {step > 1 && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setStep(step - 1)}
              >
                ← Back
              </Button>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
