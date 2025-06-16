# Prediction Market Orchestrator Frontend

A beautiful React/Next.js frontend for the decentralized prediction market orchestrator that integrates with AI agents.

## Features

- 🌐 Web3 wallet connection (MetaMask)
- 🔗 Avalanche Fuji Testnet integration
- 🎨 Modern UI with Tailwind CSS
- 🤖 Real-time AI analysis responses
- 📱 Responsive design

## Setup Instructions

### 1. Install Dependencies

Make sure you have Node.js and pnpm installed, then run:

```bash
cd frontend
pnpm install
```

### 2. Configure Environment

Copy the `.env.local` file and update the contract address:

```bash
# Replace with your deployed orchestrator contract address
NEXT_PUBLIC_ORCHESTRATOR_ADDRESS=0x1234567890123456789012345678901234567890
```

### 3. Run Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to connect your MetaMask wallet
2. **Switch Network**: The app will prompt you to switch to Avalanche Fuji Testnet
3. **Ask Questions**: Enter your prediction market question
4. **Get Analysis**: Submit the question and wait for AI analysis results

## Technical Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **ethers.js v5**: Ethereum library for Web3 interactions
- **MetaMask**: Wallet integration

## Contract Integration

The frontend interacts with the `Orchestrator.sol` smart contract deployed on Avalanche Fuji Testnet. Make sure to:

1. Deploy the contract using the hardhat scripts in `../prediction-market-orchestrator/`
2. Update the contract address in `.env.local`
3. Ensure your wallet has AVAX tokens for gas fees

## Network Configuration

- **Chain ID**: 0xA869 (Avalanche Fuji Testnet)
- **RPC URL**: https://api.avax-test.network/ext/bc/C/rpc
- **Currency**: AVAX

## Development

### File Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   └── PredictionOrchestrator.tsx  # Main component
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

### Adding New Features

1. Create new components in the `components/` directory
2. Add new pages in the `app/` directory
3. Update contract ABIs as needed
4. Test thoroughly with the Fuji testnet

## Troubleshooting

### Common Issues

1. **Wallet Connection Fails**: Ensure MetaMask is installed and unlocked
2. **Network Switch Fails**: Manually add Avalanche Fuji to MetaMask
3. **Transaction Fails**: Check that you have enough AVAX for gas fees
4. **Contract Not Found**: Verify the contract address in `.env.local`

### MetaMask Network Configuration

If automatic network switching fails, manually add Avalanche Fuji:

- **Network Name**: Avalanche Fuji C-Chain
- **RPC URL**: https://api.avax-test.network/ext/bc/C/rpc
- **Chain ID**: 43113
- **Currency Symbol**: AVAX
- **Block Explorer**: https://testnet.snowtrace.io/

## License

This project is licensed under the MIT License.
