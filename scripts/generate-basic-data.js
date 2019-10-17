const {writeJson} = require('fs-extra')
const {getSeasonInstances,getSeasonInstancesStatic} = require('../season')
const {
  SEASONS,
  SEASON_TYPE,
  SEASON_SEGMENTS
} = require('../constants')

//getPlayerProfile({PlayerID:203999,Season:SEASONS[SEASONS.length-3]}).then(results=>console.log(Object.keys(results)))
async function run(){
  const allInstances = await SEASONS.reduce(async(promise, season)=>{
    const instances = await promise
    const seasonStats = season != SEASONS[SEASONS.length-1] ?
      await getSeasonInstancesStatic(season) :[]
    return [...instances,...seasonStats]
  },Promise.resolve([]))
  await writeJson(`${__dirname}/../instances/basic-instances.json`, allInstances)
}
run()
