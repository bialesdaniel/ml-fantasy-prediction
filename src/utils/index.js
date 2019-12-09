const {FPPG_BUCKETS} = require('./constants')

function calculateFantasyPoints(data){
  if(!data) return 0
  const {fgm,fga,ftm,fta,reb,ast,stl,blk,tov,pts} = data
  return fgm - fga + ftm - fta + reb + ast + stl + blk - tov + pts
}

function calculateFantasyPointsPerGame(data){
  if(!data) return 0
  const {gp} = data
  return gp > 0 ? Math.round((calculateFantasyPoints(data) / gp)*10)/10 : 0
}

function getFantasyPointsPerGameBucket(fppg){
  let bucket = FPPG_BUCKETS[0]
  if(fppg>=10&&fppg<13){
    bucket = FPPG_BUCKETS[1]
  } else if (fppg >= 13 && fppg < 16){
    bucket = FPPG_BUCKETS[2]
  } else if (fppg >=16 && fppg < 18){
    bucket = FPPG_BUCKETS[3]
  } else if (fppg >= 18 && fppg < 21){
    bucket = FPPG_BUCKETS[4]
  } else if (fppg >= 21 && fppg < 25){
    bucket = FPPG_BUCKETS[5]
  }else if (fppg >= 25){
    bucket = FPPG_BUCKETS[6]
  }
  return bucket
}

const wait = ms => new Promise(r => setTimeout(r, ms));

module.exports = {calculateFantasyPoints,calculateFantasyPointsPerGame, wait,getFantasyPointsPerGameBucket}
