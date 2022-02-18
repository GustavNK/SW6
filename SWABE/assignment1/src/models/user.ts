import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import { DIGEST, ITERATIONS, KEY_LENGTH, pbkdf2 } from '../utils/crypto-settings';

export type Password ={
    hash: string,
    salt: string,
    isPasswordValid(password:string): boolean
}

export type Name = {
    first: string,
    last: string,
    middle: string
}

export type User ={
    _id: ObjectId
    name: Name,
    email: string,
    password: Password
}


export const PasswordS = new Schema<Password>({
    hash: { type: String, required: true },
    salt: { type: String, required: true }
})

PasswordS.methods.isPasswordValid = async function(password: string){

}

export const UserS = new Schema<User>();