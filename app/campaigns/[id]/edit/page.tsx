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
        <Card className="p-8">
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
      <Card className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
        <CardHeader className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Edit Campaign</h1>
            <p className="text-white/90 mt-1">Update campaign details</p>
          </div>
          <Button
            as={Link}
            href={`/campaigns/${campaignId}`}
            variant="light"
            startContent={<FiArrowLeft />}
            className="text-white hover:bg-white/20"
            size="lg"
          >
            Back
          </Button>
        </CardHeader>
      </Card>

      <Card className="shadow-lg">
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
                input: "text-lg",
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
                input: "text-lg",
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
                  input: "text-lg",
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
                  input: "text-lg",
                  label: "text-gray-700 font-semibold"
                }}
              />
            </div>

            <Select
              label="Status"
              selectedKeys={[formData.status]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setFormData({ ...formData, status: selected as 'draft' | 'sent' | 'scheduled' });
              }}
              variant="bordered"
              size="lg"
              classNames={{
                label: "text-gray-700 font-semibold"
              }}
            >
              <SelectItem key="draft">Draft</SelectItem>
              <SelectItem key="sent">Sent</SelectItem>
              <SelectItem key="scheduled">Scheduled</SelectItem>
            </Select>

            <Textarea
              label="Email Content (HTML)"
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

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                color="primary"
                size="lg"
                isLoading={saving}
                startContent={!saving && <FiSave />}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                as={Link}
                href={`/campaigns/${campaignId}`}
                variant="bordered"
                size="lg"
                startContent={<FiX />}
                className="font-semibold"
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

