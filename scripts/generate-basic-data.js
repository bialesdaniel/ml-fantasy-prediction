const {writeJson} = require('fs-extra')
const shuffle = require('shuffle-array')
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
  const mixedInstances = shuffle(allInstances)
  const devBoundry =Math.ceil(mixedInstances.length*.2)
  const xValidationBoundry = Math.ceil(mixedInstances.length*.9)
  const devInstances = mixedInstances.slice(0,devBoundry)
  const xValidationInstances = mixedInstances.slice(devBoundry,xValidationBoundry)
  const finalInstances = mixedInstances.slice(xValidationBoundry,mixedInstances.length)
  await writeJson(`${__dirname}/../instances/basic-instances-all.json`, allInstances)
  await writeJson(`${__dirname}/../instances/basic-instances-dev.json`, devInstances)
  await writeJson(`${__dirname}/../instances/basic-instances-xval.json`, xValidationInstances)
  await writeJson(`${__dirname}/../instances/basic-instances-final.json`, finalInstances)
}
run()
