'use client';

import { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
} from '@heroui/react';
import {
  FiCheck,
  FiX,
  FiLoader,
  FiPlay,
  FiInfo,
} from 'react-icons/fi';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  data?: any;
}

const STATUS_META: Record<
  TestResult['status'],
  { color: 'default' | 'primary' | 'success' | 'danger'; label: string }
> = {
  pending: { color: 'default', label: 'Pending' },
  running: { color: 'primary', label: 'Running' },
  success: { color: 'success', label: 'Success' },
  error: { color: 'danger', label: 'Error' },
};

export default function TestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const updateResult = (index: number, updates: Partial<TestResult>) => {
    setResults((prev) => {
      const newResults = [...prev];
      newResults[index] = { ...newResults[index], ...updates };
      return newResults;
    });
  };

  const runTests = async () => {
    setRunning(true);
    const testResults: TestResult[] = [
      { name: 'Create Campaign', status: 'pending' },
      { name: 'Get Campaigns', status: 'pending' },
      { name: 'Send Email', status: 'pending' },
      { name: 'Get Campaign Detail', status: 'pending' },
      { name: 'Analytics Page', status: 'pending' },
    ];
    setResults(testResults);

    let campaignId: string | null = null;

    try {
      updateResult(0, { status: 'running' });
      const campaignData = {
        name: `Test Campaign ${Date.now()}`,
        subject: 'Test Email Subject',
        from_email: 'test@example.com',
        from_name: 'Test Sender',
        html_content:
          '<html><body><h1>Test Email</h1><p>This is a test email.</p><a href="https://example.com">Click here</a></body></html>',
      };

      const createResponse = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData),
      });

      const createData = await createResponse.json();

      if (createResponse.ok) {
        campaignId = createData.id;
        updateResult(0, {
          status: 'success',
          message: `Campaign created: ${createData.name}`,
          data: createData,
        });
      } else {
        updateResult(0, {
          status: 'error',
          message:
            createData.error ||
            createData.details ||
            'Failed to create campaign',
          data: createData,
        });
      }
    } catch (error: any) {
      updateResult(0, {
        status: 'error',
        message: error.message || 'Network error',
      });
    }

    try {
      updateResult(1, { status: 'running' });
      const getResponse = await fetch('/api/campaigns');
      const campaigns = await getResponse.json();

      if (getResponse.ok) {
        updateResult(1, {
          status: 'success',
          message: `Found ${campaigns.length} campaign(s)`,
          data: campaigns,
        });
      } else {
        updateResult(1, {
          status: 'error',
          message: campaigns.error || 'Failed to get campaigns',
        });
      }
    } catch (error: any) {
      updateResult(1, {
        status: 'error',
        message: error.message || 'Network error',
      });
    }

    if (campaignId) {
      try {
        updateResult(2, { status: 'running' });
        const emailData = {
          campaign_id: campaignId,
          email: 'test@example.com',
          name: 'Test Recipient',
        };

        const sendResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData),
        });

        const sendData = await sendResponse.json();

        if (sendResponse.ok) {
          updateResult(2, {
            status: 'success',
            message: sendData.message || 'Email sent successfully',
            data: sendData,
          });
        } else {
          updateResult(2, {
            status: 'error',
            message:
              sendData.error ||
              sendData.details ||
              'Failed to send email (SMTP may not be configured)',
            data: sendData,
          });
        }
      } catch (error: any) {
        updateResult(2, {
          status: 'error',
          message: error.message || 'Network error',
        });
      }
    } else {
      updateResult(2, {
        status: 'error',
        message: 'Skipped: No campaign ID available',
      });
    }

    if (campaignId) {
      try {
        updateResult(3, { status: 'running' });
        const detailResponse = await fetch(`/campaigns/${campaignId}`);

        if (detailResponse.ok) {
          updateResult(3, {
            status: 'success',
            message: 'Campaign detail page accessible',
            data: { url: `/campaigns/${campaignId}` },
          });
        } else {
          updateResult(3, {
            status: 'error',
            message: `Page returned ${detailResponse.status}`,
          });
        }
      } catch (error: any) {
        updateResult(3, {
          status: 'error',
          message: error.message || 'Network error',
        });
      }
    } else {
      updateResult(3, {
        status: 'error',
        message: 'Skipped: No campaign ID available',
      });
    }

    try {
      updateResult(4, { status: 'running' });
      const analyticsResponse = await fetch('/analytics');

      if (analyticsResponse.ok) {
        updateResult(4, {
          status: 'success',
          message: 'Analytics page accessible',
        });
      } else {
        updateResult(4, {
          status: 'error',
          message: `Page returned ${analyticsResponse.status}`,
        });
      }
    } catch (error: any) {
      updateResult(4, {
        status: 'error',
        message: error.message || 'Network error',
      });
    }

    setRunning(false);
  };

  const renderStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <FiCheck className="text-green-600" />;
      case 'error':
        return <FiX className="text-rose-600" />;
      case 'running':
        return <FiLoader className="animate-spin text-blue-600" />;
      default:
        return <div className="h-5 w-5 rounded border-2 border-slate-300" />;
    }
  };

  return (
    <div className="container space-y-6">
      <Card className="bg-white/95 shadow-sm border border-slate-200 rounded-2xl">
        <CardHeader className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">API test bench</h1>
          <p className="text-slate-600">
            Run a quick health check across the main endpoints.
          </p>
        </CardHeader>
      </Card>

      <Card className="shadow-sm border border-slate-200 rounded-2xl bg-white/95">
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-600">
              <FiInfo className="text-blue-600" />
              <span className="text-sm">
                Tests run live against your current environment.
              </span>
            </div>
            <Button
              onPress={runTests}
              color="primary"
              variant="solid"
              startContent={
                running ? <FiLoader className="animate-spin" /> : <FiPlay />
              }
              isDisabled={running}
              className="rounded-xl px-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md"
            >
              {running ? 'Running tests...' : 'Run all tests'}
            </Button>
          </div>

          <Divider />

          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((result, index) => {
                const tone =
                  result.status === 'success'
                    ? 'bg-emerald-50'
                    : result.status === 'error'
                    ? 'bg-rose-50'
                    : result.status === 'running'
                    ? 'bg-blue-50'
                    : 'bg-slate-50';

                return (
                  <Card
                    key={index}
                    className={`border border-slate-200 shadow-none ${tone}`}
                  >
                    <CardBody className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {renderStatusIcon(result.status)}
                          <div>
                            <p className="font-semibold text-slate-900">
                              {result.name}
                            </p>
                            {result.message && (
                              <p className="text-sm text-slate-600">
                                {result.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <Chip
                          color={STATUS_META[result.status].color}
                          variant="flat"
                          className="font-semibold"
                          size="sm"
                        >
                          {STATUS_META[result.status].label}
                        </Chip>
                      </div>

                      {result.data && result.status === 'success' && (
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-xs text-slate-500 mb-2">
                            Response payload
                          </p>
                          <pre className="text-xs text-slate-800 whitespace-pre-wrap break-words max-h-60 overflow-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
              Click &quot;Run all tests&quot; to start the checks.
            </div>
          )}
        </CardBody>
      </Card>

      <Card className="shadow-sm border border-slate-200 rounded-2xl bg-white/95">
        <CardHeader>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-slate-900">
              What gets tested
            </h2>
            <p className="text-sm text-slate-600">
              These steps validate the critical email workflow.
            </p>
          </div>
        </CardHeader>
        <CardBody className="space-y-3 text-sm text-slate-600">
          <ul className="list-disc pl-5 space-y-1">
            <li>Create Campaign: POST /api/campaigns</li>
            <li>Get Campaigns: GET /api/campaigns</li>
            <li>Send Email: POST /api/send-email (requires SMTP)</li>
            <li>Get Campaign Detail: campaign detail page</li>
            <li>Analytics Page: analytics page accessibility</li>
          </ul>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-slate-600">
            <p className="text-xs uppercase font-semibold text-slate-500">
              Note
            </p>
            <p className="mt-1 text-sm">
              Some steps may show errors if prerequisites (like SMTP) are not
              configured. That is expected.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

