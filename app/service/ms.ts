import { Service } from 'egg'

export default class extends Service {
  public async getServiceStatus(serviceName: string) {
    const result = await this.app.curl(`http://api.besmile.me/${serviceName}/`)
    return result.status === 401 || result.status === 200
  }
}
