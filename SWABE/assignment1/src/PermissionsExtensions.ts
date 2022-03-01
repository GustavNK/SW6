import { NextFunction, Request, Response } from 'express'
import { decode } from 'jsonwebtoken'

export const enum PERMISSIONS {
    MANAGER = 1,
    CLERK,
    GUEST
}

export const requirePermission = function (...perms: PERMISSIONS[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers['authorization'] ?? '';
            if(typeof token === 'undefined'){
                throw new Error("No bearer token");
            }
            // token.split(' ')[1] is to get the token after the definition 'Bearer <token>'
            const payload = decode(token.split(' ')[1], { json: true });
            console.log(token, payload); // DEV: Check what token and payload becomes and if its correct
            //Verify payload with method
            if (perms.includes(payload?.permissions)) {
                next();
            } else {
                res.status(401);
            }
        } catch (error) {
            console.log(error);
            res.status(400).json('No payload given for authentication\nNO AUTHORIZATION HEADER\n');
        }
        

    }

}