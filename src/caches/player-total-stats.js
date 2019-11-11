const {getPlayerStats} = require('../connections/nba')
const {
  SEASON_TYPE,
  MODES
} = require('../utils/constants')

const CACHE = {}
const MAX_CACHE_SIZE = 2

module.exports = {lookupPlayerStats}

async function lookupPlayerStats(Season,playerId){
  if(CACHE[Season]){
    //return CACHE[Season].find(player=>player.playerId === playerId)
    return findInCache(Season,playerId)
  }else {
    const leagueStats = await getPlayerStats({
      PerMode: MODES.total,
      SeasonType: SEASON_TYPE.regular,
      Season
    })
    addToCache(Season,leagueStats)
    return lookupPlayerStats(Season,playerId)
  }
}
//This was added to make searching the cache faster for later items
function findInCache(Season,playerId){
  let playerStats = undefined
  CACHE[Season] = CACHE[Season].filter((player)=>{
    if(player.playerId === playerId){
      playerStats = player
      return false
    }else{
      return true
    }
  })
  return playerStats
}

function addToCache(Season,leagueStats){
  CACHE[Season]= leagueStats
  if(Object.keys(CACHE).length > MAX_CACHE_SIZE){
    const keyToDelete = Object.keys(CACHE)[0]
    delete CACHE[keyToDelete]
  }
}
