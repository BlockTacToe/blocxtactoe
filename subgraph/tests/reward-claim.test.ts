import {
  assert,
  beforeAll,
  describe,
  test,
  clearStore,
} from "matchstick-as/assembly/index";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { handleRewardClaimed } from "../src/mapping";
import { createRewardClaimedEvent } from "./reward-claim-utils";

describe("RewardClaim mapping tests", () => {
  beforeAll(() => {
    clearStore();
    let gameId = BigInt.fromI32(1);
    let winner = Address.fromString(
      "0x0000000000000000000000000000000000000001",
    );
    let amount = BigInt.fromI32(100);
    let event = createRewardClaimedEvent(gameId, winner, amount);
    handleRewardClaimed(event);
  });

  test("creates RewardClaim and updates Protocol totals", () => {
    assert.entityCount("RewardClaim", 1);
    assert.fieldEquals("Protocol", "singleton", "totalVolume", "100");
    assert.fieldEquals("Protocol", "singleton", "totalRewardsClaimed", "1");
  });
});
