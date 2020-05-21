import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>

  config.keys = appInfo.name + '_1583846905801_5112'

  config.cors = {
    origin: '*',
    allowMethods: 'GET,PUT,POST,DELETE,OPTIONS,PATCH'
  }
  config.cluster = {
    listen: {
      port: 3001,
      hostname: '0.0.0.0'
    }
  }
  config.mongoose = {
    url: 'mongodb://ttt:meiyoumima@117.48.196.40:27018/ttt',
    options: {
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  }
  config.security = {
    csrf: {
      enable: false
    }
  }
  config.multipart = {
    fileSize: '50mb'
  }
  config.middleware = ['errorHandler', 'copyright']

  return {
    ...config
  }
}
