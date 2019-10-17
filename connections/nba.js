const NBA = require('nba')
const {
  SEASONS,
  SEASON_TYPE,
  SEASON_SEGMENTS
} = require('../constants')

async function getPlayerStats({Season,SeasonSegment,PerMode}){
  const options = {
    PerMode,
    SeasonType: SEASON_TYPE.regular,
    SeasonSegment,
    Season
  }
  const {leagueDashPlayerStats:data} = await NBA.stats.playerStats(options).catch(console.log)
  return data
}

async function getPlayerInfo(PlayerID){
  const options = {
    PlayerID
  }
  const {commonPlayerInfo:[data]} = await NBA.stats.playerInfo(options).catch(console.log)
  return data
}

module.exports = {getPlayerStats,getPlayerInfo}
