import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
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

        {/* Card */}
        <div className="card-elevated p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-foreground">Email or Phone</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter email or phone number"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" className="rounded border-border" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

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
                  Logging in...
                </span>
              ) : (
                <>
                  Login to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                Sign up free
              </Link>
            </p>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Need help? Contact us at support@cropiq.in
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
