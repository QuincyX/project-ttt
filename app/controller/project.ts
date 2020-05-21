import baseController from '../base/controller'

export default class extends baseController {
  constructor(app) {
    super(app)
    this.model = this.ctx.model['Project']
  }
  public async index() {
    let query: any = { ...this.ctx.query }
    const page = {
      page: Number(this.ctx.query.page) || 1,
      size: Number(this.ctx.query.size) || 10,
      total: await this.model
        .find(query)
        .countDocuments()
        .exec()
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
    const { url } = this.ctx.request.body
    const {
      projectDoc,
      newApiGroups,
      oldApiGroup
    } = await this.ctx.service.apiDoc.updateProject(
      url || 'http://api-dev.benyuan.com/major-api/v2/api-docs'
    )
    this.ctx.helper.success({ oldApiGroup, newApiGroups, projectDoc })
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
