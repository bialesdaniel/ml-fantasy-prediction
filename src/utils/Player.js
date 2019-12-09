const {lookupPlayerInfo:getPlayerInfo} = require('../caches/player-info')
const {lookupPlayerStats:getNextYearStats} = require('../caches/player-total-stats')
const {lookupSeasonSplit:getSeasonSplit} = require('../caches/season-split')
const {calculateFantasyPointsPerGame,getFantasyPointsPerGameBucket} = require('./index')
const {SEASONS,PREVIOUS_YEAR_TOTALS,CURRENT_YEAR_TOTALS,CURRENT_PREVIOUS_DIFF,CURRENT_PER_MIN} = require('./constants')

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
    this.bucket = getFantasyPointsPerGameBucket(this.outcome)
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
    /*if(!currentTotalStats){
        console.log(`${this.playerName}-${SEASONS[SEASONS.indexOf(season)]} BAD`)
    }else{
      console.log(`${this.playerName}-${SEASONS[SEASONS.indexOf(season)]} GOOD`)
    }*/
    const currentYearFppg = calculateFantasyPointsPerGame(currentTotalStats)
    const currentYearTotals = {}
    currentYearTotals[CURRENT_YEAR_TOTALS]={...currentTotalStats,fppg:currentYearFppg}
    this.addData(currentYearTotals)
  }
  getSeasonDiff = ()=>{
    const currentYear = this.data[CURRENT_YEAR_TOTALS]
    const previousYear = this.data[PREVIOUS_YEAR_TOTALS]
    const seasonDiff = {}
    seasonDiff[CURRENT_PREVIOUS_DIFF] = {}
    const stats = Object.keys(currentYear)
    stats.forEach(stat=>{
      seasonDiff[CURRENT_PREVIOUS_DIFF][stat] = previousYear[stat] ? currentYear[stat] - previousYear[stat] : currentYear[stat]
    })
    this.addData(seasonDiff)
  }
  getCurrentStatsPerMin = ()=>{
    const currentYear = this.data[CURRENT_YEAR_TOTALS]
    const perMinStats = {}
    perMinStats[CURRENT_PER_MIN]={}
    const minutes = currentYear.min
    const stats = Object.keys(currentYear)
    stats.forEach(stat=>{
      perMinStats[CURRENT_PER_MIN][stat] = minutes>0 ? currentYear[stat]/minutes : 0
    })
    this.addData(perMinStats)
  }
}

module.exports = Player
