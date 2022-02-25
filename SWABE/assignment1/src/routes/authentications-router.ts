import { NextFunction, Request, Response, Router } from 'express'
import { Authentications, PERMISSIONS } from '../controllers/authentications-controller'
import { decode } from 'jsonwebtoken'

const router = Router()

const requirePermission = function (perm: PERMISSIONS) {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = JSON.parse(req.get('authorization') ?? '')?.bearer;
        const payload = decode(token, {json: true});
        console.log(token, payload); // DEV: Check what token and payload becomes and if its correct 😎
        if (payload) {
            //Verify payload with method
            if (payload?.role <= perm) {
                next();
            } else {
                res.status(401);
            }
        } else {
            res.status(400);
        }
    }
}

router.get('/users', Authentications.list)
router.get('/users/:uid', Authentications.read)
router.post('/user', Authentications.create)
router.post('/login', Authentications.getJWTToken)


export const authentications = router