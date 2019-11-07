const shuffle = require('shuffle-array')

module.exports = {getInstanceSets}

function getInstanceSets(instances) {
  const shuffledInstances = shuffle(instances)
  const {
    development: devBoundry,
    crossValidation: cvBoundry,
    final: finalBoundry
  } = getSetBoundries(instances)
  const developmentInstances = shuffledInstances.slice(0, devBoundry)
  const crossValidationInstances = shuffledInstances.slice(devBoundry, cvBoundry)
  const finalInstances = shuffledInstances.slide(cvBoundry, finalBoundry)
  return {
    developmentInstances,
    crossValidationInstances,
    finalInstances
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
