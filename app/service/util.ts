import { Service } from 'egg'

export default class extends Service {
  public formatTime(timestamp: any) {
    let s = Math.floor(timestamp / 1000) || 1
    let m = 1
    if (s < 60) {
      return `${s}秒`
    } else {
      m = Math.floor(s / 60) || 1
      s = s - m * 60
      return `${m}分 ${s}秒`
    }
  }
}
