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
    
    let winnerAddress = event.params.winner.toHex()
    if (winnerAddress != "0x0000000000000000000000000000000000000000") {
      game.winner = winnerAddress
      
      // Update winner stats
      let winner = Player.load(winnerAddress)
      if (winner) {
        winner.wins = winner.wins.plus(BigInt.fromI32(1))
        winner.totalGames = winner.totalGames.plus(BigInt.fromI32(1))
        winner.save()
      }
      
      // Update loser stats
      let player1Id = game.player1
      let player2Id = game.player2
      let loserId = winnerAddress == player1Id ? player2Id : player1Id
      if (loserId) {
        let loser = Player.load(loserId)
        if (loser) {
          loser.losses = loser.losses.plus(BigInt.fromI32(1))
          loser.totalGames = loser.totalGames.plus(BigInt.fromI32(1))
          loser.save()
        }
      }
    } else {
      // Draw
      let p1 = Player.load(game.player1)
      if (p1) {
        p1.draws = p1.draws.plus(BigInt.fromI32(1))
        p1.totalGames = p1.totalGames.plus(BigInt.fromI32(1))
        p1.save()
      }
      let p2Id = game.player2
      if (p2Id) {
        let p2 = Player.load(p2Id)
        if (p2) {
          p2.draws = p2.draws.plus(BigInt.fromI32(1))
          p2.totalGames = p2.totalGames.plus(BigInt.fromI32(1))
          p2.save()
        }
      }
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
