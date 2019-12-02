const {readJson} = require('fs-extra')

async function run(){
  const instances = await readJson(__dirname+'/instances/advanced/advanced-instances-all.json')
  instances.forEach(instance=>{
    if(Object.keys(instance.features).includes('school')){

    }else{
      console.log(instance.playerName)
    }
  })
}
run()
