const {ReadJson,writeFile,readdir} = require('fs-extra')
const {FEATURE_ATTRIBUTES,generateARFFObj,writeARRFFile} = require('../features/arff-conversion')

module.exports = {generateARFFFiles}

async function generateARFFFiles({dir,attributes}){
  const files = await readdir(dir)
  const instanceJSONFiles = files.filter(file=>file.match(/([a-zA-Z0-9\s_\\.\-\(\):])+(.json)$/))
  await instanceJSONFiles.forEach(async (file)=>{
    const instances = awiat readJson(`${dir}/${file}`)
    const arrfObj = generateARFFObj({relation:'players',attributes,instances})
    const arffFile = file.replace('.json','.arff')
    await writeARRFFile(`${dir}/${arffFile}`,arrfObj)
  })
}
