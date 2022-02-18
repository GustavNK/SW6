import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose'

export type Reservation = {
    _id: ObjectId,
    roomId: string,
    startDate: Date,
    endDate: Date
};

export const ReservationsS = new Schema<Reservation>();