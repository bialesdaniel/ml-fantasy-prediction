const {
  format
} = require('arff')
const {normalizeData} = require('./features')
const {writeFile} = require('fs-extra')

const {
  SEASONS
} = require('./constants')

const FEATURE_ATTRIBUTES = [{
    name: 'gp',
    type: 'numeric'
  },
  {
    name: 'age',
    type: 'numeric'
  },
  {
    name: 'min',
    type: 'numeric'
  },
  {
    name: 'fgm',
    type: 'numeric'
  },
  {
    name: 'fga',
    type: 'numeric'
  },
  {
    name: 'ftm',
    type: 'numeric'
  },
  {
    name: 'fta',
    type: 'numeric'
  },
  {
    name: 'reb',
    type: 'numeric'
  },
  {
    name: 'ast',
    type: 'numeric'
  },
  {
    name: 'blk',
    type: 'numeric'
  },
  {
    name: 'tov',
    type: 'numeric'
  },
  {
    name: 'pts',
    type: 'numeric'
  },
  {
    name: 'season',
    type: 'enum',
    values: SEASONS
  },
]
const OUTCOME_ATTRIBUTE = {
  name:'fppg',
  type: 'numeric'
}

function generateARFFObj({relation,attributes,instances}){
  const players = normalizeData(instances,attributes)
  const data = players.map(({features,outcome})=>({...features,fppg:outcome}))
  return {relation,attributes:[...attributes,OUTCOME_ATTRIBUTE],data}
}

async function writeARRFFile(path,arffObj){
  const fileContent = format(arffObj)
  await writeFile(path,fileContent)
}

module.exports = {FEATURE_ATTRIBUTES,generateARFFObj,writeARRFFile}
