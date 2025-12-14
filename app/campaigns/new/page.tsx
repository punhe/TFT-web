'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Input, Textarea, Button } from '@heroui/react';
import { FiPlus, FiX } from 'react-icons/fi';

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    from_email: '',
    from_name: '',
    html_content: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const campaign = await response.json();
        router.push(`/campaigns/${campaign.id}`);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const errorMessage = errorData.details || errorData.error || 'Failed to create campaign';
        const hint = errorData.hint ? `\n\n${errorData.hint}` : '';
        alert(`${errorMessage}${hint}`);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Error creating campaign. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Card className="mb-6 bg-white/95 shadow-sm border border-slate-200 rounded-2xl">
        <CardHeader className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">Create new campaign</h1>
          <p className="text-slate-600">Set the basics so you can start sending in minutes.</p>
        </CardHeader>
      </Card>

      <Card className="shadow-sm border border-slate-200 rounded-2xl bg-white/95">
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Campaign Name"
              placeholder="e.g., Summer Sale 2024"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              isRequired
              variant="bordered"
              size="lg"
              classNames={{
                input: "text-base",
                label: "text-gray-700 font-semibold"
              }}
            />

            <Input
              label="Email Subject"
              placeholder="e.g., Special Offer Just for You!"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              isRequired
              variant="bordered"
              size="lg"
              classNames={{
                input: "text-base",
                label: "text-gray-700 font-semibold"
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="From Name"
                placeholder="e.g., Your Company"
                value={formData.from_name}
                onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
                isRequired
                variant="bordered"
                size="lg"
                classNames={{
                  input: "text-base",
                  label: "text-gray-700 font-semibold"
                }}
              />

              <Input
                label="From Email"
                type="email"
                placeholder="e.g., noreply@yourcompany.com"
                value={formData.from_email}
                onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
                isRequired
                variant="bordered"
                size="lg"
                classNames={{
                  input: "text-base",
                  label: "text-gray-700 font-semibold"
                }}
              />
            </div>

            <Textarea
              label="Email Content (HTML)"
              placeholder="<html><body><h1>Your email content here</h1><p>You can use HTML tags.</p><a href='https://example.com'>Click here</a></body></html>"
              value={formData.html_content}
              onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
              isRequired
              variant="bordered"
              minRows={10}
              classNames={{
                input: "font-mono text-sm",
                label: "text-gray-700 font-semibold"
              }}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                color="primary"
                size="lg"
                isLoading={loading}
                startContent={!loading && <FiPlus />}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-6"
              >
                {loading ? 'Creating...' : 'Create campaign'}
              </Button>
              <Button
                type="button"
                variant="flat"
                color="default"
                size="lg"
                startContent={<FiX />}
                onPress={() => router.back()}
                className="font-semibold rounded-xl bg-white text-slate-800 border border-slate-200 shadow-sm hover:bg-slate-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

