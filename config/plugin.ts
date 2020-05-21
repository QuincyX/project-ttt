import { EggPlugin } from 'egg'

const plugin: EggPlugin = {
  routerPlus: {
    enable: true,
    package: 'egg-router-plus'
  },
  cors: {
    enable: true,
    package: 'egg-cors'
  },
  validate: {
    enable: true,
    package: 'egg-validate'
  },
  mongoose: {
    enable: true,
    package: 'egg-mongoose'
  }
}

export default plugin
