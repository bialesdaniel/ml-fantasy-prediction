const {getSeasonInstances,getSeasonInstancesStatic} = require('./src/generate-instances/season')
const {writeJson} = require('fs-extra')
const {
  SEASONS,
  SEASON_TYPE,
  SEASON_SEGMENTS,
  MODES
} = require('./src/utils/constants')

//getPlayerProfile({PlayerID:203999,Season:SEASONS[SEASONS.length-3]}).then(results=>console.log(Object.keys(results)))
async function run(){
  const result = await getSeasonInstances(SEASON[0],MODES.per_game)
  await writeJson(`${__dirname}/output.json`,result)
  console.log(result)
}

async function runAll(){
  const instances = []
  for (season of SEASONS){
    if(season != SEASONS[SEASONS.length-1]){
      const result = await getSeasonInstances(season,MODES.per_game)
      instances.push(...result)
    }
  }

  await writeJson(`${__dirname}/output.json`,instances)
  console.log(instances)
}
//run()
runAll()
