import { ObjectID, ObjectId } from "mongodb";
import { Schema } from "mongoose";
import { PERMISSIONS } from "../PermissionsExtensions";
import { DIGEST, ITERATIONS, KEY_LENGTH, pbkdf2 } from '../utils/crypto-settings';

export interface Password {
    hash: string,
    salt: string,
    isPasswordValid(password:string): boolean,
    setPassword(hash: string, salt: string): void
}

export interface Name {
    first: string,
    last: string,
    middle: string
}

export interface User {
    //_id: ObjectId,
    name: Name,
    email: string,
    password: Password,
    permissions: PERMISSIONS
}

export const NameS = new Schema<Name>({
    first: {type: String, required: true},
    middle: {type: String},
    last: {type: String}
})

export const PasswordS = new Schema<Password>({
    hash: { type: String, required: true },
    salt: { type: String, required: true }
})

PasswordS.methods.isPasswordValid = async function(password: string){
    const hash = await pbkdf2(password, this.salt, ITERATIONS, KEY_LENGTH, DIGEST)
    return this.hash = hash.toString('hex');
};

PasswordS.methods.setPassword = function(hash: string, salt: string) {
    this.hash = hash
    this.salt = salt
};


export const UserS = new Schema<User>({
    //_id: {type: ObjectId},
    name: {_id: false, type: NameS, required: true},
    password: {_id: false, type: PasswordS, required: true},
    email: {type: String, required: true},
    permissions: {type: Number, required: true} 
});

