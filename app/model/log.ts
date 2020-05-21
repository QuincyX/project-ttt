module.exports = ({ mongoose }) => {
  return mongoose.model(
    'Log',
    new mongoose.Schema({
      type: { type: String },
      content: {
        type: String,
        trim: true
      },
      job: { type: String, ref: 'Job' },
      belongType: {
        type: String,
        enum: ['job', 'story', 'case', 'action', 'http', 'sys']
      },
      belongTo: { type: String },
      createAt: { type: Date, default: Date.now }
    }),
    'Log'
  )
}
