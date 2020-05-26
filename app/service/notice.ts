import { Service } from 'egg'

export default class extends Service {
  public async sendError(logId: string) {
    const log = await this.ctx.model.Log.findById(logId)
    if (log.belongType === 'http') {
      this.sendHttpError(log)
    }
  }
  public async sendHttpError(log: any) {
    await this.sendDingTalk({
      title: log.title,
      content: `#### ${log.belongTo}`,
    })
    await this.sendDingTalk({
      title: 'curl 脚本',
      content: `> ` + log.curl,
    })
  }
  public async sendDingTalk(payload: any) {
    const dingTalkBot: any = await this.ctx.model.SysConfig.findOne({
      _id: 'dingTalkBot',
    })
    return this.ctx.curl(dingTalkBot.content, {
      method: 'POST',
      contentType: 'json',
      data: {
        msgtype: 'markdown',
        markdown: {
          title: 'TTT-Log',
          text: `## ${payload.title || 'Error from TTT'}\n` + payload.content,
        },
      },
      dataType: 'json',
    })
  }
}
