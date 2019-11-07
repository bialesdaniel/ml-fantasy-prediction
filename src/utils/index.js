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

const wait = ms => new Promise(r => setTimeout(r, ms));

module.exports = {calculateFantasyPoints,calculateFantasyPointsPerGame, wait}
