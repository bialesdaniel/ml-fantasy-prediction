const {readJson,writeJson} = require('fs-extra')
const {getAllSeasonsInstances} = require('../../src/generate-instances/season')
const {getInstanceSets,distributeInstancesByPreviousFile} = require('../../src/generate-instances/sets')
const {MODES} = require('../../src/utils/constants')

async function run(){
  const instances = await getAllSeasonsInstances(MODES.per_game)
  await writeJson(`${__dirname}/../../instances/advanced/advanced-instances-all.json`, instances)
  //const instances = await readJson(`${__dirname}/../../instances/advanced/advanced-instances-all.json`)
  const {
    developmentInstances,
    crossValidationInstances,
    finalInstances
  } = await distributeInstancesByPreviousFile({
    dir: `${__dirname}/../../instances/advanced`,
    devFile: 'advanced-instances-dev.json',
    cvFile: 'advanced-instances-xval.json',
    finalFile: 'advanced-instances-final.json'
  },instances)//getInstanceSets(instances) // this is for befoore the baseline has been created
  await writeJson(`${__dirname}/../../instances/advanced/advanced-instances-dev.json`, developmentInstances)
  await writeJson(`${__dirname}/../../instances/advanced/advanced-instances-xval.json`, crossValidationInstances)
  await writeJson(`${__dirname}/../../instances/advanced/advanced-instances-final.json`, finalInstances)
}
run()
