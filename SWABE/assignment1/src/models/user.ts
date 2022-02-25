import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import { PERMISSIONS } from "../PermissionsExtensions";
import { DIGEST, ITERATIONS, KEY_LENGTH, pbkdf2 } from '../utils/crypto-settings';

export type Password ={
    hash: string,
    salt: string,
    isPasswordValid(password:string): boolean,
    setPassword(hash: string, salt: string): void
}

export type Name = {
    first: string,
    last: string,
    middle: string
}

export type User = {
    _id: ObjectId
    name: Name,
    email: string,
    password: Password,
    permissions: PERMISSIONS
}


export const PasswordS = new Schema<Password>({
    hash: { type: String, required: true },
    salt: { type: String, required: true }
})

PasswordS.methods.isPasswordValid = async function(password: string){
    const hash = await pbkdf2(password, this.salt, ITERATIONS, KEY_LENGTH, DIGEST)
    return this.hash = hash.toString('hex');
}

PasswordS.methods.setPassword = function(hash: string, salt: string) {
    this.hash = hash
    this.salt = salt
  }

export const UserS = new Schema<User>();