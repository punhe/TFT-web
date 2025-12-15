'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, Input, Button } from '@heroui/react';
import { m, AnimatePresence } from 'framer-motion';
import { FiMail, FiArrowLeft, FiCheck, FiSend } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message || 'Failed to send reset email');
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-cyan-300/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-secondary/20 to-pink-300/20 rounded-full blur-3xl animate-blob animation-delay-2000" />

      <m.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-white/80 backdrop-blur-2xl border border-white/50 shadow-2xl shadow-primary/10 rounded-3xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary via-secondary to-pink-500" />
          
          <CardBody className="p-8">
            <AnimatePresence mode="wait">
              {success ? (
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
                    className="w-20 h-20 mx-auto bg-gradient-to-br from-success to-emerald-400 rounded-full flex items-center justify-center mb-6"
                  >
                    <FiCheck className="text-4xl text-white" />
                  </m.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
                  <p className="text-gray-600 mb-8">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                  <Button
                    as={Link}
                    href="/login"
                    variant="bordered"
                    className="rounded-2xl border-gray-200 hover:bg-gray-50"
                    startContent={<FiArrowLeft />}
                  >
                    Back to login
                  </Button>
                </m.div>
              ) : (
                // Form state
                <m.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Header */}
                  <div className="text-center mb-8">
                    <m.div
                      className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 mb-4"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FiMail className="text-4xl text-primary" />
                    </m.div>
                    <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
                    <p className="text-gray-500 mt-2">
                      No worries, we'll send you reset instructions.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <m.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Input
                        type="email"
                        label="Email address"
                        placeholder="Enter your email"
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
                    </m.div>

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

                    <m.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        type="submit"
                        isLoading={loading}
                        className="w-full h-14 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-2xl shadow-lg shadow-primary/30"
                        endContent={!loading && <FiSend />}
                      >
                        {loading ? 'Sending...' : 'Send reset link'}
                      </Button>
                    </m.div>
                  </form>

                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 text-center"
                  >
                    <Link 
                      href="/login"
                      className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                    >
                      <FiArrowLeft />
                      <span>Back to login</span>
                    </Link>
                  </m.div>
                </m.div>
              )}
            </AnimatePresence>
          </CardBody>
        </Card>
      </m.div>
    </div>
  );
}

