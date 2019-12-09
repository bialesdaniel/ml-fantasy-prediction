const {
  format
} = require('arff')
const {standardizeMissingValues} = require('./features')
const {writeFile} = require('fs-extra')
const {PREVIOUS_YEAR_TOTALS,CURRENT_YEAR_TOTALS, CURRENT_PREVIOUS_DIFF,CURRENT_PER_MIN,FPPG_BUCKETS,POSITIONS} = require('../utils/constants')

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
  },
  {
    name:'fgPct',
    type: 'numeric'
  },
  {
    name: 'fg3Pct',
    type: 'numeric'
  },
  {
    name:'ftPct',
    type: 'numeric'
  },
  {
    name: 'wPct',
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
    name: 'position',
    enum: 'enum',
    values: ['unknown','wing','guard','big']
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
  {
    name: `${CURRENT_PREVIOUS_DIFF}_fppg`,
    type: 'numeric'
  },
  {
    name: `${CURRENT_PER_MIN}_fppg`,
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
  ...renameStats(CURRENT_PREVIOUS_DIFF),
  ...renameStats(CURRENT_PER_MIN),
  ...FPPG_STATS
]
const OUTCOME_ATTRIBUTE = {
  name:'fppg',
  type: 'numeric'
}
const BUCKET_ATTRIBUTE = {
  name: 'fppg_bucket',
  type: 'enum',
  values: FPPG_BUCKETS
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
  const data = instances.map(({playerName,features,outcome,bucket})=>({playerName,...features,fppg:outcome,fppg_bucket:bucket}))
  return {relation,attributes:[...attributes,OUTCOME_ATTRIBUTE,BUCKET_ATTRIBUTE],data}
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
