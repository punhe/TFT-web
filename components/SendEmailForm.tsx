'use client';

import { useState } from 'react';
import { Input, Button, Alert } from '@heroui/react';
import { FiSend } from 'react-icons/fi';

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Recipient Email"
          type="email"
          placeholder="recipient@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isRequired
          variant="bordered"
          size="lg"
          classNames={{
            input: "text-base",
            label: "text-gray-700 font-semibold"
          }}
          description="We will only use this address for this send."
        />
        <Input
          label="Recipient Name (Optional)"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="bordered"
          size="lg"
          classNames={{
            input: "text-base",
            label: "text-gray-700 font-semibold"
          }}
          description="Personalize the greeting with a first name."
        />
      </div>

      {message && (
        <Alert
          color={message.type === 'success' ? 'success' : 'danger'}
          variant="flat"
          title={message.type === 'success' ? 'Success' : 'Error'}
        >
          {message.text}
        </Alert>
      )}

      <div className="flex gap-3 flex-wrap items-center">
        <Button
          type="submit"
          color="primary"
          size="md"
          isLoading={loading}
          startContent={!loading && <FiSend />}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-5"
        >
          {loading ? 'Sending...' : 'Send email'}
        </Button>
        <p className="text-sm text-slate-500">We will refresh the stats once delivery is confirmed.</p>
      </div>
    </form>
  );
}

