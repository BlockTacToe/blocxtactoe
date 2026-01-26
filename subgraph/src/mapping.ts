import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  PlayerRegistered,
  GameCreated,
  MoveMade,
  GameFinished,
  ChallengeCreated
} from "../generated/BlOcXTacToe/BlOcXTacToe"
import { Player, Game, Move } from "../generated/schema"

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
  game.player1 = event.params.player1.toHex()
  if (event.params.player2.toHex() != "0x0000000000000000000000000000000000000000") {
    game.player2 = event.params.player2.toHex()
    game.status = "ACTIVE"
  } else {
    game.status = "CREATED"
  }
  game.betAmount = event.params.betAmount
  game.boardSize = event.params.boardSize
  game.token = event.params.token
  game.createdAt = event.block.timestamp
  game.players = [event.params.player1.toHex()]
  if (game.player2) {
    let players = game.players
    players.push(event.params.player2.toHex())
    game.players = players
  }
  game.save()
}

export function handleMoveMade(event: MoveMade): void {
  let moveId = event.params.gameId.toString() + "-" + event.block.number.toString() + "-" + event.logIndex.toString()
  let move = new Move(moveId)
  move.game = event.params.gameId.toString()
  move.player = event.params.player.toHex()
  move.row = event.params.row
  move.col = event.params.col
  move.symbol = event.params.symbol
  move.timestamp = event.block.timestamp
  move.save()
}

export function handleGameFinished(event: GameFinished): void {
  let game = Game.load(event.params.gameId.toString())
  if (game) {
    game.status = "FINISHED"
    game.finishedAt = event.block.timestamp
    if (event.params.winner.toHex() != "0x0000000000000000000000000000000000000000") {
      game.winner = event.params.winner.toHex()
    }
    game.save()
  }
}

export function handleChallengeCreated(event: ChallengeCreated): void {
  // Similar to handleGameCreated but specific to direct challenges
  let game = new Game(event.params.gameId.toString())
  game.gameId = event.params.gameId
  game.player1 = event.params.player1.toHex()
  game.player2 = event.params.player2.toHex()
  game.betAmount = event.params.betAmount
  game.boardSize = event.params.boardSize
  game.token = event.params.token
  game.createdAt = event.block.timestamp
  game.status = "CREATED"
  game.players = [event.params.player1.toHex(), event.params.player2.toHex()]
  game.save()
}
