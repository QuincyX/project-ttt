import baseController from '../base/controller'

export default class extends baseController {
  constructor(app) {
    super(app)
    this.model = this.ctx.model['Project']
  }
  public async index() {
    let { findQuery, pageQuery, sortQuery } = this.ctx.helper.getQuery(
      this.ctx.query
    )
    pageQuery.total = await this.model.find(findQuery).countDocuments().exec()
    const list = await this.model
      .find(findQuery)
      .sort(sortQuery || '-createAt')
      .skip(pageQuery.size * (pageQuery.page - 1))
      .limit(pageQuery.size)
      .exec()
    this.success(list, pageQuery)
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
