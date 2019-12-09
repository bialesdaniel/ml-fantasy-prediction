const NBA = require('nba')
const retry = require('async-retry')
const {wait} = require('../utils')
const {
  SEASONS,
  SEASON_TYPE,
  SEASON_SEGMENTS
} = require('../utils/constants')

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
  const {commonPlayerInfo:[data]} = await retry(bail=>NBA.stats.playerInfo(options).catch(console.log),{retries: 10,minTimeout:30*1000,onRetry:()=>console.log('retry')})
  await wait(1000)
  return data
}

module.exports = {getPlayerStats,getPlayerInfo}
