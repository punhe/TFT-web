import db from '@/lib/db';
import CampaignsList from '@/components/CampaignsList';

async function getCampaigns(): Promise<any[]> {
  // Get all campaigns
  const { data: campaigns } = await db
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  if (!campaigns) return [];

  // Get recipient stats for each campaign
  const campaignsWithStats = await Promise.all(
    campaigns.map(async (campaign) => {
      const { data: recipients } = await db
        .from('recipients')
        .select('id, opened_at, clicked_at')
        .eq('campaign_id', campaign.id);

      const recipient_count = recipients?.length || 0;
      const opened_count = recipients?.filter(r => r.opened_at).length || 0;
      const clicked_count = recipients?.filter(r => r.clicked_at).length || 0;

      return {
        ...campaign,
        recipient_count,
        opened_count,
        clicked_count,
      };
    })
  );

  return campaignsWithStats;
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <div className="container">
      <CampaignsList campaigns={campaigns} />
    </div>
  );
}

