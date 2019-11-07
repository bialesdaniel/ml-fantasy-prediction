const Progress = require('progress')

class ProgressBar {
  constructor({title,total}){
    this.bar = new Progress(`  ${title} [:bar] :current/:total :percent :rate/pps estimated: :etas actual: :elapseds  `,{total})
  }
  tick = ()=>{
    this.bar.tick()
  }
}

module.exports = ProgressBar
