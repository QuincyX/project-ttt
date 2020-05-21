module.exports = ({ mongoose }) => {
  return mongoose.model(
    'ApiModel',
    new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true
      },
      description: { type: String },
      type: { type: String },
      required: { type: Array },
      properties: { type: mongoose.Schema.Types.Mixed },
      project: {
        type: String,
        ref: 'Project'
      },
      isEnable: {
        type: Boolean,
        default: true
      },
      createAt: { type: Date, default: Date.now }
    }),
    'ApiModel'
  )
}
