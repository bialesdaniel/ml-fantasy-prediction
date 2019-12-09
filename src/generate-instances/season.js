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
  extractFeatures,
  extractAdvancedFeatures,
  standardizeMissingValues,
  normalizeData,
  stringToBinaryNormalization
} = require('../features/features')
const {ADVANCED_FEATURE_ATTRIBUTES} = require('../features/arff-conversion')
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
    if(season != SEASONS[SEASONS.length-1] && season != SEASONS[0]){ //The last season is only for the outcome
      const result = await getSeasonInstances(season,PerMode)
      instances.push(...result)
    }

  //const instances = await readJson(`${__dirname}/../../instances/advanced/advanced-instances-all.json`)
  return normalize(instances,ADVANCED_FEATURE_ATTRIBUTES)
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
    await newPlayer.getPreviousSeaonTotals(Season)
    await newPlayer.getCurrentSeasonTotals(Season)
    newPlayer.getSeasonDiff()
    newPlayer.getCurrentStatsPerMin()
    newPlayer.addFeatures({
      ...extractFeatures(newPlayer, Season),
      ...extractAdvancedFeatures(newPlayer, Season)
    })
    await newPlayer.getOutcome(Season)
    players.push(newPlayer)
    seasonProgress.tick()
  }
  return players
}

function normalize(instances,attributes){
  let newInstances = standardizeMissingValues(instances)
  newInstances = normalizeData(newInstances,attributes)
  newInstances = stringToBinaryNormalization(newInstances,attributes)
  return newInstances
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
