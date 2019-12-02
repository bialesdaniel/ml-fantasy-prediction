const shuffle = require('shuffle-array')
const {readJson} = require('fs-extra')

module.exports = {getInstanceSets,distributeInstancesByPreviousFile}

function getInstanceSets(instances) {
  const shuffledInstances = shuffle(instances)
  const {
    development: devBoundry,
    crossValidation: cvBoundry,
    final: finalBoundry
  } = getSetBoundries(instances)
  const developmentInstances = shuffledInstances.slice(0, devBoundry)
  const crossValidationInstances = shuffledInstances.slice(devBoundry, cvBoundry)
  const finalInstances = shuffledInstances.slice(cvBoundry, finalBoundry)
  return {
    developmentInstances,
    crossValidationInstances,
    finalInstances
  }
}

async function distributeInstancesByPreviousFile(files,instances){
  const {dir, devFile, cvFile, finalFile} = files
  const devSet = await readJson(`${dir}/${devFile}`)
  const cvSet = await readJson(`${dir}/${cvFile}`)
  const finalSet = await readJson(`${dir}/${finalFile}`)
  const developmentInstances = []
  const crossValidationInstances = []
  const finalInstances = []
  instances.forEach((player)=>{
    if(devSet.some(isPlayerInSet(player.playerId,player.features.season))){
      developmentInstances.push(player)
    }else if(cvSet.some(isPlayerInSet(player.playerId,player.features.season))){
      crossValidationInstances.push(player)
    }else if(finalSet.some(isPlayerInSet(player.playerId,player.features.season))){
      finalInstances.push(player)
    }else{
      throw new Error(`player: ${player.playerName} does not exist in any set`)
    }
  })
  return {
    developmentInstances,
    crossValidationInstances,
    finalInstances
  }
}

function isPlayerInSet(playerId, season){
  return (cplayer)=> {
    return cplayer.playerId === playerId && cplayer.features.season === season
  }
}

/* 20% dev, 70% CV, 10% final */
function getSetBoundries(instances) {
  const development = Math.ceil(instances.length * .2)
  const crossValidation = Math.ceil(instances.length * .9)
  const final = instances.length
  return {
    development,
    crossValidation,
    final
  }
}
