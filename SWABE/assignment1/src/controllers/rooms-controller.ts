import { Request, Response } from 'express'
import * as mongoose from 'mongoose'
import { RoomS } from '../models/room'
import { reservationModel } from './reservations-controller';
//import { PERMISSIONS } from '../PermissionsExtensions';

//const hotelConnection = mongoose.createConnection('mongodb://localhost:27017/hotel');
export const roomModel = mongoose.model('Rooms', RoomS);

export class Rooms{
    static async list(req: Request, res: Response) {
        const {available} = req.body;
        let filter = {};

        let filteredReservations;
        if(available){
            // Find rooms that are at current time unavailable
            filter = { ...filter, startDate: { $lt: new Date() }}
            filter = { ...filter, endDate: { $gt: new Date() }}
            filteredReservations = await reservationModel.find(filter);
        }
        // create filter
        let roomIdFilter = {};
        if(filteredReservations && filteredReservations.length > 0)
        {
            roomIdFilter = {'_id' : { $nin: filteredReservations.map(reserv => reserv.roomId.toString())}}
        }
        
        let resultRooms = await roomModel.find(roomIdFilter);
        res.status(200).json(resultRooms);
    }

    static async create(req: Request, res: Response) {
        const number: number = req.body?.number;
        const roleNeeded: number = req.body?.roleNeeded;
        let newRoom = await new roomModel({number: number, roleNeeded: roleNeeded})
        try {
            // Check if room number already taken
            if(typeof number !== 'number' || number < 1 || !roleNeeded || roleNeeded < 1 || roleNeeded > 3){
                throw ''
            }
            await newRoom.save()
            console.log(newRoom.number + "  added to hotel");
            res.status(201).json(newRoom);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
    static async read(req: Request, res: Response) {
        const _id = req.params['uid'];
        try {
            let result = await roomModel.find({_id}).exec();
            res.status(200).json(result); 
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
        
    }
    static async update(req: Request, res: Response) {
        let newData = req.body; 
        const _id = req.params['uid'];
        if(!_id){
            res.status(400).json('No ID given');
        }
        try {
            let result = await roomModel.findByIdAndUpdate(_id, newData, {new: true});
            console.log("New room: ", result);
            
            if(!result){
                res.status(400).json('No rooms found. ID didnt match anything');
            }else{
                res.status(200).json(result);
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
    
    static async remove(req: Request, res: Response) {
        const _id = req.params['uid'];
        try {
            let result = await roomModel.findByIdAndDelete(_id);
            if(result != null && result){
                res.status(200).json('Room succesfully deleted');
            }else{
                res.status(400).json('Database unable to find room by ID');
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
    
}