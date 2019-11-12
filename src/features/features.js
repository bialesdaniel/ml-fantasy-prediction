const {
  pick
} = require('lodash')
const {mean,standardDeviation,zScore} = require('simple-statistics')
const {PRE,POST} = require('../caches/season-split')

const BASIC = [
  'gp', 'age', 'min', 'fgm', 'fga', 'ftm', 'fta', 'reb', 'ast',
  'stl', 'blk', 'tov', 'pts'
]
const ADVANCED = [
  'teamAbbreviation', 'fG3M', 'fG3A', 'oreb', 'dreb', 'blka',
  'pf', 'pfd', 'plusMinus', 'dD2', 'tD3', 'height', 'weight', 'position',
  'draftNumber', 'school'
]
const SEASON_SPLIT = ['gp', 'fgm','fga','ftm', 'fta', 'reb', 'ast',
'stl', 'blk', 'tov', 'pts','fG3M', 'fG3A', 'oreb', 'dreb', 'blka',
'pf', 'pfd', 'plusMinus', 'dD2', 'tD3']

const PARSEINT_FEATURES = ['weight','draftNumber']

module.exports = {extractFeatures, extractAdvancedFeatures, numericPosition, normalizeData}

function extractFeatures({ data},season) {
  const rawFeatures =  {...pick(data,BASIC),season}
  return rawFeatures
}

function extractAdvancedFeatures({data},season){
  const rawFeatures = {...pick(data,ADVANCED)}
  const {fromYear} = data
  const {position,height,...otherFeatures} = rawFeatures
  const seasonExp = getSeasonExp({fromYear,season})
  const inches = convertHeightToInches(height)
  const stableFeatures = parseIntFeatures(otherFeatures)
  const numPosition = numericPosition(position)
  const numSeason = numericSeasonStartingYear(season)
  const postAllStarFeatures = extractPostAllStarFeatures(data)
  const diffFeatures = extractPrePostAllStarDifferenceFeatures(data)
  return {
    seasonExp,
    height: inches,
    numPosition,
    numSeason,
    ...postAllStarFeatures,
    ...diffFeatures,
    ...stableFeatures
  }
}

function getSeasonExp({fromYear,season}){
  return numericSeasonStartingYear(season) - fromYear
}

function convertHeightToInches(height){
  const [feet,inches] = height.split('-')
  return 12 * parseInt(feet) + parseInt(inches)
}

function parseIntFeatures(data){
  PARSEINT_FEATURES.forEach(feature=>{
    data[feature] = parseInt(data[feature])
  })
  return data
}

function numericPosition(pos){
  let posNum = 0
  switch(pos){
    case 'Guard':
      posNum = 1
      break
    case 'Guard-Forward':
      posNum = 2
      break
    case 'Forward-Guard':
      posNum = 3
      break
    case 'Forward':
      posNum = 4
      break
    case 'Forward-Center':
      posNum = 5
      break
    case 'Center-Forward':
      posNum = 6
      break
    case 'Center':
      posNum = 7
      break
    default:
      posNum = 0
  }
  return posNum
}

function numericSeasonStartingYear(season){
  return parseInt(season.substring(0,4))
}

function extractPostAllStarFeatures(data){
  const postFeatures ={}
  const postAllStar = data[POST]
  SEASON_SPLIT.forEach(attr=>postFeatures[`post_${attr}`] = postAllStar ? postAllStar[attr] : 0)
  return postFeatures
}

function extractPrePostAllStarDifferenceFeatures(data){
  const diffFeatures = {}
  const preAllStar = data[PRE]
  const postAllStar = data[POST]
  SEASON_SPLIT.forEach(attr=>{
    const postStat = postAllStar ? postAllStar[attr] : 0
    const preStat = preAllStar ? preAllStar[attr] : 0
    diffFeatures[`pre_post_diff_${attr}`] = (postStat *1000 - preStat *1000)/1000
  })
  return diffFeatures
}

function normalizeData(instances,attributes){
  const attributeStats = getAllAttrStats(instances,attributes)
  return instances.map(instance=>{
    attributeStats.forEach(({name,avg,stdev})=>{
      instance.features[name] = zScore(instance.features[name],avg,stdev)
    })
    return instance
  })
}

function getAllAttrStats(instances,attributes){
  const stats = attributes.map(attr=> attr.type === 'numeric' ? calculateStatsForAttr(instances,attr.name) : null)
  return stats.filter(stat=>stat!==null)
}

function calculateStatsForAttr(instances, attribute) {
  const values = instances.map(({features})=>features[attribute])
  const avg = mean(values)
  const stdev = standardDeviation(values)
  return {name:attribute,avg,stdev}
}
