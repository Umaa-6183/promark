const { storeCampaign } = require('./campaign_contract');
const { storeFeedbackHash } = require('./feedback_contract');

// Simulate a campaign
storeCampaign({ id: 202, name: "Summer Sale", status: "scheduled" });
// Simulate a feedbackhash
storeFeedbackHash(202, "like");
storeFeedbackHash(101, "dislike");
