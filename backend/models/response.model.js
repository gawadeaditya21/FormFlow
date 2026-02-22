import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  questionId: String,
  value: mongoose.Schema.Types.Mixed
}, { _id: false });

const ResponseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  answers: { type: [AnswerSchema], default: [] },
  submittedAt: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
});

export default mongoose.model('Response', ResponseSchema);