const {
  pick
} = require('lodash')
const {mean,standardDeviation,zScore} = require('simple-statistics')


const BASIC = [
  'gp', 'age', 'min', 'fgm', 'fga', 'ftm', 'fta', 'reb', 'ast',
  'stl', 'blk', 'tov', 'pts'
]
const ADVANCED = [
  'teamAbbreviation', 'fG3M', 'fG3A', 'oreb', 'dreb', 'blka',
  'pf', 'pfd', 'plusMinus', 'dD2', 'tD3', 'height', 'weight', 'position',
  'draftNumber', 'school'
]

const PARSEINT_FEATURES = ['weight','draftNumber']

module.exports = {extractFeatures, normalizeData}

function extractFeatures({  data},season) {
  const rawFeatures =  {...pick(data,BASIC),season}
  return rawFeatures
}
//TODO: add when move onto advanced features
function getSeasonExp({fromYear,season}){
  return parseInt(season.substring(0,4)) - fromYear
}
//TODO: add when move onto advanced features
function convertHeightToInches(height){
  const [feet,inches] = height.split('-')
  return 12 * feet + inches
}
//TODO: add when move onto advanced features
function parseIntFeatures(data){
  PARSEINT_FEATURES.forEach(feature=>{
    data[feature] = parseInt(data[feature])
  })
  return data
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
