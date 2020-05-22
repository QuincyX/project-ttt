module.exports = ({ mongoose }) => {
  return mongoose.model(
    'Action',
    new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String
      },
      api: {
        type: String,
        ref: 'ApiItem'
      },
      query: [
        {
          name: String,
          mock: {
            type: String,
            ref: 'Mock'
          }
        }
      ],
      path: [
        {
          name: String,
          mock: {
            type: String,
            ref: 'Mock'
          }
        }
      ],
      body: [
        {
          name: String,
          mock: {
            type: String,
            ref: 'Mock'
          }
        }
      ],
      header: [
        {
          name: String,
          mock: {
            type: String,
            ref: 'Mock'
          }
        }
      ],
      rule: [
        {
          name: String,
          rule: {
            type: String,
            ref: 'Rule'
          }
        }
      ],
      output: [
        {
          targetType: String,
          target: String,
          name: String,
          source: String
        }
      ],
      type: {
        type: String
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
    'Action'
  )
}
