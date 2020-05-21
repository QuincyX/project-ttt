import baseController from '../base/controller'

export default class extends baseController {
  constructor(app) {
    super(app)
    this.model = this.ctx.model['Job']
  }

  public async index() {
    let query: any = { ...this.ctx.query }
    const page = {
      page: Number(this.ctx.query.page) || 1,
      size: Number(this.ctx.query.size) || 10,
      total: await this.model.find(query).countDocuments().exec(),
    }
    const list = await this.model
      .find(query)
      .sort(this.ctx.query.sort || '-createAt')
      .skip(page.size * (page.page - 1))
      .limit(page.size)
      .exec()
    this.success(list, page)
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
      title: 'job 创建成功',
    })
    await this.ctx.service.job.triggerStory(payload.story, job._id)
    job.status = '已完成'
    await job.save()
    this.ctx.service.log.add({
      job: job._id,
      belongType: 'job',
      belongTo: job._id,
      type: 'success',
      title: 'job 执行完成',
    })
    const log = await this.ctx.model.Log.find({
      job: job._id,
    })
    this.success({ job, log })
  }
  public async update() {
    const payload = this.ctx.request.body
    const _id = this.ctx.params.id
    const newDoc = await this.model.findOneAndUpdate({ _id }, { ...payload })
    this.success(newDoc)
  }
  public async destroy() {
    const _id = this.ctx.params.id
    const delDoc = await this.model.findByIdAndDelete(_id)
    this.success(delDoc)
  }
}
