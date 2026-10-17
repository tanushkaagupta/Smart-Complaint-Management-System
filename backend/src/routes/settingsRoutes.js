import { Router } from 'express';
import { getSettings, updateSettings, updatePassword } from '../controllers/settingsController.js';

const router = Router();

router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/password', updatePassword);

export default router;
