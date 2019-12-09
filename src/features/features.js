const {
  pick
} = require('lodash')
const {mean,standardDeviation,zScore,min,max} = require('simple-statistics')
const {PRE,POST} = require('../caches/season-split')
const {PREVIOUS_YEAR_TOTALS,CURRENT_YEAR_TOTALS,CURRENT_PREVIOUS_DIFF,CURRENT_PER_MIN} = require('../utils/constants')

const BASIC = [
  'playerName','gp', 'age', 'min', 'fgm', 'fga', 'ftm', 'fta', 'reb', 'ast',
  'stl', 'blk', 'tov', 'pts'
]
const ADVANCED = [
  'teamAbbreviation', 'fG3M', 'fG3A', 'oreb', 'dreb', 'blka',
  'pf', 'pfd', 'plusMinus', 'dD2', 'tD3', 'height', 'weight', 'position',
  'draftNumber', 'school','fgPct','fg3Pct','ftPct','wPct'
]
const SEASON_SPLIT = ['gp', 'min', 'fgm','fga','ftm', 'fta', 'reb', 'ast',
'stl', 'blk', 'tov', 'pts','fG3M', 'fG3A', 'oreb', 'dreb', 'blka',
'pf', 'pfd', 'plusMinus', 'dD2', 'tD3','fgPct','fg3Pct','ftPct','wPct']

const PARSEINT_FEATURES = ['weight','draftNumber']

module.exports = {
  extractFeatures,
  extractAdvancedFeatures,
  numericPosition,
  standardizeMissingValues,
  normalizeData,
  stringToBinaryNormalization
}

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
  const parsedPosition = parsePosition(position)
  const numSeason = numericSeasonStartingYear(season)
  const postAllStarFeatures = extractPostAllStarFeatures(data)
  const diffFeatures = extractPrePostAllStarDifferenceFeatures(data)
  const previousYear = extractPreviousSeasonTotalFeatures(data)
  const currentYearTotals = extractCurrentSeasonTotalFeatures(data)
  const seasonDiff = extractSeasonDiffFeatures(data)
  const perMin = extractPerMinFeatures(data)
  return {
    seasonExp,
    height: inches,
    position: parsedPosition,
    numPosition,
    numSeason,
    ...postAllStarFeatures,
    ...diffFeatures,
    ...stableFeatures,
    ...previousYear,
    ...currentYearTotals,
    ...seasonDiff,
    ...perMin
  }
}

function getSeasonExp({fromYear,season}){
  return numericSeasonStartingYear(season) - fromYear
}

//default to average NBA height
function convertHeightToInches(height='6-7'){
  height = height === '' ? '6-7' : height
  const [feet,inches] = height.split('-')
  return 12 * parseInt(feet) + parseInt(inches)
}

function parseIntFeatures(data){
  PARSEINT_FEATURES.forEach(feature=>{
    data[feature] = parseInt(data[feature]?data[feature]:"0")
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

function parsePosition(position){
  let posTag
  if (position === ""){
    posTag = 'unknown'
  }else if(position.includes('Guard') && position.includes('Forward')){
    posTag = 'wing'
  } else if (position.includes('Guard')){
    posTag = 'guard'
  } else{
    posTag = 'big'
  }
  return posTag
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

function extractPreviousSeasonTotalFeatures(data){
  const previousYear = {}
  const prevYearTotals = data[PREVIOUS_YEAR_TOTALS]
  SEASON_SPLIT.forEach(attr =>{
    previousYear[`${PREVIOUS_YEAR_TOTALS}_${attr}`] = prevYearTotals[attr] ? prevYearTotals[attr] : 0
  })
  previousYear[`${PREVIOUS_YEAR_TOTALS}_fppg`] = prevYearTotals.fppg
  return previousYear
}

function extractCurrentSeasonTotalFeatures(data){
  const currentYear = {}
  const currYearTotals = data[CURRENT_YEAR_TOTALS]
  SEASON_SPLIT.forEach(attr =>{
    currentYear[`${CURRENT_YEAR_TOTALS}_${attr}`] = currYearTotals[attr] ? currYearTotals[attr] : 0
  })
  currentYear[`${CURRENT_YEAR_TOTALS}_fppg`] = currYearTotals.fppg
  return currentYear
}

function extractSeasonDiffFeatures(data){
  const features = {}
  const seasonDiff = data[CURRENT_PREVIOUS_DIFF]
  SEASON_SPLIT.forEach(attr => {
    features[`${CURRENT_PREVIOUS_DIFF}_${attr}`] = seasonDiff[attr] ? seasonDiff[attr] : 0
  })
  features[`${CURRENT_PREVIOUS_DIFF}_fppg`] = seasonDiff.fppg
  return features
}

function extractPerMinFeatures(data){
  const features = {}
  const perMin = data[CURRENT_PER_MIN]
  SEASON_SPLIT.forEach(attr => {
    features[`${CURRENT_PER_MIN}_${attr}`] = perMin[attr] ? perMin[attr] : 0
  })
  features[`${CURRENT_PER_MIN}_fppg`] = perMin.fppg
  return features
}

function standardizeMissingValues(instances){
  const featuresToFix = ['school','teamAbbreviation']
  return instances.map(instance=>{
    Object.keys(instance.features).forEach(feature=>{
      if(featuresToFix.includes(feature)){
        if(instance.features[feature]===null ||
            instance.features[feature]==="" ||
            instance.features[feature]===undefined ||
            instance.features[feature]==="?" ||
            instance.features[feature]==="No College" ||
            instance.features[feature]===" "
           ){
          instance.features[feature]="None"
        }
      }
    })
    return instance
  })
}

function zScoreData(instances,attributes){
  const attributeStats = getAllAttrStats(instances,attributes)
  return instances.map(instance=>{
    attributeStats.forEach(({name,avg,stdev})=>{
      instance.features[name] = zScore(instance.features[name],avg,stdev)
    })
    return instance
  })
}

function normalizeData(instances,attributes){
  const attributeStats = getAllAttrStats(instances,attributes)
  return instances.map(instance=>{
    attributeStats.forEach(({name,minimum,maximum})=>{
      instance.features[name] = normalize({value:instance.features[name],minimum,maximum})
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
  const minimum = min(values)
  const maximum = max(values)
  return {name:attribute,avg,stdev,minimum,maximum}
}

function normalize({value,minimum,maximum}){
  return (value-minimum)/(maximum-minimum)
}

function stringToBinaryNormalization(instances){
  const stringFeatures = ['school','teamAbbreviation','season']
  let transformedInstances = instances
  const binaryFeatures = stringFeatures.map(feature=>{
    const arffBinaryFeatures = stringToBinaryFeaturesList(feature,instances)
    return arffBinaryFeatures.map(({name})=>name)
  })
  binaryFeatures.forEach((features,i)=>{
    transformedInstances = transformedInstances.map(instance=>{
      features.forEach(feature=>{
        if(feature === `"${stringFeatures[i]}=${instance.features[stringFeatures[i]]}"`){
          instance.features[feature]=1
        }else{
          instance.features[feature]=0
        }
      })
      delete instance.features[stringFeatures[i]]
      return instance
    })
  })
  return transformedInstances
}

function stringToBinaryFeaturesList(feature,instances){
  const binaryFeatureNames = new Set(instances.map(({features})=>{
    return `"${feature}=${features[feature]}"`
  }))
  return Array.from(binaryFeatureNames).map(featureName=>({name:featureName,type:'numeric'}))
}
