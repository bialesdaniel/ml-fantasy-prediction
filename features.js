const {
  pick
} = require('lodash')

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

module.exports = {extractFeatures}

function extractFeatures({
  data
},season) {
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
