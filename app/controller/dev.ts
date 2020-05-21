import { Controller } from 'egg'

export default class extends Controller {
  public async ping() {
    this.ctx.helper.success('ok')
  }
}
