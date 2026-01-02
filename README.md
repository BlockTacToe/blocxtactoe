# BlOcXTacToe 🎮

A fully decentralized, peer-to-peer Tic Tac Toe game built on Ethereum with multi-token betting functionality. Play against other players in real-time, bet ETH or ERC20 tokens, and compete on the leaderboard in a trustless, on-chain environment.

## 🌟 Features

### Core Gameplay
- **🎯 PvP Gameplay** - Play against real players in real-time
- **💰 Multi-Token Betting** - Bet ETH, USDC, USDT, or any supported ERC20 token
- **🏆 Winner Takes All** - Winner receives both players' bet amounts (minus platform fee)
- **🎲 Multiple Board Sizes** - Play on 3x3, 5x5, or 7x7 boards
- **⏰ Timeout Protection** - Anti-griefing mechanism with forfeit system
- **🔒 Trustless** - All game logic and funds managed by smart contract

### Advanced Features
- **🏅 Rating System** - ELO-style rating system for competitive play
- **📊 Leaderboard** - Top 100 players ranked by rating
- **🎯 Challenge System** - Challenge specific players directly
- **📈 Player Stats** - Track wins, losses, draws, and total games
- **🎨 Beautiful UI** - Modern, responsive design with animations
- **⚡ Real-time Updates** - Live game state updates

## 📁 Project Structure

```
blocxtactoe/
├── smartcontract/          # Solidity smart contracts
│   ├── contracts/          # Contract source files
│   │   └── TicTacToe.sol  # Main game contract
│   ├── test/              # Comprehensive test suite (191+ tests)
│   ├── scripts/           # Deployment scripts
│   └── README.md          # Smart contract documentation
│
└── frontend/              # Next.js web application
    ├── src/
    │   ├── app/           # Next.js app router pages
    │   ├── components/    # React components
    │   ├── hooks/         # Custom React hooks
    │   ├── abi/           # Contract ABI
    │   └── config/        # Configuration files
    └── README.md          # Frontend documentation
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Hardhat** - For smart contract development
- **Ethereum Wallet** - MetaMask or compatible wallet
- **Testnet ETH** - For testing on Base Sepolia

### Smart Contracts

```bash
# Navigate to smart contract directory
cd smartcontract

# Install dependencies
npm install

# Run tests (191+ passing tests)
npm test

# Deploy to Base Sepolia
npm run deploy:sepolia

# Verify contract
npm run verify:sepolia
```

### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your contract address and Reown project ID

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play!

## 🛠️ Tech Stack

### Smart Contracts
- **Solidity** ^0.8.x - Smart contract language
- **Hardhat** - Development framework
- **OpenZeppelin** - Security libraries (ReentrancyGuard, Pausable)
- **Base Network** - Ethereum L2 for fast, cheap transactions

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Ethers.js v6** - Ethereum library
- **Reown AppKit** - Wallet connection (WalletConnect/MetaMask)
- **Wagmi & Viem** - React hooks for Ethereum

## 🎮 How to Play

1. **Connect Wallet** - Connect your Ethereum wallet using Reown AppKit
2. **Register** - Register as a player (one-time setup)
3. **Select Token** - Choose ETH or any supported ERC20 token for betting
4. **Create Game** - Set bet amount, select board size (3x3, 5x5, 7x7), and create game
5. **Join Game** - Browse available games and join one with matching bet
6. **Play** - Take turns making moves on the board
7. **Win** - Get 3/4/5 in a row (depending on board size) to win both bets!

## 🎯 Game Rules

- **Board Sizes**: 3x3, 5x5, or 7x7 grid
- **Moves**: Player 1 uses X (value 1), Player 2 uses O (value 2)
- **Winning**: 
  - 3x3 board: 3 in a row
  - 5x5 board: 4 in a row
  - 7x7 board: 5 in a row
- **Betting**: Both players must bet equal amounts in the same token
- **Reward**: Winner receives both players' bets (minus 5% platform fee)
- **Timeout**: Configurable timeout per move (default 24 hours)
- **Forfeit**: Opponent can claim win if player times out

## 🔒 Security Features

### Smart Contract Security
- ✅ **Reentrancy Protection** - All state-changing functions protected
- ✅ **Pausable** - Emergency pause functionality
- ✅ **Access Control** - Admin-only functions for platform management
- ✅ **Input Validation** - Comprehensive validation on all functions
- ✅ **Custom Errors** - Gas-efficient error handling
- ✅ **Checks-Effects-Interactions** - Best practice pattern followed

### Testing
- ✅ **191+ Tests** - Comprehensive test coverage (~98%+)
- ✅ **6 Test Files** - Core, admin, challenges, rating, payment, edge cases
- ✅ **Security Tests** - Reentrancy, access control, input validation
- ✅ **Edge Case Coverage** - 25+ edge case scenarios tested

## 📊 Protocol Parameters

- **Platform Fee**: 5% (configurable by admin, max 10%)
- **Move Timeout**: 24 hours (configurable: 1 second to 7 days)
- **Rating System**: ELO-style with configurable K-factor
- **Leaderboard Size**: Top 100 players
- **Supported Tokens**: ETH + admin-configurable ERC20 tokens

## 🌐 Deployed Contracts

### Base Mainnet
- **Contract Address**: `0x52e3C6FF91c51493E08434E806bD54Bd5c7a2151`
- **Deployed**: 2025-11-22
- **Status**: ✅ Verified on BaseScan

### Base Sepolia (Testnet)
- **Contract Address**: `0x5c6a9F3511773bc0DBf6354623104f01Ac8EE629`
- **Deployed**: 2025-11-15
- **Status**: ✅ Available for testing

## 📖 Documentation

- **[Smart Contract Documentation](./smartcontract/README.md)** - Contract architecture, functions, and deployment
- **[Frontend Documentation](./frontend/README.md)** - UI implementation and wallet integration
- **[Test Coverage Analysis](./TEST_COVERAGE_ANALYSIS.md)** - Detailed test coverage report

## 🔑 Key Features Explained

### Rating System
- **ELO-based** - Similar to chess rating system
- **Dynamic Updates** - Rating changes based on opponent's rating
- **K-factor** - Configurable sensitivity (default: 32)
- **Minimum Rating** - 0 (no negative ratings)

### Challenge System
- **Direct Challenges** - Challenge specific players
- **Custom Parameters** - Set bet amount, token, and board size
- **Multiple Challenges** - Create multiple challenges to different players
- **Challenge History** - View all your challenges

### Leaderboard
- **Top 100 Players** - Ranked by rating
- **Real-time Updates** - Updates after each game
- **Tie Handling** - Players with same rating sorted by registration order

### Multi-Token Support
- **Native ETH** - 18 decimals
- **ERC20 Tokens** - USDC (6 decimals), USDT (6 decimals), etc.
- **Dynamic Decimals** - Automatically detects token decimals
- **Admin Management** - Admins can add/remove supported tokens

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the Repository**
2. **Create Feature Branch** - `git checkout -b feature/amazing-feature`
3. **Make Changes** - Follow coding standards
4. **Write Tests** - Add tests for new functionality
5. **Run Tests** - Ensure all tests pass
6. **Submit PR** - Include clear description

### Development Guidelines
- Follow Solidity style guide for contracts
- Use TypeScript for frontend code
- Write comprehensive tests for new features
- Update documentation as needed
- Follow conventional commit messages

## 🧪 Testing

### Smart Contracts
```bash
cd smartcontract

# Run all tests
npm test

# Run specific test file
npx hardhat test test/BlOcXTacToe.test.ts

# Run with coverage
npm test -- --coverage
```

### Frontend
```bash
cd frontend

# Build check
npm run build

# Lint check
npm run lint
```

## 📦 Deployment

### Smart Contracts

**Deploy to Base Sepolia (Testnet):**
```bash
cd smartcontract
npm run deploy:sepolia
npm run verify:sepolia
```

**Deploy to Base Mainnet:**
```bash
cd smartcontract
npm run deploy:mainnet
npm run verify:mainnet
```

### Frontend

**Vercel (Recommended):**
1. Connect GitHub repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_PROJECT_ID` - Reown project ID
   - `NEXT_PUBLIC_CONTRACT_ADDRESS` - Deployed contract address
3. Deploy automatically on push to main

**Other Platforms:**
- **Netlify**: Similar to Vercel
- **AWS/GCP**: Deploy as containerized Next.js app

## 📚 Resources

- [Ethereum Documentation](https://ethereum.org/en/developers/docs/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Reown AppKit](https://docs.reown.com/appkit/overview)
- [Base Network](https://base.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

## ⚠️ Disclaimer

**This is a game with real money betting.** Please play responsibly:
- Only bet what you can afford to lose
- Understand the risks of blockchain transactions
- Contract has not undergone professional security audit
- Use at your own risk

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **GitHub Repository**: https://github.com/BlockTacToe/blocxtactoe
- **Frontend**: (Now merged into this monorepo)
- **Live App**: [Coming Soon]

## 📞 Support

For questions and support:
- Open an issue on GitHub
- Check component-specific README files
- Review test files for usage examples

---

**Built with ❤️ on Base blockchain**
