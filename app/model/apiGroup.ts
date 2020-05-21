module.exports = ({ mongoose }) => {
  return mongoose.model(
    'ApiGroup',
    new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true
      },
      description: { type: String },
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
    'ApiGroup'
  )
}
