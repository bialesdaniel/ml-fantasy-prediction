const ATTRIBUTES = ['gp','fgm','fga','fG3M','fG3A','ftm','fta','','reb','ast','stl','tov','blk']
const SEASON_SEGMENTS = {pre_allstar: "Pre All-Star",post_allstar:"Post All-Star",entire_season:"Entire Season"}
const SEASONS = ['2009-10','2010-11','2011-12','2012-13','2013-14','2014-15','2015-16','2016-17','2017-18','2018-19']
const MODES = {
  total: 'Totals',
  per_game: 'PerGame',
  per_100: 'Per100Possessions'
}
const SEASON_TYPE = {regular: 'Regular Season'}
const PREVIOUS_YEAR_TOTALS = 'prev_tot'
const CURRENT_YEAR_TOTALS = 'curr_tot'
module.exports = {ATTRIBUTES,MODES,SEASON_SEGMENTS,SEASONS,SEASON_TYPE,PREVIOUS_YEAR_TOTALS,CURRENT_YEAR_TOTALS}
