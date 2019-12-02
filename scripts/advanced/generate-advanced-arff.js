const {FEATURE_ATTRIBUTES,ADVANCED_FEATURE_ATTRIBUTES} = require('../../src/features/arff-conversion')
const {generateARFFFiles} = require('../../src/generate-instances/arff-files')
const {renameStats} = require('../../src/features/arff-conversion')


async function run(){
  await generateARFFFiles({dir:`${__dirname}/../../instances/advanced`,attributes:[...ADVANCED_FEATURE_ATTRIBUTES]})
}
run()
