const { storeCampaign } = require('./campaign_contract');
const { storeFeedbackProof } = require('./feedback_contract');

const sampleCampaign = {
  id: 101,
  name: "New Year Offer",
  status: "active"
};

const sampleFeedback = "like";

// Simulate campaign creation
storeCampaign(sampleCampaign);

// Simulate feedback logging
storeFeedbackProof(sampleCampaign.id, sampleFeedback);
