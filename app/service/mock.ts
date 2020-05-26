import { Service } from 'egg'

export default class extends Service {
  public async getMock(mockId: string) {
    const mockDoc = await this.ctx.model.Mock.findById(mockId)
    if (mockDoc.list.length === 0) {
      this.ctx.service.log.add({
        belongType: 'sys',
        type: 'error',
        title: `${mockDoc.name} 的数据列表未定义`,
      })
      return ''
    } else if (mockDoc.list.length === 1) {
      return mockDoc.list[0]
    } else {
      const randomIndex = Math.floor(Math.random() * mockDoc.list.length)
      return mockDoc.list[randomIndex]
    }
  }
  public async getMockId({
    name,
    actionId,
    caseId,
    storyId,
    jobId,
    mockId,
  }: {
    name: string
    actionId: string
    caseId: string
    storyId: string
    jobId: string
    mockId: string
  }) {
    const actionMock: any = await this.ctx.model.Mock.findOne({
      name,
      type: 'action',
      target: actionId,
    })
    const caseMock: any = await this.ctx.model.Mock.findOne({
      name,
      type: 'case',
      target: caseId,
    })
    const storyMock: any = await this.ctx.model.Mock.findOne({
      name,
      type: 'story',
      target: storyId,
    })
    const jobMock: any = await this.ctx.model.Mock.findOne({
      name,
      type: 'job',
      target: jobId,
    })
    if (actionMock) {
      return actionMock._id
    } else if (caseMock) {
      return caseMock._id
    } else if (storyMock) {
      return storyMock._id
    } else if (jobMock) {
      return jobMock._id
    } else {
      return mockId
    }
  }
  public async getHeader(
    headerList: any[],
    actionId: string,
    caseId: string,
    storyId: string,
    jobId: string
  ) {
    const list = await Promise.all(
      headerList.map(async (o) => {
        const mockId = await this.ctx.service.mock.getMockId({
          name: o.name,
          actionId,
          caseId,
          storyId,
          jobId,
          mockId: o.mock,
        })
        return {
          name: o.name,
          value: await this.ctx.service.mock.getMock(mockId),
        }
      })
    )
    const result = {}
    list.forEach((o) => {
      result[o.name] = o.value
    })
    return result
  }
  public async getQuery(
    queryList: any[],
    actionId: string,
    caseId: string,
    storyId: string,
    jobId: string
  ) {
    const list = await Promise.all(
      queryList.map(async (o) => {
        const mockId = await this.ctx.service.mock.getMockId({
          name: o.name,
          actionId,
          caseId,
          storyId,
          jobId,
          mockId: o.mock,
        })
        return {
          name: o.name,
          value: await this.ctx.service.mock.getMock(mockId),
        }
      })
    )
    const result = {}
    list.forEach((o) => {
      result[o.name] = o.value
    })
    return result
  }
  public async getBody(
    bodyList: any[],
    actionId: string,
    caseId: string,
    storyId: string,
    jobId: string
  ) {
    if (bodyList.length === 1) {
      const mockId = await this.ctx.service.mock.getMockId({
        name: bodyList[0].name,
        actionId,
        caseId,
        storyId,
        jobId,
        mockId: bodyList[0].mock,
      })
      return await this.ctx.service.mock.getMock(mockId)
    } else {
      const list = await Promise.all(
        bodyList.map(async (o) => {
          const mockId = await this.ctx.service.mock.getMockId({
            name: o.name,
            actionId,
            caseId,
            storyId,
            jobId,
            mockId: o.mock,
          })
          return {
            name: o.name,
            value: await this.ctx.service.mock.getMock(mockId),
          }
        })
      )
      const result = {}
      list.forEach((o) => {
        result[o.name] = o.value
      })
      return result
    }
  }
  public async getPath(
    sourceUrl: string,
    pathList: any[],
    actionId: string,
    caseId: string,
    storyId: string,
    jobId: string
  ) {
    const list = await Promise.all(
      pathList.map(async (o) => {
        const mockId = await this.ctx.service.mock.getMockId({
          name: o.name,
          actionId,
          caseId,
          storyId,
          jobId,
          mockId: o.mock,
        })

        return {
          name: o.name,
          value: await this.ctx.service.mock.getMock(mockId),
        }
      })
    )
    list.forEach((o) => {
      sourceUrl = sourceUrl.replace(`{${o.name}}`, o.value)
    })
    return sourceUrl
  }
}
