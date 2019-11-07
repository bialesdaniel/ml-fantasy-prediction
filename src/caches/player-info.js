const {getPlayerInfo} = require('../connections/nba')

const CACHE = {}
const MAX_CACHE_SIZE = 1000

module.exports = {lookupPlayerInfo}

async function lookupPlayerInfo(playerId){
  if(CACHE[playerId]){
    return CACHE[playerId]
  }else{
    const playerInfo = await getPlayerInfo(playerId)
    addToCache(playerId,playerInfo)
    return playerInfo
  }
}

function addToCache(playerId,playerInfo){
  CACHE[playerId]= playerInfo
  if(Object.keys(CACHE).length > MAX_CACHE_SIZE){
    const keyToDelete = Object.keys(CACHE)[0]
    delete CACHE[keyToDelete]
  }
}
