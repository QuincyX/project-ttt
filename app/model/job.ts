module.exports = ({ mongoose }) => {
  return mongoose.model(
    'Job',
    new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true
      },
      description: { type: String },
      story: {
        type: String,
        ref: 'Story',
      },
      trigger: { type: String },
      report: { type: String },
      type: { type: String },
      isEnable: {
        type: Boolean,
        default: true,
      },
      createAt: { type: Date, default: Date.now },
    }),
    'Job'
  )
}
