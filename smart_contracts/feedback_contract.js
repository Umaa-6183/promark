const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const logFile = path.join(__dirname, 'feedback_chain.json');

function storeFeedbackHash(campaignId, feedback) {
  let logs = [];

  if (fs.existsSync(logFile)) {
    logs = JSON.parse(fs.readFileSync(logFile));
  }

  const hash = crypto.createHash('sha256').update(feedback).digest('hex');
  const record = {
    campaign_id: campaignId,
    feedback_hash: hash,
    timestamp: new Date().toISOString()
  };

  logs.push(record);
  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  console.log('🧾 Feedback hashed & stored:', record);
}

module.exports = { storeFeedbackHash };
