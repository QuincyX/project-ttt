import { Service } from 'egg'

export default class extends Service {
  public async add(payload: any) {
    return await this.ctx.model.Log.create({ ...payload })
  }
  public async addHttpError(error: any, jobId: string) {
    let log = {
      job: jobId,
      type: 'error',
      belongType: 'http',
      belongTo: `${error?.config?.method} ${error?.config?.url}`,
      title: '',
      content: '',
      curl: '',
    }
    if (error.response) {
      let content = ''
      try {
        content = error.toJSON() || ''
      } catch (e) {
        content = 'http error, no detail'
      }
      log.title = error.message || error.toString()
      log.content = content
      log.curl = await this.ctx.service.log.getCurl(error)
    } else if (error.request) {
      log.title = error?.message || error?.toString()
      log.content = error?.request || 'request error'
      log.curl = await this.ctx.service.log.getCurl(error)
    } else {
      log.title = error?.message || error?.toString()
      log.content = error?.request || 'request error'
      log.curl = await this.ctx.service.log.getCurl(error)
    }
    this.ctx.service.log.add(log)
  }
  public async getCurl(error) {
    if (error) {
      const headers = error?.config?.headers || {}
      let curl = `curl -X ${error?.config?.method.toUpperCase()} `
      curl += `'${error?.config?.baseURL}${error?.config?.url}' `
      for (let i in headers) {
        if (i.toLowerCase() !== 'content-length') {
          curl += `-H '${i}: ${headers[i]}' `
        }
      }
      if (error?.config?.method === 'post' || error?.config?.method === 'put') {
        curl += `-d '${JSON.stringify(error?.config?.data)}'`
      }
      return curl
    } else {
      return ``
    }
  }
}
