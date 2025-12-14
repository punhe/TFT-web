'use client';

import { useState } from 'react';
import { Input, Button, Card, CardBody } from '@heroui/react';
import { FiSend, FiMail, FiUser, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { m, AnimatePresence } from 'framer-motion';

export default function SendEmailForm({ campaignId }: { campaignId: string }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: campaignId,
          email,
          name: name || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Email sent successfully!' });
        setEmail('');
        setName('');
        // Refresh page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const errorMsg = data.details 
          ? `${data.error}: ${data.details}`
          : data.error || 'Failed to send email';
        setMessage({ type: 'error', text: errorMsg });
      }
    } catch (error: any) {
      console.error('Error sending email:', error);
      setMessage({ type: 'error', text: error?.message || 'Error sending email. Please check the console.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <m.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Input
            label="Recipient Email"
            type="email"
            placeholder="recipient@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isRequired
            variant="bordered"
            size="lg"
            startContent={<FiMail className="text-gray-400" />}
            classNames={{
              inputWrapper: "bg-white/50 border-gray-200 hover:border-primary focus-within:border-primary rounded-2xl",
              input: "text-base",
              label: "text-gray-700 font-medium"
            }}
            description="We will only use this address for this send."
          />
        </m.div>
        
        <m.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Input
            label="Recipient Name (Optional)"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="bordered"
            size="lg"
            startContent={<FiUser className="text-gray-400" />}
            classNames={{
              inputWrapper: "bg-white/50 border-gray-200 hover:border-primary focus-within:border-primary rounded-2xl",
              input: "text-base",
              label: "text-gray-700 font-medium"
            }}
            description="Personalize the greeting with a first name."
          />
        </m.div>
      </div>

      {/* Message alerts */}
      <AnimatePresence>
        {message && (
          <m.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
          >
            <Card className={`
              border ${message.type === 'success' 
                ? 'bg-success/10 border-success/20' 
                : 'bg-danger/10 border-danger/20'
              }
            `}>
              <CardBody className="flex flex-row items-center gap-3 py-3">
                <div className={`
                  p-2 rounded-full 
                  ${message.type === 'success' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}
                `}>
                  {message.type === 'success' ? <FiCheck size={18} /> : <FiAlertCircle size={18} />}
                </div>
                <div>
                  <p className={`font-medium ${message.type === 'success' ? 'text-success' : 'text-danger'}`}>
                    {message.type === 'success' ? 'Success!' : 'Error'}
                  </p>
                  <p className={`text-sm ${message.type === 'success' ? 'text-success/80' : 'text-danger/80'}`}>
                    {message.text}
                  </p>
                </div>
              </CardBody>
            </Card>
          </m.div>
        )}
      </AnimatePresence>

      <m.div 
        className="flex gap-4 flex-wrap items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            isLoading={loading}
            startContent={!loading && <FiSend />}
            className="bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
            size="lg"
          >
            {loading ? 'Sending...' : 'Send email'}
          </Button>
        </m.div>
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
          Stats refresh automatically after delivery
        </p>
      </m.div>
    </form>
  );
}
