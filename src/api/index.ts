import { Router, response } from 'express';

import auth from './login/auth';

const router = Router();

router.use('/auth', auth);

export default router;
