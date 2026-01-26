# BlOcXTacToe Subgraph Issues

This file tracks the pending and completed tasks for the **BlOcXTacToe Subgraph**. It serves as the roadmap for data indexing and frontend integration.

---

## ✅ Completed Issues

### Issue #1: Initial Subgraph Scaffolding
**Status:** ✅ COMPLETED  
**Labels:** `infrastructure`  
**Priority:** CRITICAL
**Description:** Initialize the subgraph folder, configure the manifest (`subgraph.yaml`), and copy the project ABI.

### Issue #2: Data Schema Design
**Status:** ✅ COMPLETED  
**Labels:** `schema`  
**Priority:** HIGH
**Description:** Define `Player`, `Game`, and `Move` entities in `schema.graphql` to support complex dApp queries.

### Issue #3: Core Mapping Implementation
**Status:** ✅ COMPLETED  
**Labels:** `mappings`  
**Priority:** HIGH
**Description:** Write AssemblyScript mappings to handle `PlayerRegistered`, `GameCreated`, `MovePlayed`, and `GameWon` events.

### Issue #4: Deployment to Subgraph Studio
**Status:** ✅ COMPLETED  
**Labels:** `deployment`  
**Priority:** CRITICAL
**Description:** Successfully compile mappings to WASM and deploy the subgraph to Subgraph Studio on the Base network.

---

## ❌ Pending Issues

### Issue #5: Frontend Integration — useSubgraph Hook
**Status:** ❌ PENDING  
**Labels:** `frontend`, `integration`  
**Priority:** HIGH
**Description:**
Create a custom React hook in the frontend to interact with the Subgraph GraphQL endpoint.
- **Tasks:**
  - [ ] Implement `useSubgraph` hook using `apollo-client` or `urql`.
  - [ ] Create a standard query utility for fetching data.
  - [ ] Handle loading and error states for GraphQL queries.

### Issue #6: Leaderboard — Subgraph Migration
**Status:** ❌ PENDING  
**Labels:** `frontend`, `feature`  
**Priority:** HIGH
**Description:**
Replace the current contract-based leaderboard logic with a high-performance subgraph query.
- **Tasks:**
  - [ ] Write GraphQL query to fetch top 100 players ordered by `rating`.
  - [ ] Update `Leaderboard.tsx` to use the subgraph data.
  - [ ] Implement instant search/filter for players by username.

### Issue #7: Active Games & Challenges Dashboard
**Status:** ❌ PENDING  
**Labels:** `frontend`, `feature`  
**Priority:** MEDIUM
**Description:**
Use the subgraph to show a live feed of joinable games and pending challenges.
- **Tasks:**
  - [ ] Query for games with status `CREATED`.
  - [ ] Query for challenges where the current user is the `challenged` player.
  - [ ] Display real-time count of active games on the landing page.

### Issue #8: Enhanced Player Profiles
**Status:** ❌ PENDING  
**Labels:** `schema`, `mappings`  
**Priority:** MEDIUM
**Description:**
Expand the subgraph to track more granular player data.
- **Tasks:**
  - [ ] Track total volume bet by each player (in ETH/USDC).
  - [ ] Record "Biggest Win" for each player.
  - [ ] Update mappings to calculate these values on `GameWon` and `GameFinished`.

### Issue #9: Game Replay History
**Status:** ❌ PENDING  
**Labels:** `frontend`, `feature`  
**Priority:** LOW
**Description:**
Allow users to view past games and step through every move made.
- **Tasks:**
  - [ ] Create a `GameDetails` page that fetches a game by ID.
  - [ ] Query all `Move` entities associated with that game ID.
  - [ ] Implement a playback UI to visualize the move sequence.

### Issue #10: Indexing Reward Claims & Financial Metrics
**Status:** ❌ PENDING  
**Labels:** `mappings`, `schema`, `finance`  
**Priority:** MEDIUM
**Description:**
Index when players claim their rewards to track historical payouts and platform volume.
- **Tasks:**
  - [ ] Add `RewardClaim` entity to schema.
  - [ ] Track `totalVolume` and `totalFeesCollected` in a new `Protocol` global entity.
  - [ ] Index `RewardClaimed` events.

### Issue #11: Protocol Governance & Settings Tracking
**Status:** ❌ PENDING  
**Labels:** `mappings`, `governance`  
**Priority:** LOW
**Description:**
Track administrative changes and protocol parameter updates.
- **Tasks:**
  - [ ] Index `TimeoutUpdated`, `PlatformFeeUpdated`, and `KFactorUpdated` events.
  - [ ] Create a `ProtocolSetting` entity to store history of parameter changes.
  - [ ] Index `AdminAdded` and `AdminRemoved` for a transparent audit log.

### Issue #12: Dynamic Token Support Indexing
**Status:** ❌ PENDING  
**Labels:** `mappings`, `feature`  
**Priority:** MEDIUM
**Description:**
Index supported tokens to allow the frontend to dynamically list betting options.
- **Tasks:**
  - [ ] Add `Token` entity to schema.
  - [ ] Index `TokenSupported` event to add/remove tokens from the active list.
  - [ ] Fetch token metadata (name/symbol) in mappings.

### Issue #13: Advanced Player Analytics (Sportsmanship & Forfeits)
**Status:** ❌ PENDING  
**Labels:** `schema`, `analytics`  
**Priority:** LOW
**Description:**
Track how games end to calculate sportsmanship ratings.
- **Tasks:**
  - [ ] Update `Player` entity to include `forfeitCount`.
  - [ ] Index `GameForfeited` event explicitly.
  - [ ] Calculate "Time-to-Move" averages for players.

---

## 📝 Best Practices for Contributors
- **Commit Early:** Follow the "meaningful change" commit instruction.
- **Test Mappings:** Use `graph test` (Matchstick) for complex mapping logic.
- **Version Control:** Always increment the version label (e.g., `v0.0.2`) when deploying to Studio.
