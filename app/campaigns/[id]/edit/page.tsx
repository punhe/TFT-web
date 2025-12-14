'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';
import { Card, CardBody, CardHeader, Input, Textarea, Button, Select, SelectItem, Spinner } from '@heroui/react';

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    from_email: '',
    from_name: '',
    html_content: '',
    status: 'draft' as 'draft' | 'sent' | 'scheduled',
  });

  const fetchCampaign = useCallback(async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`);
      if (response.ok) {
        const campaign = await response.json();
        setFormData({
          name: campaign.name || '',
          subject: campaign.subject || '',
          from_email: campaign.from_email || '',
          from_name: campaign.from_name || '',
          html_content: campaign.html_content || '',
          status: campaign.status || 'draft',
        });
      } else {
        alert('Failed to load campaign');
        router.push('/campaigns');
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
      alert('Error loading campaign');
      router.push('/campaigns');
    } finally {
      setLoading(false);
    }
  }, [campaignId, router]);

  useEffect(() => {
    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId, fetchCampaign]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push(`/campaigns/${campaignId}`);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const errorMessage = errorData.details || errorData.error || 'Failed to update campaign';
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
      alert('Error updating campaign. Please check the console for details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[400px]">
        <Card className="p-8 shadow-sm border border-slate-200 rounded-2xl">
          <CardBody className="items-center">
            <Spinner size="lg" color="primary" />
            <p className="mt-4 text-gray-600">Loading campaign...</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container">
      <Card className="mb-6 bg-white/95 shadow-sm border border-slate-200 rounded-2xl">
        <CardHeader className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Edit campaign</h1>
            <p className="text-slate-600 mt-1">Polish your content or resend with confidence.</p>
          </div>
          <Button
            as={Link}
            href={`/campaigns/${campaignId}`}
            variant="flat"
            color="default"
            startContent={<FiArrowLeft />}
            className="text-slate-800 border border-slate-200 rounded-xl bg-white shadow-sm hover:bg-slate-50"
            size="md"
          >
            Back
          </Button>
        </CardHeader>
      </Card>

      <Card className="shadow-sm border border-slate-200 rounded-2xl bg-white/95">
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">Basics</h3>
              <p className="text-sm text-slate-500">Give the campaign a clear name and subject so teammates know what it is.</p>
              <Input
                label="Campaign name"
                placeholder="e.g., Summer Sale 2024"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                isRequired
                variant="bordered"
                size="lg"
                description="Internal only — customers will not see this."
                classNames={{
                  input: "text-base",
                  label: "text-gray-700 font-semibold"
                }}
              />

              <Input
                label="Email subject"
                placeholder="e.g., Special Offer Just for You!"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                isRequired
                variant="bordered"
                size="lg"
                description="Keep it short, personal, and relevant."
                classNames={{
                  input: "text-base",
                  label: "text-gray-700 font-semibold"
                }}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Sender</h3>
              <p className="text-sm text-slate-500">Match the from name and address to build trust.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="From name"
                  placeholder="e.g., Your Company"
                  value={formData.from_name}
                  onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
                  isRequired
                  variant="bordered"
                  size="lg"
                  description="Shown in the inbox sender name."
                  classNames={{
                    input: "text-base",
                    label: "text-gray-700 font-semibold"
                  }}
                />

                <Input
                  label="From email"
                  type="email"
                  placeholder="e.g., noreply@yourcompany.com"
                  value={formData.from_email}
                  onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
                  isRequired
                  variant="bordered"
                  size="lg"
                  description="Use a domain your recipients recognize."
                  classNames={{
                    input: "text-base",
                    label: "text-gray-700 font-semibold"
                  }}
                />
              </div>

              <div className="space-y-2">
                <Select
                  label="Status"
                  labelPlacement="outside"
                  selectedKeys={new Set([formData.status])}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setFormData({ ...formData, status: selected as 'draft' | 'sent' | 'scheduled' });
                  }}
                  variant="bordered"
                  size="lg"
                  popoverProps={{
                    classNames: { base: 'z-50' },
                    placement: 'bottom-start',
                  }}
                  classNames={{
                    label: "text-gray-700 font-semibold",
                    value: "font-semibold",
                  }}
                >
                  <SelectItem key="draft">Draft</SelectItem>
                  <SelectItem key="sent">Sent</SelectItem>
                  <SelectItem key="scheduled">Scheduled</SelectItem>
                </Select>
                <p className="text-sm text-slate-500 leading-6">
                  Draft: editing only. Scheduled: send later. Sent: mark as completed.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">Email content</h3>
              <p className="text-sm text-slate-500">Paste your HTML. Include links with tracking where needed.</p>
              <Textarea
                label="Email content (HTML)"
                placeholder="<html><body><h1>Your email content here</h1><p>You can use HTML tags.</p><a href='https://example.com'>Click here</a></body></html>"
                value={formData.html_content}
                onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                isRequired
                variant="bordered"
                minRows={12}
                classNames={{
                  input: "font-mono text-sm",
                  label: "text-gray-700 font-semibold"
                }}
              />
            </div>

            <div className="flex gap-3 pt-2 flex-wrap">
              <Button
                type="submit"
                color="primary"
                size="lg"
                isLoading={saving}
                startContent={!saving && <FiSave />}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-6 min-w-[170px]"
              >
                {saving ? 'Saving...' : 'Save changes'}
              </Button>
              <Button
                as={Link}
                href={`/campaigns/${campaignId}`}
                variant="flat"
                color="default"
                size="lg"
                startContent={<FiX />}
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

