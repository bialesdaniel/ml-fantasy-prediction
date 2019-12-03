const {readJson,writeFile,readdir} = require('fs-extra')
const {FEATURE_ATTRIBUTES,generateARFFObj,writeARRFFile} = require('../features/arff-conversion')

module.exports = {generateARFFFiles}

async function generateARFFFiles({dir,attributes}){
  const files = await readdir(dir)
  const instanceJSONFiles = files.filter(file=>file.match(/([a-zA-Z0-9\s_\\.\-\(\):])+(.json)$/))
  await instanceJSONFiles.forEach(async (file)=>{
    const instances = await readJson(`${dir}/${file}`)
    const arrfObj = generateARFFObj({relation:'players',attributes:getAttributes(instances),instances})
    const arffFile = file.replace('.json','.arff')
    await writeARRFFile(`${dir}/${arffFile}`,arrfObj)
  })
}

function getAttributes(instances){
  const nonNumeric = ['playerName']
  return Object.keys(instances[0].features).map(feature=>({
    name: feature,
    type: nonNumeric.includes(feature)?'string':'numeric'
  }))
}
