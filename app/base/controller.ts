import { Controller } from 'egg'
import { Model, Document } from 'mongoose'

export default class baseController extends Controller {
  model: Model<Document>
  success = this.ctx.helper.success
  error = this.ctx.helper.error
  axios = this.ctx.service.axios
}
