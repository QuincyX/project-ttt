import { Service } from 'egg'

export default class extends Service {
  public async getMock(mockId: string) {
    const mockDoc = await this.ctx.model.Mock.findById(mockId)
    const randomIndex = Math.floor(Math.random() * mockDoc.list.length)
    return mockDoc.list[randomIndex]
  }
  public async getHeader(headerList: any[]) {
    const list = await Promise.all(
      headerList.map(async (o) => {
        return {
          name: o.name,
          value: await this.ctx.service.mock.getMock(o.mock),
        }
      })
    )
    const result = {}
    list.forEach((o) => {
      result[o.name] = o.value
    })
    return result
  }
  public async getQuery(queryList: any[]) {
    const list = await Promise.all(
      queryList.map(async (o) => {
        return {
          name: o.name,
          value: await this.ctx.service.mock.getMock(o.mock),
        }
      })
    )
    const result = {}
    list.forEach((o) => {
      result[o.name] = o.value
    })
    return result
  }
  public async getBody(bodyList: any[]) {
    const list = await Promise.all(
      bodyList.map(async (o) => {
        return {
          name: o.name,
          value: await this.ctx.service.mock.getMock(o.mock),
        }
      })
    )
    const result = {}
    list.forEach((o) => {
      result[o.name] = o.value
    })
    return result
  }
  public async getPath(sourceUrl: string, pathList: any[]) {
    const list = await Promise.all(
      pathList.map(async (o) => {
        return {
          name: o.name,
          value: await this.ctx.service.mock.getMock(o.mock),
        }
      })
    )
    list.forEach((o) => {
      sourceUrl = sourceUrl.replace(`{${o.name}}`, o.value)
    })
    return sourceUrl
  }
}
