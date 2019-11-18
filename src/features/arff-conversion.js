const {
  format
} = require('arff')
const {normalizeData} = require('./features')
const {writeFile} = require('fs-extra')

const {
  SEASONS
} = require('../utils/constants')

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
    name: 'stl',
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
const ADVANCED_FEATURE_ATTRIBUTES=[
  {
    name: 'seasonExp',
    type: 'numeric'
  },
  {
    name: 'draftNumber',
    type: 'numeric'
  },
  {
    name: 'post_reb',
    type: 'numeric'
  },
  {
    name: 'post_gp',
    type: 'numeric'
  },
  {
    name: 'post_fgm',
    type: 'numeric'
  },
  {
    name: 'post_fga',
    type: 'numeric'
  },
  {
    name: 'post_ftm',
    type: 'numeric'
  },
  {
    name: 'post_fta',
    type: 'numeric'
  },
  {
    name: 'post_ast',
    type: 'numeric'
  },
  {
    name: 'post_stl',
    type: 'numeric'
  },
  {
    name: 'post_blk',
    type: 'numeric'
  },
  {
    name: 'post_tov',
    type: 'numeric'
  },
  {
    name: 'post_pts',
    type: 'numeric'
  }
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

module.exports = {
  FEATURE_ATTRIBUTES,
  ADVANCED_FEATURE_ATTRIBUTES,
  generateARFFObj,
  writeARRFFile
}
