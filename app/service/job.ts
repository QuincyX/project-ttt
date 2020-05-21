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
    let awaitList: Array<any> = []
    for (let o of caseList) {
      let data: any = await this.ctx.service.job.triggerCase(o, jobId)
      awaitList.push(data)
    }
    return awaitList
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
    let awaitList: Array<any> = []
    for (let o of actionList) {
      let data: any = await this.ctx.service.job.triggerAction(o, jobId)
      awaitList.push(data)
    }
    return awaitList
  }
  public async triggerAction(actionId: string, jobId: string) {
    const actionDoc = await this.ctx.model.Action.findById(actionId)
    const apiDoc = await this.ctx.model.ApiItem.findById(actionDoc.api)
    const projectDoc = await this.ctx.model.Project.findById(apiDoc.project)
    const headers = await this.ctx.service.mock.getHeader(actionDoc.header)
    const query = await this.ctx.service.mock.getQuery(actionDoc.query)
    const body = await this.ctx.service.mock.getBody(actionDoc.body)
    const path = await this.ctx.service.mock.getPath(apiDoc.url, actionDoc.path)

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
        baseURL: `http://${projectDoc.host}`,
        url: path,
        headers,
        params: query,
        data: body,
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
        return
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
    let awaitList: Array<any> = []
    for (let o of action.rule) {
      let data: any = await this.ctx.service.job.validateRule(
        o,
        action,
        response,
        jobId
      )
      awaitList.push(data)
    }
    return awaitList
  }
  public async validateRule(
    rule: any,
    action: any,
    response: any,
    jobId: string
  ) {
    const ruleDoc = await this.ctx.model.Rule.findById(rule.rule)
    const targetValue = this.ctx.service.job.getResponseValue(
      response,
      rule.name
    )
    if (ruleDoc.type === '相等') {
      if (targetValue != ruleDoc.standard) {
        this.ctx.service.log.add({
          job: jobId,
          belongType: 'action',
          belongTo: action._id,
          type: 'error',
          title: `validate ${rule.name} 相等`,
          content: `${rule.name} 的值 ${targetValue} 与 ${ruleDoc.standard} 对比不相等`,
        })
      }
    } else if (ruleDoc.type === '存在') {
      if (typeof targetValue === 'undefined') {
        this.ctx.service.log.add({
          job: jobId,
          belongType: 'action',
          belongTo: action._id,
          type: 'error',
          title: `validate ${rule.name} 存在`,
          content: `${targetValue} 值不存在`,
        })
      }
    } else if (ruleDoc.type === '包含') {
      if (!targetValue.includes(ruleDoc.standard)) {
        this.ctx.service.log.add({
          job: jobId,
          belongType: 'action',
          belongTo: action._id,
          type: 'error',
          title: `validate ${rule.name} 包含`,
          content: `${rule.name} 的值 ${targetValue} 不包含 ${ruleDoc.standard}`,
        })
      }
    } else if (ruleDoc.type === '属于') {
      if (!ruleDoc.standard.includes(targetValue)) {
        this.ctx.service.log.add({
          job: jobId,
          belongType: 'action',
          belongTo: action._id,
          type: 'error',
          title: `validate ${rule.name} 属于`,
          content: `${rule.name} 的值 ${targetValue} 不属于 ${ruleDoc.standard}`,
        })
      }
    } else if (ruleDoc.type === '长度大于') {
      if (targetValue.length <= ruleDoc.standard) {
        this.ctx.service.log.add({
          job: jobId,
          belongType: 'action',
          belongTo: action._id,
          type: 'error',
          title: `validate ${rule.name} 长度大于`,
          content: `${rule.name} 的长度 ${targetValue.length} 不大于 ${ruleDoc.standard}`,
        })
      }
    } else if (ruleDoc.type === '类型') {
      if (typeof targetValue === ruleDoc.standard) {
        this.ctx.service.log.add({
          job: jobId,
          belongType: 'action',
          belongTo: action._id,
          type: 'error',
          title: `validate ${rule.name} 类型`,
          content: `${rule.name} 的类型 ${typeof targetValue} 不等于 ${
            ruleDoc.standard
          }`,
        })
      }
    } else {
      this.ctx.service.log.add({
        job: jobId,
        belongType: 'sys',
        type: 'error',
        title: `${rule.name} 的验证规则 ${ruleDoc.type} 未定义`,
      })
    }
    return
  }
  public getResponseValue(response: any, keyName: string) {
    let keywordArray = keyName.split('.')
    let result = response
    keywordArray.forEach((o) => {
      result = result[o]
    })

    return result
  }
}
