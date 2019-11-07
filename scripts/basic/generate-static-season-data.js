const {generateSeasonJSON} = require('../../src/generate-instances/season')
const {
  MODES,
  SEASONS,
  SEASON_TYPE,
  SEASON_SEGMENTS,

} = require('../../src/utils/constants')

async function run(){
  SEASONS.forEach(async (season) =>{
    const perGame = await generateSeasonJSON(season,MODES.per_game)
    console.log(perGame)
    const total = await generateSeasonJSON(season,MODES.total)
    console.log(total)
  })
}

run()
