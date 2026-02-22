import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8);

const OptionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  label: { type: String, default: 'Untitled Question' },
  required: { type: Boolean, default: false },
  options: { type: [OptionSchema], default: [] },
  validation: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { _id: false });

const FormSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Form' },
  description: { type: String, default: '' },
  questions: { type: [QuestionSchema], default: [] },
  responsesCount: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: false },
  shareToken: { type: String, index: true, unique: true, sparse: true },
}, { timestamps: true });

FormSchema.methods.createShareToken = function () {
  this.shareToken = nanoid();
  this.isPublic = true;
  return this.shareToken;
};

export default mongoose.model('Form', FormSchema);