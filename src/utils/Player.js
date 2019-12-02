const {lookupPlayerInfo:getPlayerInfo} = require('../caches/player-info')
const {lookupPlayerStats:getNextYearStats} = require('../caches/player-total-stats')
const {lookupSeasonSplit:getSeasonSplit} = require('../caches/season-split')
const {calculateFantasyPointsPerGame} = require('./index')
const {SEASONS,PREVIOUS_YEAR_TOTALS,CURRENT_YEAR_TOTALS} = require('./constants')

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
  getPreviousSeaonTotals = async (seaon) =>{
    const prevTotalStats = await getNextYearStats(SEASONS[SEASONS.indexOf(season)-1],this.playerId)
    const prevYearFppg = calculateFantasyPointsPerGame(prevTotalStats)
    const previousYearTotals = {}
    previousYearTotals[PREVIOUS_YEAR_TOTALS]={...prevTotalStats,fppg:prevYearFppg}
    this.addData(previousYearTotals)
  }
  getCurrentSeasonTotals = async (seaon) =>{
    const currentTotalStats = await getNextYearStats(season,this.playerId)
    const currentYearFppg = calculateFantasyPointsPerGame(currentTotalStats)
    const currentYearTotals = {}
    currentYearTotals[CURRENT_YEAR_TOTALS]={...currentTotalStats,fppg:currentYearFppg}
    this.addData(currentYearTotals)
  }
}

module.exports = Player
