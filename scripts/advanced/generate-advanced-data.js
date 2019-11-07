const {writeJson} = require('fs-extra')
const {getAllSeasonsInstances} = require('../../src/generate-instances/season')
const {getInstanceSets} = require('../../src/generate-instances/sets')
const {MODES} = require('../../src/')

async function run(){
  const instances = await getAllSeasonsInstances(MODES.per_game)
  const {
    developmentInstances,
    crossValidationInstances,
    finalInstances
  } = getInstanceSets(instances)
  await writeJson(`${__dirname}/../../instances/basic/advanced-instances-all.json`, instances)
  await writeJson(`${__dirname}/../../instances/basic/advanced-instances-dev.json`, developmentInstances)
  await writeJson(`${__dirname}/../../instances/basic/advanced-instances-xval.json`, crossValidationInstances)
  await writeJson(`${__dirname}/../../instances/basic/advanced-instances-final.json`, finalInstances)
}
run()
