import { Service } from 'egg'

export default class extends Service {
  public async getMock(mockId: string) {
    const mockDoc = await this.ctx.model.Mock.findById(mockId)
    const randomIndex = Math.floor(Math.random() * mockDoc.list.length)
    return mockDoc.list[randomIndex]
  }
  public async getHeader(headerList: any[]) {
    const headerListMock = await Promise.all(
      headerList.map(async (o) => {
        return {
          name: o.name,
          value: await this.ctx.service.mock.getMock(o.mock),
        }
      })
    )
    const headerObject = {}
    headerListMock.forEach((o) => {
      headerObject[o.name] = o.value
    })
    return headerObject
  }
}
