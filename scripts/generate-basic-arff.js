const {readJson,writeFile,readdir} = require('fs-extra')
const {FEATURE_ATTRIBUTES,generateARFFObj,writeARRFFile} = require('../arff-conversion')

async function run(){
  const files = await readdir(`${__dirname}/../instances`)
  const instanceJSONFiles = files.filter(file=>file.match(/([a-zA-Z0-9\s_\\.\-\(\):])+(.json)$/))
  await instanceJSONFiles.forEach(async (file)=>{
    const instances = await readJson(`${__dirname}/../instances/${file}`)
    const arrfObj = generateARFFObj({relation:'players',attributes:FEATURE_ATTRIBUTES,instances})
    file = file.replace('.json','.arff')
    await writeARRFFile(`${__dirname}/../instances/${file}`,arrfObj)
  })

}
run()
