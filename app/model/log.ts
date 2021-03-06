module.exports = ({ mongoose }) => {
  return mongoose.model(
    'Log',
    new mongoose.Schema({
      type: { type: String },
      title: {
        type: String,
        trim: true,
      },
      content: {
        type: mongoose.Schema.Types.Mixed,
      },
      curl: {
        type: mongoose.Schema.Types.Mixed,
      },
      job: {
        type: String,
        ref: 'Job',
      },
      belongType: {
        type: String,
        enum: [
          'job',
          'story',
          'case',
          'action',
          'http',
          'rule',
          'output',
          'sys',
        ],
      },
      belongTo: {
        type: String,
      },
      createAt: {
        type: Date,
        default: Date.now,
      },
    }),
    'Log'
  )
}
