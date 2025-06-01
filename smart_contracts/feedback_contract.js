const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const feedbackLogPath = path.join(__dirname, 'feedback_chain.json');

function hashFeedback(feedback) {
  return crypto.createHash('sha256').update(feedback).digest('hex');
}

function storeFeedbackProof(campaign_id, feedback) {
  const data = fs.existsSync(feedbackLogPath)
    ? JSON.parse(fs.readFileSync(feedbackLogPath))
    : [];

  const hash = hashFeedback(feedback);
  const record = {
    campaign_id,
    feedback_hash: hash,
    timestamp: new Date().toISOString(),
  };

  data.push(record);
  fs.writeFileSync(feedbackLogPath, JSON.stringify(data, null, 2));
  console.log("🧾 Feedback hash stored on-chain:", record);
}

module.exports = { storeFeedbackProof };
