module.exports = ({ mongoose }) => {
  return mongoose.model(
    'Log',
    new mongoose.Schema({
      type: { type: String },
      title: {
        type: String,
        trim: true
      },
      content: {
        type: String,
        trim: true
      },
      job: {
        type: String,
        ref: 'Job'
      },
      belongType: {
        type: String,
        enum: ['job', 'story', 'case', 'action', 'http', 'rule', 'sys']
      },
      belongTo: {
        type: String
      },
      createAt: {
        type: Date,
        default: Date.now
      }
    }),
    'Log'
  )
}
