import Form from '../models/form.model.js';
import Response from '../models/response.model.js';

export const getAllForms=async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch forms' });
  }
};

export const getResponse=async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.id }).sort({ createdAt: -1 });
    res.json(responses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch responses' });
  }
};

export const deleteForm=async (req, res) => {
  try {
    const deleted = await Form.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json({ message: 'Form deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete form' });
  }
};


export const createForm = async (req, res) => {
  try {
    const payload = req.body;
    const form = new Form(payload);
    await form.save();
    return res.status(201).json(form);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error creating form', error: err.message });
  }
};

export const getFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const form = await Form.findById(id).lean();
    if (!form) return res.status(404).json({ message: 'Form not found' });
    return res.json(form);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const form = await Form.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!form) return res.status(404).json({ message: 'Form not found' });
    return res.json(form);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const publishForm = async (req, res) => {
  try {
    const { id } = req.params;
    const form = await Form.findById(id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    // create share token (unique)
    form.createShareToken();
    await form.save();
    return res.json({ shareToken: form.shareToken, shareUrl: `/s/${form.shareToken}` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getFormByShareToken = async (req, res) => {
  try {
    const { token } = req.params;
    const form = await Form.findOne({ shareToken: token, isPublic: true }).lean();
    if (!form) return res.status(404).json({ message: 'Shared form not found' });
    return res.json(form);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const submitResponse = async (req, res) => {
  try {
    const { id } = req.params; // or share token route
    const { answers, metadata } = req.body;
    const form = await Form.findById(id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    const response = new Response({ formId: id, answers, metadata });
    await response.save();
    form.responsesCount = (form.responsesCount || 0) + 1;
    await form.save();
    return res.status(201).json({ message: 'Response submitted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};