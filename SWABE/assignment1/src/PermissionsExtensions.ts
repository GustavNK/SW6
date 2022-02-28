import { NextFunction, Request, Response } from 'express'
import { decode } from 'jsonwebtoken'

export enum PERMISSIONS {
    MANAGER = 1,
    CLERK,
    GUEST
}

export const requirePermission = function (...perms: PERMISSIONS[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = JSON.parse(req.get('authorization') ?? '')?.bearer;
        const payload = decode(token, { json: true });
        console.log(token, payload); // DEV: Check what token and payload becomes and if its correct
        if (payload) {
            //Verify payload with method
            if (perms.includes(payload?.role)) {
                next();
            } else {
                res.status(401);
            }
        } else {
            res.status(400).json('No payload given for authentication\nNO AUTHORIZATION HEADER\n');
        }

    }

}