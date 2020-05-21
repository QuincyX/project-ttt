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
          title: '找不到story',
        })
        reject('找不到story')
      }
      if (!story.caseList.length) {
        this.ctx.service.log.add({
          job: jobId,
          belongType: 'story',
          belongTo: storyId,
          type: 'error',
          title: 'caseList 为空',
        })
        reject('caseList 为空')
      }
      this.ctx.service.log.add({
        job: jobId,
        belongType: 'story',
        belongTo: storyId,
        type: 'success',
        title: '开始讲故事',
      })
      await this.ctx.service.job.triggerCaseList(story.caseList, jobId)
      this.ctx.service.log.add({
        job: jobId,
        belongType: 'story',
        belongTo: storyId,
        type: 'success',
        title: '故事讲完了',
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
      title: '开始执行 case',
    })
    await this.ctx.service.job.triggerActionList(caseDoc.actionList, jobId)
    this.ctx.service.log.add({
      job: jobId,
      belongType: 'case',
      belongTo: caseDoc._id,
      type: 'success',
      title: '执行完成 case',
    })
    return
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
      title: '开始执行 action',
    })
    const result = await this.ctx.service.http
      .axios({
        method: apiDoc.method,
        url: `http://${projectDoc.host}${apiDoc.url}`,
        headers,
      })
      .then((response) => {
        this.ctx.service.log.add({
          job: jobId,
          belongType: 'http',
          belongTo: `${response.config.method} ${response.config.url}`,
          type: 'success',
          title: `status: ${response.status}`,
          content: JSON.stringify(response.data).substring(0, 300),
        })
        return this.ctx.service.job.validateRuleList(actionDoc, response, jobId)
      })
      .then(() => {
        this.ctx.service.log.add({
          job: jobId,
          belongType: 'action',
          belongTo: actionDoc._id,
          type: 'success',
          title: '执行完成 action',
        })
      })
      .catch((error) => {
        this.ctx.service.log.add({
          job: jobId,
          belongType: 'http',
          type: 'error',
          title: `${error.config.method} ${error.config.url}`,
          content: error.toJSON(),
        })
      })

    return result
  }
  public async validateRuleList(action: any, response: any, jobId: string) {
    this.ctx.service.log.add({
      job: jobId,
      belongType: 'action',
      belongTo: action._id,
      type: 'success',
      title: '开始执行 action rule validate',
    })
    let res: Array<any> = []
    for (let o of action.rule) {
      let data: any = await this.ctx.service.job.validateRule(
        o,
        action,
        response,
        jobId
      )
      res.push(data)
    }
    return await res
  }
  public async validateRule(
    rule: any,
    action: any,
    response: any,
    jobId: string
  ) {
    const ruleDoc = await this.ctx.model.Rule.findById(rule.rule)
    if (ruleDoc.type === '相等') {
      const targetValue = this.ctx.service.job.getResponseValue(
        response,
        rule.name,
        action._id,
        jobId
      )
      if (targetValue != ruleDoc.standard) {
        this.ctx.service.log.add({
          job: jobId,
          belongType: 'action',
          belongTo: action._id,
          type: 'error',
          title: 'action rule validate error',
          content: `${rule.name} 与 ${ruleDoc.standard} 对比不相等`,
        })
      }
    }
    return
  }
  public getResponseValue(
    response: any,
    keyName: string,
    actionId: string,
    jobId: string
  ) {
    let keywordArray = keyName.split('.')
    let result = response
    keywordArray.forEach((o) => {
      result = result[o]
      if (typeof result === 'undefined') {
        this.ctx.service.log.add({
          job: jobId,
          belongType: 'rule',
          belongTo: actionId,
          type: 'error',
          title: 'action rule validate error',
          content: `${result} 值不存在`,
        })
      }
    })
    return result
  }
}
