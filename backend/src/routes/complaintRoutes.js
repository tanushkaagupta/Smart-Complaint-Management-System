import { Router } from 'express';
import {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  updateComplaint,
  deleteComplaint
} from '../controllers/complaintController.js';

const router = Router();

router.get('/', getAllComplaints);
router.post('/', createComplaint);
router.get('/:id', getComplaintById);
router.patch('/:id/status', updateComplaintStatus);
router.put('/:id', updateComplaint);
router.delete('/:id', deleteComplaint);

export default router;
