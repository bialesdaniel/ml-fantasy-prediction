const NBA = require('nba')
const {wait} = require('../utils')
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
  await wait(1000)
  return data
}

async function getPlayerInfo(PlayerID){
  const options = {
    PlayerID
  }
  const {commonPlayerInfo:[data]} = await NBA.stats.playerInfo(options).catch(console.log)
  await wait(1000)
  return data
}

module.exports = {getPlayerStats,getPlayerInfo}
