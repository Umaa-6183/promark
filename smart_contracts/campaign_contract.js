const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'campaign_chain.json');

function storeCampaign(campaign) {
  let logs = [];

  if (fs.existsSync(logFile)) {
    logs = JSON.parse(fs.readFileSync(logFile));
  }

  const record = {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    timestamp: new Date().toISOString()
  };

  logs.push(record);
  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  console.log('✅ Campaign stored:', record);
}

module.exports = { storeCampaign };
