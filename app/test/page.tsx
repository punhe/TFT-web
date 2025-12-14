'use client';

import { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
  Progress,
} from '@heroui/react';
import {
  FiCheck,
  FiX,
  FiLoader,
  FiPlay,
  FiInfo,
  FiZap,
  FiServer,
  FiMail,
  FiDatabase,
  FiActivity,
} from 'react-icons/fi';
import { m, AnimatePresence } from 'framer-motion';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  data?: any;
}

const STATUS_META: Record<
  TestResult['status'],
  { color: 'default' | 'primary' | 'success' | 'danger'; label: string; bg: string }
> = {
  pending: { color: 'default', label: 'Pending', bg: 'bg-gray-50' },
  running: { color: 'primary', label: 'Running', bg: 'bg-primary/5' },
  success: { color: 'success', label: 'Success', bg: 'bg-success/5' },
  error: { color: 'danger', label: 'Error', bg: 'bg-danger/5' },
};

const testIcons = [FiDatabase, FiServer, FiMail, FiActivity, FiZap];

export default function TestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateResult = (index: number, updates: Partial<TestResult>) => {
    setResults((prev) => {
      const newResults = [...prev];
      newResults[index] = { ...newResults[index], ...updates };
      return newResults;
    });
  };

  const runTests = async () => {
    setRunning(true);
    setProgress(0);
    const testResults: TestResult[] = [
      { name: 'Create Campaign', status: 'pending' },
      { name: 'Get Campaigns', status: 'pending' },
      { name: 'Send Email', status: 'pending' },
      { name: 'Get Campaign Detail', status: 'pending' },
      { name: 'Analytics Page', status: 'pending' },
    ];
    setResults(testResults);

    let campaignId: string | null = null;
    const totalTests = testResults.length;

    // Test 1: Create Campaign
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
          message: createData.error || createData.details || 'Failed to create campaign',
          data: createData,
        });
      }
    } catch (error: any) {
      updateResult(0, { status: 'error', message: error.message || 'Network error' });
    }
    setProgress((1 / totalTests) * 100);

    // Test 2: Get Campaigns
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
        updateResult(1, { status: 'error', message: campaigns.error || 'Failed to get campaigns' });
      }
    } catch (error: any) {
      updateResult(1, { status: 'error', message: error.message || 'Network error' });
    }
    setProgress((2 / totalTests) * 100);

    // Test 3: Send Email
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
            message: sendData.error || sendData.details || 'Failed to send email (SMTP may not be configured)',
            data: sendData,
          });
        }
      } catch (error: any) {
        updateResult(2, { status: 'error', message: error.message || 'Network error' });
      }
    } else {
      updateResult(2, { status: 'error', message: 'Skipped: No campaign ID available' });
    }
    setProgress((3 / totalTests) * 100);

    // Test 4: Campaign Detail
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
          updateResult(3, { status: 'error', message: `Page returned ${detailResponse.status}` });
        }
      } catch (error: any) {
        updateResult(3, { status: 'error', message: error.message || 'Network error' });
      }
    } else {
      updateResult(3, { status: 'error', message: 'Skipped: No campaign ID available' });
    }
    setProgress((4 / totalTests) * 100);

    // Test 5: Analytics
    try {
      updateResult(4, { status: 'running' });
      const analyticsResponse = await fetch('/analytics');

      if (analyticsResponse.ok) {
        updateResult(4, { status: 'success', message: 'Analytics page accessible' });
      } else {
        updateResult(4, { status: 'error', message: `Page returned ${analyticsResponse.status}` });
      }
    } catch (error: any) {
      updateResult(4, { status: 'error', message: error.message || 'Network error' });
    }
    setProgress(100);

    setRunning(false);
  };

  const renderStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return (
          <m.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center"
          >
            <FiCheck className="text-success" />
          </m.div>
        );
      case 'error':
        return (
          <m.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 rounded-full bg-danger/20 flex items-center justify-center"
          >
            <FiX className="text-danger" />
          </m.div>
        );
      case 'running':
        return (
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <FiLoader className="animate-spin text-primary" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
          </div>
        );
    }
  };

  const successCount = results.filter((r) => r.status === 'success').length;
  const errorCount = results.filter((r) => r.status === 'error').length;

  return (
    <div className="container max-w-3xl space-y-6">
      {/* Header */}
      <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          
          <CardHeader className="relative flex flex-col gap-4 p-6">
            <div className="flex items-center gap-4">
              <m.div 
                className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg shadow-primary/20"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <FiZap size={24} className="text-white" />
              </m.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  API Test Bench
                </h1>
                <p className="text-gray-500 mt-1">Run a quick health check across the main endpoints</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </m.div>

      {/* Test Runner */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-lg overflow-hidden">
          <CardBody className="p-6 space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <FiInfo className="text-primary" />
                </div>
                <span className="text-sm">Tests run live against your current environment</span>
              </div>
              <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onPress={runTests}
                  startContent={running ? <FiLoader className="animate-spin" /> : <FiPlay />}
                  isDisabled={running}
                  className="rounded-xl px-6 bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/25"
                >
                  {running ? 'Running tests...' : 'Run all tests'}
                </Button>
              </m.div>
            </div>

            {/* Progress */}
            {running && (
              <m.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <Progress
                  value={progress}
                  color="primary"
                  className="h-2"
                  classNames={{
                    indicator: "bg-gradient-to-r from-primary to-secondary",
                  }}
                />
              </m.div>
            )}

            {/* Results summary */}
            {results.length > 0 && !running && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-success/10 rounded-xl">
                  <FiCheck className="text-success" />
                  <span className="font-semibold text-success">{successCount} passed</span>
                </div>
                {errorCount > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-danger/10 rounded-xl">
                    <FiX className="text-danger" />
                    <span className="font-semibold text-danger">{errorCount} failed</span>
                  </div>
                )}
              </m.div>
            )}

            <Divider />

            {/* Test Results */}
            {results.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {results.map((result, index) => {
                    const Icon = testIcons[index] || FiZap;
                    const meta = STATUS_META[result.status];

                    return (
                      <m.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className={`border border-gray-100 shadow-sm ${meta.bg}`}>
                          <CardBody className="p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                {renderStatusIcon(result.status)}
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Icon className="text-gray-400" size={16} />
                                    <p className="font-semibold text-gray-900">{result.name}</p>
                                  </div>
                                  {result.message && (
                                    <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                                  )}
                                </div>
                              </div>
                              <Chip
                                color={meta.color}
                                variant="flat"
                                className="font-semibold"
                                size="sm"
                              >
                                {meta.label}
                              </Chip>
                            </div>

                            {result.data && result.status === 'success' && (
                              <m.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="rounded-xl border border-gray-200 bg-white p-3 mt-2"
                              >
                                <p className="text-xs text-gray-500 mb-2 font-medium">Response payload</p>
                                <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words max-h-48 overflow-auto font-mono bg-gray-50 p-3 rounded-lg">
                                  {JSON.stringify(result.data, null, 2)}
                                </pre>
                              </m.div>
                            )}
                          </CardBody>
                        </Card>
                      </m.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiPlay className="text-3xl text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">Ready to test</p>
                <p className="text-sm text-gray-400 mt-1">Click "Run all tests" to start the checks</p>
              </div>
            )}
          </CardBody>
        </Card>
      </m.div>

      {/* Info Card */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-lg">
          <CardHeader className="p-6 pb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                <FiInfo className="text-xl text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">What gets tested</h2>
                <p className="text-sm text-gray-500">These steps validate the critical email workflow</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-6 pt-2 space-y-4">
            <ul className="space-y-2">
              {[
                { icon: FiDatabase, text: 'Create Campaign: POST /api/campaigns' },
                { icon: FiServer, text: 'Get Campaigns: GET /api/campaigns' },
                { icon: FiMail, text: 'Send Email: POST /api/send-email (requires SMTP)' },
                { icon: FiActivity, text: 'Get Campaign Detail: campaign detail page' },
                { icon: FiZap, text: 'Analytics Page: analytics page accessibility' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600">
                  <item.icon className="text-primary" size={16} />
                  <span className="text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
            
            <div className="rounded-xl bg-warning/10 border border-warning/20 p-4">
              <p className="text-xs uppercase font-semibold text-warning mb-1">Note</p>
              <p className="text-sm text-gray-600">
                Some steps may show errors if prerequisites (like SMTP) are not configured. That is expected.
              </p>
            </div>
          </CardBody>
        </Card>
      </m.div>
    </div>
  );
}
