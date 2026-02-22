import express from 'express';
import {
  createForm,
  getFormById,
  updateForm,
  publishForm,
  getFormByShareToken,
  submitResponse,getAllForms,
  getResponse,
  deleteForm
} from '../controllers/formsController.js';

const router = express.Router();

router.get('/', getAllForms);
router.post('/', createForm);
router.get('/:id', getFormById);
router.put('/:id', updateForm);
router.delete('/:id', deleteForm);
router.get('/:id/responses', getResponse);
router.post('/:id/publish', publishForm);
router.get('/share/:token', getFormByShareToken);
router.post('/:id/responses', submitResponse);

export default router;