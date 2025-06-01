# 🔐 ProMark Simulated Smart Contracts

This folder simulates blockchain-like storage of campaigns and feedbacks using JSON logs.

## 🔧 How It Works

- `campaign_contract.js`: Stores campaign creation as a transaction
- `feedback_contract.js`: Stores feedback as SHA256 hash
- `simulator.js`: Runs both

## ▶️ How to Run

```bash
cd smart_contracts
node simulator.js

📁 Output
campaign_chain.json: Stored campaigns

feedback_chain.json: Stored hashed feedback

✅ No blockchain required. Just trustable logs for academic + demo purposes.


---

## ✅ Done? Then run it:

```bash
cd ProMark/smart_contracts
node simulator.js

You should see .json logs created and console.log outputs.

