const {
  format
} = require('arff')
const {normalizeData} = require('./features')
const {writeFile} = require('fs-extra')
const {PREVIOUS_YEAR_TOTALS,CURRENT_YEAR_TOTALS} = require('../utils/constants')

const {
  SEASONS
} = require('../utils/constants')

const FEATURE_ATTRIBUTES = [
  {
    name: 'playerName',
    type: 'string'
  },
  {
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
const BASIC_STATS = [
  {
    name: 'gp',
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
  }
]
const ADVANCED_STATS = [
  {
    name: 'fG3M',
    type: 'numeric'
  },
  {
    name: 'fG3A',
    type: 'numeric'
  },
  {
    name: 'oreb',
    type: 'numeric'
  },
  {
    name: 'dreb',
    type: 'numeric'
  },
  {
    name: 'blka',
    type: 'numeric'
  },
  {
    name: 'pf',
    type: 'numeric'
  },
  {
    name: 'pfd',
    type: 'numeric'
  },
  {
    name: 'plusMinus',
    type: 'numeric'
  },
  {
    name: 'dD2',
    type: 'numeric'
  },
  {
    name: 'tD3',
    type: 'numeric'
  }
]
const BIO_STATS = [
  {
    name: 'playerName',
    type: 'string'
  },
  {
    name: 'age',
    type: 'numeric'
  },
  {
    name: 'height',
    type: 'numeric'
  },
  {
    name: 'weight',
    type: 'numeric'
  },
  {
    name: 'numPosition',
    type: 'numeric'
  },
  {
    name: 'season',
    type: 'enum',
    values: SEASONS
  },
  {
    name: 'numSeason',
    type: 'numeric'
  },
  {
    name: 'seasonExp',
    type: 'numeric'
  },
  {
    name: 'teamAbbreviation',
    type: 'string'
  },
  {
    name: 'school',
    type: 'string'
  },
  {
    name: 'draftNumber',
    type: 'numeric'
  }
]
const FPPG_STATS = [
  {
    name: `${CURRENT_YEAR_TOTALS}_fppg`,
    type: 'numeric'
  },
  {
    name: `${PREVIOUS_YEAR_TOTALS}_fppg`,
    type: 'numeric'
  },
]
const ADVANCED_FEATURE_ATTRIBUTES = [
  ...BIO_STATS,
  ...BASIC_STATS,
  ...ADVANCED_STATS,
  ...renameStats('post'),
  ...renameStats('pre_post_diff'),
  ...renameStats(PREVIOUS_YEAR_TOTALS),
  ...renameStats(CURRENT_YEAR_TOTALS),
  ...FPPG_STATS
]
const OUTCOME_ATTRIBUTE = {
  name:'fppg',
  type: 'numeric'
}

function renameStats(prefix){
  const allStats = [...BASIC_STATS,...ADVANCED_STATS]
  return allStats.map(feature=>{
    const prefixedFeature = Object.assign({},feature)
    prefixedFeature.name = `${prefix}_${feature.name}`
    return prefixedFeature
  })
}

function generateARFFObj({relation,attributes,instances}){
  const players = normalizeData(instances,attributes)
  const data = players.map(({playerName,features,outcome})=>({playerName,...features,fppg:outcome}))
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
