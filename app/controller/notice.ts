import baseController from '../base/controller'

export default class extends baseController {
  constructor(app) {
    super(app)
    this.model = this.ctx.model['SysConfig']
  }

  public async sendError() {
    const payload = this.ctx.request.body
    await this.service.notice.sendError(payload.log)
    this.success('发送成功')
  }
}
