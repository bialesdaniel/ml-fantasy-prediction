const {FEATURE_ATTRIBUTES} = require('../../src/features/arff-conversion')
const {generateARFFFiles} = require('../../src/generate-instances/arff-files')

async function run(){
  await generateARFFFiles({dir:`${__dirname}/../../instances/basic`,attributes:FEATURE_ATTRIBUTES})
}
run()
