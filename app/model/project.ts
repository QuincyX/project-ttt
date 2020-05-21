module.exports = ({ mongoose }) => {
  return mongoose.model(
    'Project',
    new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true
      },
      type: {
        type: String,
        required: true,
        enum: ['swagger']
      },
      version: { type: String },
      description: { type: String },
      host: { type: String },
      basePath: { type: String },
      createAt: { type: Date, default: Date.now }
    }),
    'Project'
  )
}
