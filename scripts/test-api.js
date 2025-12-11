/**
 * Test script for Email Marketing Tracker API
 * Run with: node scripts/test-api.js
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Starting API Tests...\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  let campaignId = null;
  let recipientId = null;

  try {
    // Test 1: Create Campaign
    console.log('📝 Test 1: Create Campaign');
    const campaignData = {
      name: 'Test Campaign ' + Date.now(),
      subject: 'Test Email Subject',
      from_email: 'test@example.com',
      from_name: 'Test Sender',
      html_content: '<html><body><h1>Test Email</h1><p>This is a test email.</p><a href="https://example.com">Click here</a></body></html>'
    };

    const createResponse = await fetch(`${BASE_URL}/api/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaignData)
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(`Failed to create campaign: ${JSON.stringify(error)}`);
    }

    const createdCampaign = await createResponse.json();
    campaignId = createdCampaign.id;
    console.log('✅ Campaign created:', campaignId);
    console.log('   Name:', createdCampaign.name);
    console.log('   Status:', createdCampaign.status);
    console.log('');

    // Test 2: Get All Campaigns
    console.log('📋 Test 2: Get All Campaigns');
    const getResponse = await fetch(`${BASE_URL}/api/campaigns`);
    
    if (!getResponse.ok) {
      throw new Error(`Failed to get campaigns: ${getResponse.statusText}`);
    }

    const campaigns = await getResponse.json();
    console.log(`✅ Found ${campaigns.length} campaign(s)`);
    console.log('');

    // Test 3: Send Email (Create Recipient)
    console.log('📧 Test 3: Send Email (Create Recipient)');
    const emailData = {
      campaign_id: campaignId,
      email: 'test@example.com',
      name: 'Test Recipient'
    };

    const sendResponse = await fetch(`${BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });

    if (!sendResponse.ok) {
      const error = await sendResponse.json();
      console.log('⚠️  Email send failed (this is OK if SMTP is not configured):');
      console.log('   Error:', error.error || error.message);
      console.log('   Details:', error.details || 'N/A');
      console.log('');
    } else {
      const sendResult = await sendResponse.json();
      console.log('✅ Email sent successfully:', sendResult.message);
      console.log('');
      
      // Get recipient ID from campaign detail
      const campaignDetailResponse = await fetch(`${BASE_URL}/campaigns/${campaignId}`);
      if (campaignDetailResponse.ok) {
        console.log('✅ Campaign detail page accessible');
        console.log('');
      }
    }

    // Test 4: Test Tracking Endpoints (if we had a recipient ID)
    console.log('🔍 Test 4: Tracking Endpoints');
    console.log('   Note: Tracking requires actual recipient ID from database');
    console.log('   You can test manually by:');
    console.log(`   - Opening: ${BASE_URL}/api/track/open/{recipient-id}`);
    console.log(`   - Clicking: ${BASE_URL}/api/track/click/{recipient-id}?url=https://example.com`);
    console.log('');

    // Test 5: Analytics Page
    console.log('📊 Test 5: Analytics Page');
    const analyticsResponse = await fetch(`${BASE_URL}/analytics`);
    if (analyticsResponse.ok) {
      console.log('✅ Analytics page accessible');
    } else {
      console.log('⚠️  Analytics page error:', analyticsResponse.status);
    }
    console.log('');

    console.log('✅ All basic tests completed!');
    console.log(`\n📝 Created Campaign ID: ${campaignId}`);
    console.log('   You can view it at:', `${BASE_URL}/campaigns/${campaignId}`);
    console.log('\n💡 Next steps:');
    console.log('   1. Open the campaign in browser');
    console.log('   2. Try sending an email (if SMTP is configured)');
    console.log('   3. Test tracking by opening/clicking the email');
    console.log('   4. Check analytics page for tracking data');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

// Run tests
testAPI();

