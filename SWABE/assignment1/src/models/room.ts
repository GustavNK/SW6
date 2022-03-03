import { Schema } from 'mongoose'
import { ObjectId } from 'mongodb';
import { PERMISSIONS } from '../PermissionsExtensions';

export type Room = {
    _id: ObjectId,
    number: number,
    roleNeeded: PERMISSIONS
}

export const RoomS = new Schema<Room>({
    number: {type: Number, required: true},
    roleNeeded: {type: Number, required: true}
}
);