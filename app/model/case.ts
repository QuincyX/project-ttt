module.exports = ({ mongoose }) => {
  return mongoose.model(
    'Case',
    new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true
      },
      description: { type: String },
      actionList: [
        {
          type: String,
          ref: 'Action'
        }
      ],
      type: { type: String },
      isEnable: {
        type: Boolean,
        default: true
      },
      createAt: { type: Date, default: Date.now }
    }),
    'Case'
  )
}
