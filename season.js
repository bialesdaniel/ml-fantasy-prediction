const {readJson,writeJson} = require('fs-extra')
const {
  getPlayerStats,
  getPlayerInfo
} = require('./connections/nba')
const {
  extractFeatures
} = require('./features')
const {
  calculateFantasyPointsPerGame
} = require('./utils')
const {
  SEASON_TYPE,
  SEASONS
} = require('./constants')

module.exports = {getSeasonInstances,getSeasonInstancesStatic,generateSeasonJSON}

async function generateSeasonJSON(Season,PerMode){
  const options = {
    Season,
    PerMode
  }
  const seasonStats  = await getPlayerStats(options)
  await writeJson(`${__dirname}/data/seasons/${PerMode}/${Season}.json`,seasonStats)
  return `generated /data/seasons/${PerMode}/${Season}.json`
}

async function getSeasonInstances(Season) {
  const options = {
    Season
  }
  const stats = await getPlayerStats(options)
  const players = await Promise.all(stats.map( async (playerStats) => {
    const playerInfo = await getPlayerInfo(playerStats.playerId)
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
    const nextYearStats = await getPlayerStats( {
      PlayerID: newPlayer.playerId,
      SeasonType: SEASON_TYPE.regular,
      Season: SEASONS[SEASONS.indexOf(Season)+1]
    })
    newPlayer.outcome = calculateFantasyPointsPerGame(nextYearStats)
    return newPlayer
  }))
  return players
}

async function getSeasonInstancesStatic(Season){
  const stats  = await readJson(`${__dirname}/data/seasons/PerGame/${Season}.json`)
  const nextYearStats = await readJson(`${__dirname}/data/seasons/totals/${SEASONS[SEASONS.indexOf(Season)+1]}.json`)
  const players = stats.map( (playerStats) => {
    const playerInfo = {}//await getPlayerInfo(playerStats.playerId)
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
