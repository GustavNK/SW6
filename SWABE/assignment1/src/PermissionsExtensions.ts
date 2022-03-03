import { NextFunction, Request, Response } from 'express'
import { decode, verify } from 'jsonwebtoken'
import { PRIVATE_KEY } from '.';

export const enum PERMISSIONS {
    MANAGER = 1,
    CLERK,
    GUEST
}
export const ALLPERMS: PERMISSIONS[] = [PERMISSIONS.MANAGER, PERMISSIONS.CLERK, PERMISSIONS.GUEST];

export const requirePermission = function (...perms: PERMISSIONS[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers['authorization']?.split(' ')[1] ?? '';
            if(typeof token === 'undefined'){
                throw new Error("No bearer token");
            }
            verify(token,PRIVATE_KEY,{algorithms:['RS256']});
            // token.split(' ')[1] is to get the token after the definition 'Bearer <token>'
            const payload = decode(token, { json: true });
            //Verify payload with method
            if (perms.includes(payload?.permissions)) {
                // Enhance the req body with the 
                req.body.payload = payload;
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