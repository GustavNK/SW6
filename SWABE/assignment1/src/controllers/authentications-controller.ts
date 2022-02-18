import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { readFile } from 'fs'
import { join } from 'path'
import { sign, verify } from 'jsonwebtoken'
import { UserS } from '../models/user'

export enum PERMISSIONS{
    MANAGER = 1,
    CLERK,
    GUEST
}

const PATH_PRIVATE_KEY = join(__dirname, '..', '..', 'auth-rsa256.key');
const PATH_PUBLIC_KEY = join(__dirname, '..', '..', 'public', 'auth-rsa256.key.pub');

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
        let result  = await userModel.find({_id:uid}, {__v:0}).exec()
        res.json(result);
    }
    //create new user
    static async create(req: Request, res: Response) {
        throw new Error('Method not implemented.')
    }
    //Issue JWT token
    static async getJWTToken(req: Request, res: Response) {
        throw new Error('Method not implemented.')
    }



}