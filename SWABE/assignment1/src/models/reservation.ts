import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose'
import { User } from './user';

export type Reservation = {
    _id: ObjectId,
    createdByUser: User,
    roomId: string,
    startDate: Date,
    endDate: Date
};

export const ReservationsS = new Schema<Reservation>();