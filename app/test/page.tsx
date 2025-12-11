'use client';

import { useState } from 'react';
import { FiCheck, FiX, FiLoader } from 'react-icons/fi';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  data?: any;
}

export default function TestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const updateResult = (index: number, updates: Partial<TestResult>) => {
    setResults(prev => {
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
      // Test 1: Create Campaign
      updateResult(0, { status: 'running' });
      const campaignData = {
        name: `Test Campaign ${Date.now()}`,
        subject: 'Test Email Subject',
        from_email: 'test@example.com',
        from_name: 'Test Sender',
        html_content: '<html><body><h1>Test Email</h1><p>This is a test email.</p><a href="https://example.com">Click here</a></body></html>'
      };

      const createResponse = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData)
      });

      const createData = await createResponse.json();

      if (createResponse.ok) {
        campaignId = createData.id;
        updateResult(0, {
          status: 'success',
          message: `Campaign created: ${createData.name}`,
          data: createData
        });
      } else {
        updateResult(0, {
          status: 'error',
          message: createData.error || createData.details || 'Failed to create campaign',
          data: createData
        });
      }
    } catch (error: any) {
      updateResult(0, {
        status: 'error',
        message: error.message || 'Network error'
      });
    }

    // Test 2: Get Campaigns
    try {
      updateResult(1, { status: 'running' });
      const getResponse = await fetch('/api/campaigns');
      const campaigns = await getResponse.json();

      if (getResponse.ok) {
        updateResult(1, {
          status: 'success',
          message: `Found ${campaigns.length} campaign(s)`,
          data: campaigns
        });
      } else {
        updateResult(1, {
          status: 'error',
          message: campaigns.error || 'Failed to get campaigns'
        });
      }
    } catch (error: any) {
      updateResult(1, {
        status: 'error',
        message: error.message || 'Network error'
      });
    }

    // Test 3: Send Email
    if (campaignId) {
      try {
        updateResult(2, { status: 'running' });
        const emailData = {
          campaign_id: campaignId,
          email: 'test@example.com',
          name: 'Test Recipient'
        };

        const sendResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData)
        });

        const sendData = await sendResponse.json();

        if (sendResponse.ok) {
          updateResult(2, {
            status: 'success',
            message: sendData.message || 'Email sent successfully',
            data: sendData
          });
        } else {
          updateResult(2, {
            status: 'error',
            message: sendData.error || sendData.details || 'Failed to send email (SMTP may not be configured)',
            data: sendData
          });
        }
      } catch (error: any) {
        updateResult(2, {
          status: 'error',
          message: error.message || 'Network error'
        });
      }
    } else {
      updateResult(2, {
        status: 'error',
        message: 'Skipped: No campaign ID available'
      });
    }

    // Test 4: Get Campaign Detail
    if (campaignId) {
      try {
        updateResult(3, { status: 'running' });
        const detailResponse = await fetch(`/campaigns/${campaignId}`);
        
        if (detailResponse.ok) {
          updateResult(3, {
            status: 'success',
            message: 'Campaign detail page accessible',
            data: { url: `/campaigns/${campaignId}` }
          });
        } else {
          updateResult(3, {
            status: 'error',
            message: `Page returned ${detailResponse.status}`
          });
        }
      } catch (error: any) {
        updateResult(3, {
          status: 'error',
          message: error.message || 'Network error'
        });
      }
    } else {
      updateResult(3, {
        status: 'error',
        message: 'Skipped: No campaign ID available'
      });
    }

    // Test 5: Analytics Page
    try {
      updateResult(4, { status: 'running' });
      const analyticsResponse = await fetch('/analytics');
      
      if (analyticsResponse.ok) {
        updateResult(4, {
          status: 'success',
          message: 'Analytics page accessible'
        });
      } else {
        updateResult(4, {
          status: 'error',
          message: `Page returned ${analyticsResponse.status}`
        });
      }
    } catch (error: any) {
      updateResult(4, {
        status: 'error',
        message: error.message || 'Network error'
      });
    }

    setRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <FiCheck className="text-green-500" />;
      case 'error':
        return <FiX className="text-red-500" />;
      case 'running':
        return <FiLoader className="animate-spin text-blue-500" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded" />;
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>API Test Page</h1>
        <p>Test all API endpoints and functionality</p>
      </div>

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={runTests}
            disabled={running}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {running ? (
              <>
                <FiLoader className="animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run All Tests'
            )}
          </button>
        </div>

        {results.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {results.map((result, index) => (
              <div
                key={index}
                style={{
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: result.status === 'success' 
                    ? '#f0fdf4' 
                    : result.status === 'error'
                    ? '#fef2f2'
                    : '#f9fafb'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  {getStatusIcon(result.status)}
                  <strong>{result.name}</strong>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: result.status === 'success'
                        ? '#d1fae5'
                        : result.status === 'error'
                        ? '#fee2e2'
                        : '#e5e7eb',
                      color: result.status === 'success'
                        ? '#065f46'
                        : result.status === 'error'
                        ? '#991b1b'
                        : '#6b7280'
                    }}
                  >
                    {result.status.toUpperCase()}
                  </span>
                </div>
                {result.message && (
                  <div style={{ marginLeft: '29px', color: '#6b7280', fontSize: '14px' }}>
                    {result.message}
                  </div>
                )}
                {result.data && result.status === 'success' && (
                  <details style={{ marginLeft: '29px', marginTop: '8px' }}>
                    <summary style={{ cursor: 'pointer', color: '#6b7280', fontSize: '12px' }}>
                      View Data
                    </summary>
                    <pre
                      style={{
                        marginTop: '8px',
                        padding: '12px',
                        background: '#f3f4f6',
                        borderRadius: '4px',
                        fontSize: '12px',
                        overflow: 'auto',
                        maxHeight: '200px'
                      }}
                    >
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>
            Click &quot;Run All Tests&quot; to start testing
          </p>
        )}
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '16px' }}>Test Information</h2>
        <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#6b7280' }}>
          <li>Create Campaign: Tests POST /api/campaigns</li>
          <li>Get Campaigns: Tests GET /api/campaigns</li>
          <li>Send Email: Tests POST /api/send-email (may fail if SMTP not configured)</li>
          <li>Get Campaign Detail: Tests campaign detail page</li>
          <li>Analytics Page: Tests analytics page accessibility</li>
        </ul>
        <p style={{ marginTop: '16px', color: '#6b7280', fontSize: '14px' }}>
          <strong>Note:</strong> Some tests may show errors if certain features are not configured
          (e.g., SMTP for email sending). This is normal and expected.
        </p>
      </div>
    </div>
  );
}

