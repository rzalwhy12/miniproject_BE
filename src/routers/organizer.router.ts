import { Router } from 'express';
import { getOrganizerController } from '../controllers/organizer.controller';

const router = Router();

router.get('/', getOrganizerController);

export default router;
