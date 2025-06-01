const fs = require('fs');
const path = require('path');

const campaignLogPath = path.join(__dirname, 'campaign_chain.json');

function storeCampaign(campaign) {
  const data = fs.existsSync(campaignLogPath)
    ? JSON.parse(fs.readFileSync(campaignLogPath))
    : [];

  const record = {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    timestamp: new Date().toISOString(),
  };

  data.push(record);
  fs.writeFileSync(campaignLogPath, JSON.stringify(data, null, 2));
  console.log("✅ Campaign stored on-chain:", record);
}

module.exports = { storeCampaign };
