# 🧠 ProMark Smart Contracts (Simulated)

This module simulates blockchain smart contract behavior for:

- 📦 Campaign logging (transparency)
- 🧾 Feedback hash storing (privacy-aware proof)

## How It Works

- `campaign_contract.js` → Logs campaigns to `campaign_chain.json`
- `feedback_contract.js` → Stores SHA-256 hashes of feedbacks

## Run Locally

```bash
cd smart_contracts
node simulator.js

✅ JSON logs will be saved as:

campaign_chain.json

feedback_chain.json

No Docker, no Fabric — 100% JS-based simulation.


---

### ✅ Step 6: Run and Test

In terminal:

```bash
cd C:\Users\umaam\OneDrive\Desktop\ProMark\smart_contracts
node simulator.js


✅ You should see:

campaign_chain.json created

feedback_chain.json created

Console logs confirming both