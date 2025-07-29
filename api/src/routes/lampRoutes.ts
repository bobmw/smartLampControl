import { Router } from 'express';
import { sendCommand } from '../controllers/lampController';

const router = Router();

router.post('/lampada', sendCommand);

export default router;
