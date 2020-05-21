import { Service } from 'egg'

export default class extends Service {
  public async add(payload: any) {
    return await this.ctx.model.Log.create({ ...payload })
  }
}
