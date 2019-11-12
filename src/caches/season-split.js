const {getPlayerStats} = require('../connections/nba')
const {
  SEASON_TYPE,
  MODES,
  SEASON_SEGMENTS
} = require('../utils/constants')
const CACHE = {}
const MAX_CACHE_SIZE = 1
const PRE = "preAllStar"
const POST = "postAllStar"

module.exports = {lookupSeasonSplit,PRE,POST}

async function lookupSeasonSplit(Season,playerId){
  if(CACHE[Season]){
    return findInCache(Season,playerId)
  }else {
    const [pre,post] = await Promise.all([
      getPlayerStats({PerMode: MODES.per_game,SeasonType: SEASON_TYPE.regular, SeasonSegment: SEASON_SEGMENTS.pre_allstar,Season}),
      getPlayerStats({PerMode: MODES.per_game,SeasonType: SEASON_TYPE.regular,SeasonSegment: SEASON_SEGMENTS.post_allstar,Season})
    ])
    addToCache(Season,PRE,pre)
    addToCache(Season,POST,post)
    return lookupSeasonSplit(Season,playerId)
  }
}

function findInCache(season,playerId){
  let seasonSplits = undefined
  CACHE[season][PRE] = CACHE[season][PRE].filter((player)=>{
    if(player.playerId === playerId){
      if(seasonSplits === undefined){
        seasonSplits = {}
      }
      seasonSplits[PRE] = player
      return false
    }else{
      return true
    }
  })
  CACHE[season][POST] = CACHE[season][POST].filter((player)=>{
    if(player.playerId === playerId){
      if(seasonSplits === undefined){
        seasonSplits = {}
      }
      seasonSplits[POST] = player
      return false
    }else{
      return true
    }
  })
  return seasonSplits
}

function addToCache(season,seasonSegment,stats){
  if(!CACHE[season]){
    CACHE[season]={}
  }
  CACHE[season][seasonSegment] = stats
  if(Object.keys(CACHE).length > MAX_CACHE_SIZE){
    const keyToDelete = Object.keys(CACHE)[0]
    delete CACHE[keyToDelete]
  }
}
