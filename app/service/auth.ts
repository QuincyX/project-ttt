import { Service } from 'egg'

export default class extends Service {
  public async decodeToken(token: string) {
    const payloadString = new Buffer(token.split('.')[1], 'base64').toString()
    const payload = JSON.parse(payloadString)
    return { userId: payload.sub }
  }
  public async getDevice(ua: string) {
    if (ua.match(/(Android);?[\s\/]+([\d.]+)?/)) {
      return 'android'
    } else if (ua.match(/(iPad).*OS\s([\d_]+)/)) {
      return 'ipad'
    } else if (ua.match(/(iPhone\sOS)\s([\d_]+)/)) {
      return 'iphone'
    } else {
      return 'other'
    }
  }
}
