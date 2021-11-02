import { Router, response } from 'express';

import dbConnection from '../db/sqlconnection';

const router = Router();

//api response
router.get('/', (req, res, next) => {
	
});

//api response
router.get('/:id', (req, res, next) => {
    const id=req.params.id;
    dbConnection.connect('');
    dbConnection.query(`SELECT password from  Users where id="${id}";`,(error,rows,filds)=>{

        console.log(error);
        console.log(rows);
        console.log(filds);
        res.send({
            error,
            rows,
            filds
        })
    })
    
    dbConnection.end();
    
});

export default router;

