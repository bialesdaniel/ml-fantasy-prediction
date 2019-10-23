const {getSeasonInstances,getSeasonInstancesStatic} = require('./season')
const {writeJson} = require('fs-extra')
const {
  SEASONS,
  SEASON_TYPE,
  SEASON_SEGMENTS,
  MODES
} = require('./constants')

//getPlayerProfile({PlayerID:203999,Season:SEASONS[SEASONS.length-3]}).then(results=>console.log(Object.keys(results)))
async function run(){
  const result = await getSeasonInstances(SEASONS[0],MODES.per_game)
  await writeJson(`${__dirname}/output.json`,result)
  console.log(result)
}
run()
