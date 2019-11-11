const {
  readJson,
  writeJson
} = require('fs-extra')
const Player = require('../utils/Player')
const {lookupPlayerInfo:getPlayerInfo} = require('../caches/player-info')
const {lookupPlayerStats:getNextYearStats} = require('../caches/player-total-stats')
const {
  getPlayerStats
} = require('../connections/nba')
const {
  extractFeatures
} = require('../features/features')
const {
  calculateFantasyPointsPerGame
} = require('../utils')
const ProgressBar = require('../utils/ProgressBar')
const {
  SEASON_TYPE,
  SEASONS,
  MODES
} = require('../utils/constants')

module.exports = {
  getAllSeasonsInstances,
  getSeasonInstances,
  getSeasonInstancesStatic,
  generateSeasonJSON
}

async function getAllSeasonsInstances(PerMode){
  const instances = []
  for (season of SEASONS){
    if(season != SEASONS[SEASONS.length-1]){ //The last season is only for the outcome
      const result = await getSeasonInstances(season,PerMode)
      instances.push(...result)
    }
  }
  return instances
}

async function getSeasonInstances(Season,PerMode) {
  const options = {
    Season,
    PerMode
  }
  const stats = await getPlayerStats(options)
  const seasonProgress = new ProgressBar({title: `${Season} season: `,total:stats.length})
  const players = []
  for (playerStats of stats) {
    const newPlayer = new Player({playerId:playerStats.playerId,playerName:playerStats.playerName})
    newPlayer.addData(playerStats)
    await newPlayer.getGeneralInfo()
    await newPlayer.getSeasonSplitData(Season)
    newPlayer.addFeatures({
      ...extractFeatures(newPlayer, Season)
    })
    //TODO: extract more features
    await newPlayer.getOutcome(Season)
    players.push(newPlayer)
    seasonProgress.tick()
  }
  return players
}

/*BELOW FUNCTIONS ARE FOR STATIC FETCHING INSTANCES*/
async function generateSeasonJSON(Season, PerMode) {
  const options = {
    Season,
    PerMode
  }
  const seasonStats = await getPlayerStats(options)
  await writeJson(`${__dirname}/data/seasons/${PerMode}/${Season}.json`, seasonStats)
  return `generated /data/seasons/${PerMode}/${Season}.json`
}

async function getSeasonInstancesStatic(Season) {
  const stats = await readJson(`${__dirname}/data/seasons/PerGame/${Season}.json`)
  const nextYearStats = await readJson(`${__dirname}/data/seasons/totals/${SEASONS[SEASONS.indexOf(Season)+1]}.json`)
  const players = stats.map((playerStats) => {
    const playerInfo = {} //await getPlayerInfo(playerStats.playerId)
    const newPlayer = {
      playerId: playerStats.playerId,
      playerName: playerStats.playerName,
      data: {
        ...playerStats,
        ...playerInfo
      }
    }
    newPlayer.features = {
      ...extractFeatures(newPlayer, Season)
    }
    const nextYearPlayer = nextYearStats.filter(player => player.playerId === newPlayer.playerId)
    newPlayer.outcome = calculateFantasyPointsPerGame(nextYearPlayer[0])
    return newPlayer
  })
  return players
}
