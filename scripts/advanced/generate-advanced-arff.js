const {FEATURE_ATTRIBUTES,ADVANCED_FEATURE_ATTRIBUTES} = require('../../src/features/arff-conversion')
const {generateARFFFiles} = require('../../src/generate-instances/arff-files')

async function run(){
  await generateARFFFiles({dir:`${__dirname}/../../instances/advanced`,attributes:[...FEATURE_ATTRIBUTES,...ADVANCED_FEATURE_ATTRIBUTES]})
}
run()
