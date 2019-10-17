const {getSeasonInstances,getSeasonInstancesStatic} = require('./season')
const {
  SEASONS,
  SEASON_TYPE,
  SEASON_SEGMENTS
} = require('./constants')

//getPlayerProfile({PlayerID:203999,Season:SEASONS[SEASONS.length-3]}).then(results=>console.log(Object.keys(results)))
async function run(){
  const result = await getSeasonInstancesStatic(SEASONS[0])
  console.log(result)
}
run()
