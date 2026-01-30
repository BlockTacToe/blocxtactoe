import { newMockEvent } from "matchstick-as/assembly/index"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { RewardClaimed } from "../generated/BlOcXTacToe/BlOcXTacToe"

export function createRewardClaimedEvent(gameId: BigInt, winner: Address, amount: BigInt): RewardClaimed {
  let event = changetype<RewardClaimed>(newMockEvent())

  event.parameters = new Array()
  event.parameters.push(new ethereum.EventParam("gameId", ethereum.Value.fromUnsignedBigInt(gameId)))
  event.parameters.push(new ethereum.EventParam("winner", ethereum.Value.fromAddress(winner)))
  event.parameters.push(new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount)))

  return event
}
