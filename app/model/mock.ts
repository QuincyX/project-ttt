module.exports = ({ mongoose }) => {
  return mongoose.model(
    'Mock',
    new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
      type: {
        type: String,
        enum: ['global', 'job', 'story', 'case', 'action'],
      },
      parent: {
        type: String,
      },
      list: [
        {
          type: String,
        },
      ],
      isEnable: {
        type: Boolean,
        default: true,
      },
      createAt: {
        type: Date,
        default: Date.now,
      },
    }),
    'Mock'
  )
}
