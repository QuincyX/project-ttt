module.exports = ({ mongoose }) => {
  const paramSchema = new mongoose.Schema({
    name: String,
    description: String,
    required: Boolean,
    type: String,
    default: String,
    model: String
  })
  return mongoose.model(
    'ApiItem',
    new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true
      },
      url: {
        type: String
      },
      method: {
        type: String
      },
      description: {
        type: String
      },
      operationId: {
        type: String
      },
      query: [paramSchema],
      body: [paramSchema],
      header: [paramSchema],
      path: [paramSchema],
      apiModel: {
        type: String,
        ref: 'ApiModel'
      },
      apiGroup: {
        type: String,
        ref: 'ApiGroup'
      },
      project: {
        type: String,
        ref: 'Project'
      },
      isEnable: {
        type: Boolean,
        default: true
      },
      createAt: {
        type: Date,
        default: Date.now
      }
    }),
    'ApiItem'
  )
}
