module.exports = ({ mongoose }) => {
  return mongoose.model(
    'Story',
    new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
      },
      caseList: [
        {
          type: String,
          ref: 'Case',
        },
      ],
      type: {
        type: String,
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
    'Story'
  )
}
