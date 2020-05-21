module.exports = ({ mongoose }) => {
  return mongoose.model(
    'Rule',
    new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
      },
      description: { type: String },
      type: { type: String, enum: ['equal', 'exist', 'length', 'type'] },
      standard: { type: [Number, String] },
      isEnable: {
        type: Boolean,
        default: true,
      },
      createAt: { type: Date, default: Date.now },
    }),
    'Rule'
  )
}
