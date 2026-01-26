# The Graph Subgraph Development & Deployment Guide

A comprehensive, beginner-friendly guide for creating, building, and deploying subgraphs to index blockchain data, based on the **BlOcXTacToe** implementation.

---

## 📋 Table of Contents

1. [Overview: What is a Subgraph?](#overview-what-is-a-subgraph)
2. [Setting Up Your Environment](#setting-up-your-environment)
3. [Initializing Your Subgraph](#initializing-your-subgraph)
4. [Defining Your Data Schema (`schema.graphql`)](#defining-your-data-schema)
5. [Implementing Mappings (`mapping.ts`)](#implementing-mappings)
6. [Configuring the Manifest (`subgraph.yaml`)](#configuring-the-manifest)
7. [Codegen, Build & Deployment](#codegen-build--deployment)
8. [Common Errors & Troubleshooting](#common-errors--troubleshooting)
9. [Best Practices](#best-practices)

---

## 🔍 Overview: What is a Subgraph?

A **Subgraph** acts as the "read layer" for your dApp. Smart contracts are great for writing truth to the blockchain, but they are terrible at serving complex queries (like "Show me all games won by Player X on a 5x5 board").

The Graph indexes your smart contract events, stores them in a structured database, and exposes them via a **GraphQL API** that your frontend can query instantly.

---

## 🔧 Setting Up Your Environment

### 1. Prerequisites
- **Node.js** (v18+)
- **npm** or **yarn**
- **A Subgraph Studio Account:** Sign up at [thegraph.com/studio](https://thegraph.com/studio/).

### 2. Install the Graph CLI
Install the CLI globally so you can use the `graph` command anywhere:
```bash
npm install -g @graphprotocol/graph-cli
```

### 3. Authenticate
Get your **Deploy Key** from your Subgraph Studio dashboard and run:
```bash
graph auth <YOUR_DEPLOY_KEY>
```

---

## 🚀 Initializing Your Subgraph

To bootstrap your project, use the `graph init` command. This will scaffold the project using your contract's address and ABI.

```bash
graph init \
  --from-contract <CONTRACT_ADDRESS> \
  --network base \
  --abi <PATH_TO_ABI_JSON> \
  --contract-name <CONTRACT_NAME> \
  --index-events \
  --skip-install \
  <GITHUB_USER>/<SUBGRAPH_SLUG> \
  <DIRECTORY_NAME>
```

**Pro Tip:** Use `--skip-install` if you want to manage dependencies manually, and always ensure your ABI file path is correct.

---

## 📊 Defining Your Data Schema (`schema.graphql`)

The schema defines the structure of the data you want to query. Think of these as your database tables.

### Key Rules:
- **`@entity`**: Every object you want to store must have this directive.
- **`immutable`**: Set `immutable: true` for data that never changes (like a `Move`). Use `immutable: false` for data that updates (like a `Player's` win count).
- **`ID!`**: Every entity must have a unique ID.

### Example:
```graphql
type Player @entity(immutable: false) {
  id: ID!
  username: String!
  rating: BigInt!
  wins: BigInt!
}

type Move @entity(immutable: true) {
  id: ID!
  game: Game!
  player: Player!
  position: Int!
}
```

---

## 🧠 Implementing Mappings (`mapping.ts`)

Mappings are written in **AssemblyScript** (a subset of TypeScript). They define how to transform raw blockchain events into your Schema entities.

### Common Pattern:
1. **Load** an existing entity.
2. **Create** a new one if it doesn't exist.
3. **Assign** values from `event.params`.
4. **Save** the entity.

### Example:
```typescript
import { Player } from "../generated/schema"
import { PlayerRegistered } from "../generated/ContractName/ContractName"

export function handlePlayerRegistered(event: PlayerRegistered): void {
  let player = Player.load(event.params.player.toHex())
  if (!player) {
    player = new Player(event.params.player.toHex())
    player.wins = BigInt.fromI32(0)
  }
  player.username = event.params.username
  player.save() // Critical: Don't forget to save!
}
```

---

## 📄 Configuring the Manifest (`subgraph.yaml`)

The manifest tells The Graph which contract to watch, which events to listen for, and which mapping functions to call.

### Important Fields:
- **`startBlock`**: Set this to the block number where your contract was deployed. This prevents the indexer from scanning millions of empty blocks.
- **`eventHandlers`**: Must match the exact signature in your ABI.

```yaml
dataSources:
  - name: MyContract
    network: base
    source:
      address: "0x123..."
      abi: MyContract
      startBlock: 17000000
    mapping:
      eventHandlers:
        - event: PlayerRegistered(indexed address,string)
          handler: handlePlayerRegistered
```

---

## 🔨 Codegen, Build & Deployment

Once your code is written, follow these three steps in order:

### 1. Generate Types
Generates AssemblyScript classes for your ABI and Schema.
```bash
npm run codegen
```

### 2. Build WASM
Compiles your mappings into WebAssembly.
```bash
npm run build
```

### 3. Deploy
Pushes your compiled subgraph to the network.
```bash
graph deploy --deploy-key <KEY> --version-label v0.0.1 <SUBGRAPH_NAME>
```

---

## 🛠 Common Errors & Troubleshooting

### 1. "@entity directive requires immutable argument"
**Problem:** Newer Graph nodes require you to explicitly state if an entity is immutable.
**Fix:** Add `(immutable: true)` or `(immutable: false)` to your entity definitions in `schema.graphql`.

### 2. "Event with signature... not present in ABI"
**Problem:** The event signature in `subgraph.yaml` doesn't match the ABI perfectly (usually a typo or missing `indexed`).
**Fix:** Check your ABI JSON file and copy the signature exactly.

### 3. "Property 'xyz' does not exist on type 'Params'"
**Problem:** You are trying to access a parameter in `mapping.ts` that doesn't exist in the generated types.
**Fix:** Check `generated/ContractName/ContractName.ts` to see the actual property names generated by the CLI.

---

## 🌟 Best Practices

- **Use Start Blocks:** Never start from block 0 unless necessary.
- **Atomic Updates:** Handle all related stat updates in the same event handler to keep data consistent.
- **Derived Fields:** Use `@derivedFrom` for one-to-many relationships (e.g., a `Player` having many `Games`) to save storage space.
- **Logging:** Use `log.info("Message: {}", [value])` in mappings for debugging in the Graph Explorer.

---

Happy indexing! 🚀
