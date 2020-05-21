import { Service } from 'egg'
import Axios, { AxiosInstance } from 'axios'

export default class extends Service {
  axios: AxiosInstance = Axios.create()

  public async triggerStory(storyId: string, jobId: string) {
    return new Promise(async (resolve, reject) => {
      const story = await this.ctx.model.Story.findById(storyId)
      if (!story) {
        this.ctx.service.log.add({
          job: jobId,
          belongType: 'story',
          belongTo: storyId,
          type: 'error',
          content: '找不到story',
        })
        reject('找不到story')
      }
      if (!story.caseList.length) {
        this.ctx.service.log.add({
          job: jobId,
          belongType: 'story',
          belongTo: storyId,
          type: 'error',
          content: 'caseList 为空',
        })
        reject('caseList 为空')
      }
      this.ctx.service.log.add({
        job: jobId,
        belongType: 'story',
        belongTo: storyId,
        type: 'success',
        content: '开始讲故事',
      })
      await this.ctx.service.job.triggerCaseList(story.caseList, jobId)
      this.ctx.service.log.add({
        job: jobId,
        belongType: 'story',
        belongTo: storyId,
        type: 'success',
        content: '故事讲完了',
      })
      resolve()
    })
  }
  public async triggerCaseList(caseList: string[], jobId: string) {
    let res: Array<any> = []
    for (let o of caseList) {
      let data: any = await this.ctx.service.job.triggerCase(o, jobId)
      res.push(data)
    }
    return await res
  }
  public async triggerCase(caseId: string, jobId: string) {
    const caseDoc = await this.ctx.model.Case.findById(caseId)
    this.ctx.service.log.add({
      job: jobId,
      belongType: 'case',
      belongTo: caseDoc._id,
      type: 'success',
      content: '开始执行 case',
    })
    return await this.ctx.service.job.triggerActionList(
      caseDoc.actionList,
      jobId
    )
  }
  public async triggerActionList(actionList: string[], jobId: string) {
    let res: Array<any> = []
    for (let o of actionList) {
      let data: any = await this.ctx.service.job.triggerAction(o, jobId)
      res.push(data)
    }
    return await res
  }
  public async triggerAction(actionId: string, jobId: string) {
    const actionDoc = await this.ctx.model.Action.findById(actionId)
    const apiDoc = await this.ctx.model.ApiItem.findById(actionDoc.api)
    const projectDoc = await this.ctx.model.Project.findById(apiDoc.project)
    const headers = await this.ctx.service.mock.getHeader(actionDoc.header)

    this.ctx.service.log.add({
      job: jobId,
      belongType: 'action',
      belongTo: actionDoc._id,
      type: 'success',
      content: '开始执行 action',
    })
    return await this.ctx.service.http.axios({
      method: apiDoc.method,
      url: `http://${projectDoc.host}${apiDoc.url}`,
      headers,
    })
  }
}
