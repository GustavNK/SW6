import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose'
import { User, UserS } from './user';

export type Reservation = {
    _id: ObjectId,
    createdByUser: User,
    roomId: ObjectId,
    startDate: Date,
    endDate: Date
};

export const ReservationsS = new Schema<Reservation>({
    createdByUser: {_id: false, type: UserS},
    roomId: {type: Schema.Types.ObjectId, ref: 'Rooms', required: true},
    startDate: {type: Date, required: true},
    endDate: {type:Date, required: true}
});