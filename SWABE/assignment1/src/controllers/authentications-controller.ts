import { Request, Response } from 'express'
import * as mongoose from 'mongoose'
import { sign } from 'jsonwebtoken'
import { User, UserS, Name } from '../models/user'

import { randomBytes, pbkdf2, SALT_LENGTH, DIGEST, ITERATIONS, KEY_LENGTH } from '../utils/crypto-settings';
import { PRIVATE_KEY } from '..'
import { PERMISSIONS } from '../PermissionsExtensions';

const X5U = 'http://localhost:3000/auth-rsa256.key.pub'

// const hotelConnection = mongoose.createConnection('mongodb://localhost:27017/hotel');
export const userModel = mongoose.model('User',UserS);

export class Authentications{
    //List all user IDS
    static async list(_: Request, res: Response) {
        //find all
        let result = await userModel.find().lean();
        res.status(200).json(result);
    }
    
    //View user by userid
    static async read(req: Request, res: Response) {
        const {uid} = req.params;
        let result  = await userModel.findById(uid);
        if(!result){
            res.status(404);
        }else{
            res.status(200).json(result);
        }
        res.status(200).json(result);
    }
    
    //create new user
    static async create(req: Request, res: Response) {
        const {email,password,name, permissions} = req?.body;
        if(await checkUserExists(email)){
            res.status(400).json({
                "message": "User already exists"
            });
        } else {
            //create salt, hash and user
            let salt = await randomBytes(SALT_LENGTH);
            let hashed = (await pbkdf2(password, salt.toString('hex'), ITERATIONS, KEY_LENGTH, DIGEST)).toString();
            let user = newUser(email,name,permissions);
            user.password.setPassword(hashed,salt.toString());
            await user.save();
            res.status(200).json(user);
        }
    }
    
    //Issue JWT token with login from body
    static async getJWTToken(req: Request, res: Response) {
        const{email, password} = req.body;
        let user: User | null = await userModel.findOne({email});
        //console.log('USER FOUND AT LOGIN:', user);
        if(user != null){
            if(await user.password.isPasswordValid(password)){
                //Anvend private key
                sign({ userId: user!._id, email, permissions: user!.permissions }, PRIVATE_KEY, { expiresIn: '1h', header: { alg: 'RS256', x5u: X5U} }, (err, token) => {
                    if(err) {
                        res.status(500).json({
                            message: err.message
                        })
                    } else {
                        res.status(200).json({ token })
                    }
                })
            } else{
                res.status(403);
            }
        } else{
            res.status(400);
        }
    }
}

const checkUserExists = async function (email:string){
    let user = await userModel.findOne({email}).exec();
    //console.log(!!user);
    return !!user;
}

const newUser = (email: string, name: Name, permissions: PERMISSIONS) => new userModel({
    email,
    name,
    password:{
        hash: '',
        salt: ''
    },
    permissions
})