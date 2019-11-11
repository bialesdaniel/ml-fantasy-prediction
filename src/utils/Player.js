const {lookupPlayerInfo:getPlayerInfo} = require('../caches/player-info')
const {lookupPlayerStats:getNextYearStats} = require('../caches/player-total-stats')
const {lookupSeasonSplit:getSeasonSplit} = require('../caches/season-split')
const {calculateFantasyPointsPerGame} = require('./index')
const {SEASONS} = require('./constants')

class Player{
  constructor({playerId,playerName}){
    this.playerId = playerId
    this.playerName = playerName
    this.data = {}
    this.features = {}
  }
  addData = (data)=>{
    this.data = {...this.data,...data}
  }
  addFeatures = (features)=>{
    this.features = {...this.features,...features}
  }
  getOutcome = async (season)=>{
    const nextYearStats = await getNextYearStats(SEASONS[SEASONS.indexOf(season)+1],this.playerId)
    this.outcome = calculateFantasyPointsPerGame(nextYearStats)
  }
  getGeneralInfo = async ()=>{
    const playerInfo = await getPlayerInfo(this.playerId)
    this.addData(playerInfo)
  }
  getSeasonSplitData = async (season)=>{
    const seasonSplit = await getSeasonSplit(season,this.playerId)
    this.addData(seasonSplit)
  }
}

module.exports = Player
