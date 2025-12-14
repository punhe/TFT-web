'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, Input, Button, Divider, Checkbox, Progress } from '@heroui/react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  FiMail, 
  FiLock, 
  FiUser,
  FiEye, 
  FiEyeOff, 
  FiArrowRight, 
  FiZap,
  FiCheck,
  FiX,
  FiShield,
  FiAward,
  FiTrendingUp
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

// Animated gradient mesh background
const GradientMesh = () => (
  <div className="absolute inset-0 overflow-hidden">
    <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(99, 102, 241, 0.1)" />
          <stop offset="100%" stopColor="rgba(139, 92, 246, 0.1)" />
        </linearGradient>
      </defs>
      <m.path
        d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z"
        fill="url(#grad1)"
        animate={{
          d: [
            "M0,50 Q25,30 50,50 T100,50 V100 H0 Z",
            "M0,50 Q25,70 50,50 T100,50 V100 H0 Z",
            "M0,50 Q25,30 50,50 T100,50 V100 H0 Z",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  </div>
);

// Feature cards
const features = [
  { icon: FiShield, title: 'Secure', desc: 'Enterprise-grade security' },
  { icon: FiAward, title: 'Premium', desc: 'Access all features' },
  { icon: FiTrendingUp, title: 'Analytics', desc: 'Real-time insights' },
];

// Password strength checker
const checkPasswordStrength = (password: string) => {
  let strength = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  Object.values(checks).forEach(passed => {
    if (passed) strength += 20;
  });

  return { strength, checks };
};

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, user, loading: authLoading } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1);

  const { strength, checks } = checkPasswordStrength(password);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    if (strength < 60) {
      setError('Please use a stronger password');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await signUp(email, password, fullName);

    if (error) {
      setError(error.message || 'Failed to create account');
      setLoading(false);
    } else {
      setSuccess('Account created! Please check your email to verify your account.');
      setStep(3);
    }
  };

  const getStrengthColor = () => {
    if (strength < 40) return 'danger';
    if (strength < 60) return 'warning';
    if (strength < 80) return 'primary';
    return 'success';
  };

  const getStrengthText = () => {
    if (strength < 40) return 'Weak';
    if (strength < 60) return 'Fair';
    if (strength < 80) return 'Good';
    return 'Strong';
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
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/50" />
      <GradientMesh />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-br from-secondary/20 to-pink-300/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-cyan-300/20 rounded-full blur-3xl animate-blob animation-delay-2000" />

      <div className="w-full max-w-5xl relative z-10 grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Features */}
        <m.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block"
        >
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-pink-500 bg-clip-text text-transparent">
                Start your journey
              </span>
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Join thousands of marketers using Punhe CRM to grow their business.
            </p>
          </m.div>

          <div className="space-y-4">
            {features.map((feature, i) => (
              <m.div
                key={feature.title}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50"
              >
                <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl text-white">
                  <feature.icon size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              </m.div>
            ))}
          </div>

          {/* Stats */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 grid grid-cols-3 gap-4"
          >
            {[
              { value: '10K+', label: 'Users' },
              { value: '50M+', label: 'Emails Sent' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </m.div>
        </m.div>

        {/* Right side - Form */}
        <m.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-white/80 backdrop-blur-2xl border border-white/50 shadow-2xl shadow-purple-500/10 rounded-3xl overflow-hidden">
            {/* Progress indicator */}
            <div className="h-1.5 bg-gray-100">
              <m.div
                className="h-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: '33%' }}
                animate={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            <CardBody className="p-8">
              <AnimatePresence mode="wait">
                {step === 3 ? (
                  // Success state
                  <m.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <m.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className="w-24 h-24 mx-auto bg-gradient-to-br from-success to-emerald-400 rounded-full flex items-center justify-center mb-6"
                    >
                      <FiCheck className="text-5xl text-white" />
                    </m.div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">You're all set!</h2>
                    <p className="text-gray-600 mb-8">{success}</p>
                    <Button
                      as={Link}
                      href="/login"
                      className="bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-2xl px-8"
                      size="lg"
                    >
                      Go to Login
                    </Button>
                  </m.div>
                ) : (
                  <m.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Header */}
                    <div className="text-center mb-8">
                      <m.div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30 mb-4"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                      >
                        <FiZap className="text-3xl text-white" />
                      </m.div>
                      <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
                      <p className="text-gray-500 mt-1">Step {step} of 2</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <AnimatePresence mode="wait">
                        {step === 1 ? (
                          // Step 1: Basic info
                          <m.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-5"
                          >
                            <Input
                              label="Full name"
                              placeholder="John Doe"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              startContent={<FiUser className="text-gray-400" />}
                              variant="bordered"
                              size="lg"
                              isRequired
                              classNames={{
                                inputWrapper: "bg-white/50 border-gray-200 hover:border-primary focus-within:border-primary rounded-2xl",
                              }}
                            />

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
                              }}
                            />

                            <Button
                              type="button"
                              onClick={() => setStep(2)}
                              isDisabled={!fullName || !email}
                              className="w-full h-14 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-2xl shadow-lg shadow-primary/30"
                              endContent={<FiArrowRight />}
                            >
                              Continue
                            </Button>
                          </m.div>
                        ) : (
                          // Step 2: Password
                          <m.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-5"
                          >
                            <Input
                              type={showPassword ? "text" : "password"}
                              label="Password"
                              placeholder="Create a strong password"
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
                              }}
                            />

                            {/* Password strength indicator */}
                            {password && (
                              <m.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-2"
                              >
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-500">Password strength</span>
                                  <span className={`font-medium text-${getStrengthColor()}`}>
                                    {getStrengthText()}
                                  </span>
                                </div>
                                <Progress
                                  value={strength}
                                  color={getStrengthColor()}
                                  size="sm"
                                  className="h-2"
                                />
                                <div className="grid grid-cols-2 gap-2 mt-3">
                                  {[
                                    { key: 'length', label: '8+ characters' },
                                    { key: 'uppercase', label: 'Uppercase' },
                                    { key: 'lowercase', label: 'Lowercase' },
                                    { key: 'number', label: 'Number' },
                                  ].map(({ key, label }) => (
                                    <div 
                                      key={key}
                                      className={`flex items-center gap-2 text-xs ${
                                        checks[key as keyof typeof checks] ? 'text-success' : 'text-gray-400'
                                      }`}
                                    >
                                      {checks[key as keyof typeof checks] ? (
                                        <FiCheck className="text-success" />
                                      ) : (
                                        <FiX />
                                      )}
                                      {label}
                                    </div>
                                  ))}
                                </div>
                              </m.div>
                            )}

                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              label="Confirm password"
                              placeholder="Confirm your password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              startContent={<FiLock className="text-gray-400" />}
                              endContent={
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="text-gray-400 hover:text-primary transition-colors"
                                >
                                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                              }
                              variant="bordered"
                              size="lg"
                              isRequired
                              isInvalid={confirmPassword !== '' && password !== confirmPassword}
                              errorMessage={confirmPassword !== '' && password !== confirmPassword ? "Passwords don't match" : ''}
                              classNames={{
                                inputWrapper: "bg-white/50 border-gray-200 hover:border-primary focus-within:border-primary rounded-2xl",
                              }}
                            />

                            <Checkbox
                              isSelected={acceptTerms}
                              onValueChange={setAcceptTerms}
                              size="sm"
                              classNames={{
                                label: "text-sm text-gray-600",
                              }}
                            >
                              I agree to the{' '}
                              <Link href="/terms" className="text-primary hover:underline">Terms</Link>
                              {' '}and{' '}
                              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                            </Checkbox>

                            {/* Error message */}
                            <AnimatePresence>
                              {error && (
                                <m.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-sm"
                                >
                                  {error}
                                </m.div>
                              )}
                            </AnimatePresence>

                            <div className="flex gap-3">
                              <Button
                                type="button"
                                variant="bordered"
                                onClick={() => setStep(1)}
                                className="flex-1 h-14 rounded-2xl border-gray-200"
                              >
                                Back
                              </Button>
                              <Button
                                type="submit"
                                isLoading={loading}
                                isDisabled={!acceptTerms || password !== confirmPassword}
                                className="flex-1 h-14 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-2xl shadow-lg shadow-primary/30"
                              >
                                {loading ? 'Creating...' : 'Create Account'}
                              </Button>
                            </div>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </form>

                    {step === 1 && (
                      <>
                        <div className="my-6 flex items-center gap-4">
                          <Divider className="flex-1" />
                          <span className="text-gray-400 text-sm">or</span>
                          <Divider className="flex-1" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            variant="bordered"
                            className="h-12 rounded-2xl border-gray-200"
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
                            className="h-12 rounded-2xl border-gray-200"
                            startContent={
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                            }
                          >
                            GitHub
                          </Button>
                        </div>
                      </>
                    )}

                    <p className="text-center mt-6 text-gray-600">
                      Already have an account?{' '}
                      <Link 
                        href="/login" 
                        className="text-primary hover:text-secondary font-semibold transition-colors"
                      >
                        Sign in
                      </Link>
                    </p>
                  </m.div>
                )}
              </AnimatePresence>
            </CardBody>
          </Card>
        </m.div>
      </div>
    </div>
  );
}
