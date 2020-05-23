import baseController from '../base/controller'

export default class extends baseController {
  constructor(app) {
    super(app)
    this.model = this.ctx.model['Mock']
  }
  public async addMockListItem() {
    const payload = this.ctx.request.body
    const _id = this.ctx.params.id
    const doc: any = await this.model.findById(_id)
    if (doc && payload.newItem) {
      doc.list.push(payload.newItem)
      await doc.save()
    }
    this.success(doc)
  }
  public async deleteMockListItem() {
    const _id = this.ctx.params.id
    const item = this.ctx.params.item
    const delDoc: any = await this.model.findById(_id)
    const deleteIndex = delDoc.list.findIndex((o) => o === item)
    delDoc.list.splice(deleteIndex, 1)
    await delDoc.save()
    this.success(delDoc)
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
