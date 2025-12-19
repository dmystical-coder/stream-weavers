# 🌊 StreamWeavers: Continuous Prosperity Protocol

StreamWeavers is a decentralized asset allocation engine built for the **Celo Ecosystem**. It replaces rigid, lump-sum funding with fluid, time-based capital distribution, allowing CELO and stablecoins (cUSD/cEUR) to flow to contributors linearly as time passes.

## 🚀 Vision
In a world of stale asset allocation, we pioneer novel means of distributing capital that incentivize coordination. Our "Time-Shift" withdrawal logic ensures that resources and freedom flow hand-in-hand.

## ✨ Key Features
- **Individualized Unlock Times:** Set unique stream durations for different contributors.
- **Multi-Asset Support:** Native CELO, cUSD, and cEUR streaming within a single contract.
- **Precision Time-Shift Math:** Partial withdrawals don't reset your progress; they only shift the start-time proportionally.
- **Live-Ticker UI:** A high-fidelity Next.js dashboard showing real-time balance accumulation.

## 🛠 Tech Stack
- **Smart Contracts:** Solidity, OpenZeppelin, Foundry
- **Frontend:** Next.js, Tailwind CSS, Material UI (MUI)
- **Blockchain:** Celo (Mainnet & Alfajores Testnet)

## 📦 Setup & Installation

### Smart Contracts (Foundry)
1. **Clone the repo:**
   
   ```bash
   git clone https://github.com/your-username/streamweavers.git
   cd streamweavers/packages/foundry
   ```
   
2. Install dependencies:
   
  ```bash
  forge install
  ```

3. Run Tests:
   
  ```bash
  forge test
  ```

Frontend (Next.js)

Navigate to UI folder: Install & Run:

```bash
npm install
npm run dev
```

## 📜 Contract Architecture
The protocol uses a Linear Flow Algorithm:
$Available = \min(Cap, \frac{Cap \times (CurrentTime - LastWithdrawal)}{Duration})$

## 🤝 Contributing
Join the StreamWeavers. Open an issue or submit a PR to help us refine the flow of prosperity.
