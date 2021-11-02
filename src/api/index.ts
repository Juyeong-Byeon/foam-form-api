import { Router, response } from 'express';
const router = Router();

//api response
router.get('/', (req, res, next) => {
	
});

//api response
router.get('/:id', (req, res, next) => {
    const id=req.params.id;
	res.send({
        id:id,
        someData:"data",
        protocol:req.protocol
    })
});

export default router;
