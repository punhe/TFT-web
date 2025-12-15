'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, Input, Button, Divider, Checkbox } from '@heroui/react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiArrowRight, 
  FiZap,
  FiStar,
  FiHeart,
  FiSend
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 10 + 5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <m.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-br from-primary/20 to-secondary/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Animated icons
const FloatingIcons = () => {
  const icons = [
    { Icon: FiMail, x: '10%', y: '20%', delay: 0 },
    { Icon: FiStar, x: '85%', y: '15%', delay: 0.5 },
    { Icon: FiHeart, x: '15%', y: '75%', delay: 1 },
    { Icon: FiSend, x: '80%', y: '80%', delay: 1.5 },
    { Icon: FiZap, x: '50%', y: '10%', delay: 2 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, x, y, delay }, i) => (
        <m.div
          key={i}
          className="absolute text-primary/20"
          style={{ left: x, top: y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
          }}
        >
          <Icon size={30} />
        </m.div>
      ))}
    </div>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const { signIn, user, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message || 'Failed to sign in');
      setLoading(false);
    } else {
      setSuccess('Successfully signed in! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <m.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50" />
      <FloatingParticles />
      <FloatingIcons />
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-secondary/30 to-pink-300/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-br from-cyan-300/20 to-primary/20 rounded-full blur-3xl animate-blob animation-delay-4000" />

      <m.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-white/80 backdrop-blur-2xl border border-white/50 shadow-2xl shadow-primary/10 rounded-3xl overflow-hidden">
          {/* Decorative top gradient */}
          <div className="h-2 bg-gradient-to-r from-primary via-secondary to-pink-500" />
          
          <CardBody className="p-8">
            {/* Logo and title */}
            <m.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <m.div
                className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30 mb-4"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiZap className="text-4xl text-white" />
              </m.div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-primary to-secondary bg-clip-text text-transparent">
                Welcome back
              </h1>
              <p className="text-gray-500 mt-2">Sign in to continue to Punhe CRM</p>
            </m.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email input */}
              <m.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Input
                  type="email"
                  label="Email address"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  startContent={<FiMail className="text-gray-400" />}
                  variant="bordered"
                  size="lg"
                  isRequired
                  classNames={{
                    inputWrapper: "bg-white/50 border-gray-200 hover:border-primary focus-within:border-primary rounded-2xl",
                    input: "text-base",
                  }}
                />
              </m.div>

              {/* Password input */}
              <m.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  startContent={<FiLock className="text-gray-400" />}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  }
                  variant="bordered"
                  size="lg"
                  isRequired
                  classNames={{
                    inputWrapper: "bg-white/50 border-gray-200 hover:border-primary focus-within:border-primary rounded-2xl",
                    input: "text-base",
                  }}
                />
              </m.div>

              {/* Remember me & Forgot password */}
              <m.div
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Checkbox
                  isSelected={rememberMe}
                  onValueChange={setRememberMe}
                  size="sm"
                  classNames={{
                    label: "text-sm text-gray-600",
                  }}
                >
                  Remember me
                </Checkbox>
                <Link 
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-secondary transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </m.div>

              {/* Error/Success messages */}
              <AnimatePresence mode="wait">
                {error && (
                  <m.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-sm"
                  >
                    {error}
                  </m.div>
                )}
                {success && (
                  <m.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="p-4 rounded-2xl bg-success/10 border border-success/20 text-success text-sm"
                  >
                    {success}
                  </m.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full h-14 bg-gradient-to-r from-primary via-primary-600 to-secondary text-white font-semibold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                  endContent={!loading && <FiArrowRight className="text-lg" />}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </m.div>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <Divider className="flex-1" />
              <span className="text-gray-400 text-sm">or continue with</span>
              <Divider className="flex-1" />
            </div>

            {/* Social buttons */}
            <m.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                variant="bordered"
                className="h-12 rounded-2xl border-gray-200 hover:bg-gray-50 transition-all"
                startContent={
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                }
              >
                Google
              </Button>
              <Button
                variant="bordered"
                className="h-12 rounded-2xl border-gray-200 hover:bg-gray-50 transition-all"
                startContent={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                }
              >
                GitHub
              </Button>
            </m.div>

            {/* Sign up link */}
            <m.p 
              className="text-center mt-8 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Don't have an account?{' '}
              <Link 
                href="/register" 
                className="text-primary hover:text-secondary font-semibold transition-colors"
              >
                Sign up for free
              </Link>
            </m.p>
          </CardBody>
        </Card>

        {/* Bottom decoration */}
        <m.p 
          className="text-center mt-6 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          By signing in, you agree to our{' '}
          <Link href="/terms" className="text-gray-600 hover:text-primary">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-gray-600 hover:text-primary">Privacy Policy</Link>
        </m.p>
      </m.div>
    </div>
  );
}

