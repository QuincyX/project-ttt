module.exports = ({ mongoose }) => {
  return mongoose.model(
    'SysConfig',
    new mongoose.Schema({
      _id: {
        type: String,
        required: true,
        trim: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
      },
      content: {
        type: mongoose.Schema.Types.Mixed,
      },
      isEnable: {
        type: Boolean,
        default: true,
      },
      createAt: {
        type: Date,
        default: Date.now,
      },
    }),
    'SysConfig'
  )
}
