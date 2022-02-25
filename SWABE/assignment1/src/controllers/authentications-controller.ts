import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { readFile } from 'fs'
import { join } from 'path'
import { sign, verify } from 'jsonwebtoken'
import { User, UserS } from '../models/user'
import { randomBytes, pbkdf2, SALT_LENGTH, DIGEST, ITERATIONS, KEY_LENGTH } from '../utils/crypto-settings';
export enum PERMISSIONS{
    MANAGER = 1,
    CLERK,
    GUEST
}

const PATH_PRIVATE_KEY = join(__dirname, '..', '..', 'auth-rsa256.key');
const PATH_PUBLIC_KEY = join(__dirname, '..', '..', 'public', 'auth-rsa256.key.pub');
const X5U = 'http://localhost:3000/auth-rsa256.key.pub'

const hotelConnection = mongoose.createConnection('mongodb://localhost:27017/hotel');
const userModel = hotelConnection.model('User',UserS);

export class Authentications{
    //List all user IDS
    static async list(req: Request, res: Response) {
        //find all
        let result = await userModel.find().lean();
        res.json(result);
    }

    //View user by userid
    static async read(req: Request, res: Response) {
        const {uid} = req.params;
        let result  = await userModel.findById(uid, {__v:0}).exec()
        res.json(result);
    }

    
    //create new user
    static async create(req: Request, res: Response) {
        const {email,password,name} = req.body;
        if(checkUserExists(email)){
            res.status(400).json({
                "message": "User already exists"
            });
        } else {
            //create salt, hash and user
            let salt = await randomBytes(SALT_LENGTH);
            let hashed = await pbkdf2(password, salt.toString('hex'), ITERATIONS, KEY_LENGTH, DIGEST)
            let user = newUser(name,email);
            user.password.setPassword(salt.toString(),hashed);
            await user.save();
            res.json(user);
        }
    }

    //Issue JWT token with login from body
    static async getJWTToken(req: Request, res: Response) {
        const{email, password} = req.body;
        let user: User = await userModel.findOne({email}).exec();
        if(user){
            if(await user.password.isPasswordValid(password)){
                //Anvend private key
                readFile(PATH_PRIVATE_KEY,(err,privateKey)=>{
                    if(err){
                        res.sendStatus(500);
                    } else{
                        sign({ userId: user._id, email, permission: user.permissions }, privateKey, { expiresIn: '1h', header: { alg: 'RS256', x5u: X5U} }, (err, token) => {
                            if(err) {
                              res.status(500).json({
                                message: err.message
                              })
                            } else {
                              res.status(200).json({ token })
                            }
                        })
                    }
                });
            } else{
                res.sendStatus(403);
            }
        } else{
            res.sendStatus(400);
        }
    }
}

const checkUserExists = function (email:string){ 
    return !!userModel.findOne({email}).exec();
}

const newUser = function(name: string, email: string){
    let newUser = new userModel({
        name: name,
        email: email,
        password: {
            salt: '',
            hash: ''
        }
    })
    return newUser;
}
