import baseController from '../base/controller'

export default class extends baseController {
  constructor(app) {
    super(app)
    this.model = this.ctx.model['ApiItem']
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
    delete payload._id
    const newDoc = await this.model.create({ ...payload })
    this.success(newDoc)
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
