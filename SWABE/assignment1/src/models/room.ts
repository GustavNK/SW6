import { Schema } from 'mongoose'
import { ObjectId } from 'mongodb';
import { PERMISSIONS } from '../controllers/authentications-controller';

export type Room = {
    _id: ObjectId,
    number: number,
    roleNeeded: PERMISSIONS
}

export const RoomS = new Schema<Room>();