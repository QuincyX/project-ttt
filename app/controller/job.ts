import baseController from '../base/controller'

export default class extends baseController {
  constructor(app) {
    super(app)
    this.model = this.ctx.model['Job']
  }

  public async index() {
    let { findQuery, pageQuery, sortQuery } = this.ctx.helper.getQuery(
      this.ctx.query
    )
    if (pageQuery.size === 0) {
      const list = await this.model
        .find(findQuery)
        .sort(sortQuery || '-createAt')
        .exec()
      this.success(list)
    } else {
      pageQuery.total = await this.model.find(findQuery).countDocuments().exec()
      const list = await this.model
        .find(findQuery)
        .sort(sortQuery || '-createAt')
        .skip(pageQuery.size * (pageQuery.page - 1))
        .limit(pageQuery.size)
        .exec()
      this.success(list, pageQuery)
    }
  }
  public async show() {
    const doc = await this.model.findById(this.ctx.params.id)
    this.success(doc)
  }
  public async create() {
    const payload = this.ctx.request.body
    const job: any = await this.model.create({
      ...payload,
      status: '进行中',
    })
    this.ctx.service.log.add({
      job: job._id,
      belongType: 'job',
      belongTo: job._id,
      type: 'success',
      title: `任务 ${job.name} 创建成功`,
      content: job.description,
    })
    this.ctx.status = 200
    this.ctx.body = {
      err: 0,
      message: job,
    }
    this.ctx.res.end()
    const { duration }: any = await this.ctx.service.job.triggerStory(
      payload.story,
      job._id
    )
    job.status = '已完成'
    job.duration = duration
    await job.save()
    this.ctx.service.log.add({
      job: job._id,
      belongType: 'job',
      belongTo: job._id,
      type: 'success',
      title: 'job 执行完成',
    })
    await this.ctx.model.Log.find({
      job: job._id,
    })
  }
  public async update() {
    const payload = this.ctx.request.body
    const _id = this.ctx.params.id
    const newDoc = await this.model.findOneAndUpdate({ _id }, { ...payload })
    this.success(newDoc)
  }
  public async destroy() {
    const _id = this.ctx.params.id
    const delDoc: any = await this.model.findByIdAndDelete(_id)
    const delLog = await this.ctx.model.Log.deleteMany({ job: _id })
    this.message(`${delDoc.name} 删除成功，${delLog.deletedCount}条日志`)
  }
}
