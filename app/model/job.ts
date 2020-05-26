module.exports = ({ mongoose }) => {
  return mongoose.model(
    'Job',
    new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
      },
      case: {
        type: String,
        ref: 'Case',
      },
      story: {
        type: String,
        ref: 'Story',
      },
      targetType: {
        type: String,
        enum: ['story', 'case', 'action', 'manual'],
      },
      targetId: {
        type: String,
      },
      trigger: {
        type: String,
        enum: ['手动', '定时', '计划', 'ops', 'git'],
      },
      duration: {
        type: String,
      },
      report: {
        type: String,
      },
      type: {
        type: String,
      },
      status: {
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
    'Job'
  )
}
