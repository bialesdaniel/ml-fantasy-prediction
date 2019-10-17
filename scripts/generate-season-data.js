const NBA = require('nba')
const {generateSeasonJSON} = require('../season')
const {
  MODES,
  SEASONS,
  SEASON_TYPE,
  SEASON_SEGMENTS,

} = require('../constants')

//getPlayerProfile({PlayerID:203999,Season:SEASONS[SEASONS.length-3]}).then(results=>console.log(Object.keys(results)))
async function run(){
  SEASONS.forEach(async (season) =>{
    const perGame = await generateSeasonJSON(season,MODES.per_game)
    console.log(perGame)
    const total = await generateSeasonJSON(season,MODES.total)
    console.log(total)
  })
}

run()
