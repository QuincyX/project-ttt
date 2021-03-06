module.exports = ({ mongoose }) => {
  return mongoose.model(
    'Rule',
    new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
      },
      type: {
        type: String,
        enum: ['相等', '存在', '包含', '属于', '长度大于', '类型'],
      },
      standard: {
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
    'Rule'
  )
}
