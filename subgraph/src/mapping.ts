import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import {
  PlayerRegistered,
  GameCreated,
  GameJoined,
  MovePlayed,
  GameWon,
  GameForfeited,
  ChallengeCreated,
  RewardClaimed
} from "../generated/BlOcXTacToe/BlOcXTacToe"
import { Player, Game, Move, RewardClaim, Protocol } from "../generated/schema"

export function handleRewardClaimed(event: RewardClaimed): void {
  // Create a unique reward claim id
  let id = event.params.gameId.toString() + "-" + event.block.number.toString() + "-" + event.logIndex.toString()
  let rc = new RewardClaim(id)
  rc.game = event.params.gameId.toString()
  rc.winner = event.params.winner.toHex()
  rc.amount = event.params.amount
  rc.timestamp = event.block.timestamp
  rc.save()

  // Update protocol-wide metrics (singleton)
  let protoId = "singleton"
  let proto = Protocol.load(protoId)
  if (!proto) {
    proto = new Protocol(protoId)
    proto.totalVolume = event.params.amount
    proto.totalRewardsClaimed = BigInt.fromI32(1)
    proto.totalFeesCollected = BigInt.fromI32(0)
  } else {
    proto.totalVolume = proto.totalVolume.plus(event.params.amount)
    proto.totalRewardsClaimed = proto.totalRewardsClaimed.plus(BigInt.fromI32(1))
  }
  proto.save()

  // Optionally update game finishedAt if not set
  let game = Game.load(event.params.gameId.toString())
  if (game && !game.finishedAt) {
    game.finishedAt = event.block.timestamp
    game.status = "FINISHED"
    game.save()
  }
}
export function handlePlayerRegistered(event: PlayerRegistered): void {
  let player = Player.load(event.params.player.toHex())
  if (!player) {
    player = new Player(event.params.player.toHex())
    player.address = event.params.player
    player.rating = BigInt.fromI32(1000)
    player.totalGames = BigInt.fromI32(0)
    player.wins = BigInt.fromI32(0)
    player.losses = BigInt.fromI32(0)
    player.draws = BigInt.fromI32(0)
  }
  player.username = event.params.username
  player.save()
}

export function handleGameCreated(event: GameCreated): void {
  let game = new Game(event.params.gameId.toString())
  game.gameId = event.params.gameId
  game.player1 = event.params.playerOne.toHex()
  game.status = "CREATED"
  game.betAmount = event.params.betAmount
  // boardSize is param 3 (index 3)
  game.boardSize = event.parameters[3].value.toI32()
  // tokenAddress is param 4 (index 4)
  game.token = event.parameters[4].value.toAddress()
  game.createdAt = event.block.timestamp
  game.players = [event.params.playerOne.toHex()]
  game.save()
}

export function handleGameJoined(event: GameJoined): void {
  let game = Game.load(event.params.gameId.toString())
  if (game) {
    game.player2 = event.params.playerTwo.toHex()
    game.status = "ACTIVE"
    let players = game.players
    players.push(event.params.playerTwo.toHex())
    game.players = players
    game.save()
  }
}

export function handleMovePlayed(event: MovePlayed): void {
  let moveId = event.params.gameId.toString() + "-" + event.block.number.toString() + "-" + event.logIndex.toString()
  let move = new Move(moveId)
  move.game = event.params.gameId.toString()
  move.player = event.params.player.toHex()
  move.row = event.params.moveIndex
  move.col = 0 
  move.symbol = 0
  move.timestamp = event.block.timestamp
  move.save()
}

export function handleGameWon(event: GameWon): void {
  let game = Game.load(event.params.gameId.toString())
  if (game) {
    game.status = "FINISHED"
    game.finishedAt = event.block.timestamp
    let winnerAddress = event.params.winner.toHex()
    game.winner = winnerAddress
    
    // Update stats
    let winner = Player.load(winnerAddress)
    if (winner) {
      winner.wins = winner.wins.plus(BigInt.fromI32(1))
      winner.totalGames = winner.totalGames.plus(BigInt.fromI32(1))
      winner.save()
    }
    
    let player1Id = game.player1
    let player2Id = game.player2
    if (player2Id) {
       let loserId = winnerAddress == player1Id ? player2Id : player1Id
       let loser = Player.load(loserId)
       if (loser) {
         loser.losses = loser.losses.plus(BigInt.fromI32(1))
         loser.totalGames = loser.totalGames.plus(BigInt.fromI32(1))
         loser.save()
       }
    }
    game.save()
  }
}

export function handleGameForfeited(event: GameForfeited): void {
  let game = Game.load(event.params.gameId.toString())
  if (game) {
    game.status = "FINISHED"
    game.finishedAt = event.block.timestamp
    let winnerId = event.params.winner.toHex()
    game.winner = winnerId
    
    let winner = Player.load(winnerId)
    if (winner) {
      winner.wins = winner.wins.plus(BigInt.fromI32(1))
      winner.totalGames = winner.totalGames.plus(BigInt.fromI32(1))
      winner.save()
    }
    
    let player1Id = game.player1
    let player2Id = game.player2
    if (player2Id) {
       let forfeiterId = winnerId == player1Id ? player2Id : player1Id
       let loser = Player.load(forfeiterId)
       if (loser) {
         loser.losses = loser.losses.plus(BigInt.fromI32(1))
         loser.totalGames = loser.totalGames.plus(BigInt.fromI32(1))
         loser.save()
       }
    }
    game.save()
  }
}

export function handleChallengeCreated(event: ChallengeCreated): void {
  let game = new Game(event.params.challengeId.toString())
  game.gameId = event.params.challengeId
  game.player1 = event.params.challenger.toHex()
  game.player2 = event.params.challenged.toHex()
  // betAmount is param 3 (index 3)
  game.betAmount = event.parameters[3].value.toBigInt()
  game.boardSize = 3 
  game.token = Bytes.fromHexString("0x0000000000000000000000000000000000000000")
  game.createdAt = event.block.timestamp
  game.status = "CREATED"
  game.players = [event.params.challenger.toHex(), event.params.challenged.toHex()]
  game.save()
}
