import { Request, Response } from 'express'
import * as mongoose from 'mongoose'

import { ReservationsS } from '../models/reservation'

// const hotelConnection = mongoose.createConnection('mongodb://localhost:27017/hotel');
export const reservationModel = mongoose.model('Reservations',ReservationsS);

export class Reservation{
    static async list(req: Request, res: Response): Promise<Reservation[]> {
        const {from, to} = req.body;
        let filter = {};

        if(from) {
            filter = { ...filter, startDate: { $gt: from }}
        }

        if(to) {
            filter = { ...filter, endDate: { $lt: to }}
        }

        let result = await reservationModel.find(filter);
        res.status(200).json(result);
        return result;
    }

    static async read(req: Request, res: Response) {
        const {uid} = req.params;
        
        let result = await reservationModel.findById(uid);
        res.status(201).json(result);
    }
    /**
     * Req type: POST
     * 
     */
    static async create(req: Request, res: Response) {
        const roomId =req.params['uid'];
        const {startDate, endDate} = req.body;
        let filter = {};
        filter = {roomId: {$eq: roomId},
            $or: [{startDate: { $gte: startDate, $lte: endDate }},{endDate: { $gte: startDate, $lte: endDate }}]
        }
        let room = await reservationModel.find(filter);
        if(room.length !== 0){
            res.status(400).json("Can't make new reservation, there is already one reservation in the timeframe");
            return
        }
     
        try {
            let {id} = await new reservationModel({roomId: roomId, startDate: startDate, endDate: endDate}).save();
            res.json(id);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    static async update(req: Request, res: Response) {
        const _id =req.params['uid'];
        let newData = req.body;
        if(!_id){
            res.status(400).json('No ID given');
        }
        try {
            let result = await reservationModel.findByIdAndUpdate(_id, newData, {new: true});
            console.log("New reservation: ", result);
              
            if(!result){
                res.status(400).json('No reservations found. ID didnt match anything');
            }else {
                res.status(200).json(result);  
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
    static async remove(req: Request, res: Response) {
        const _id =req.params['uid'];
        if(!_id){
            res.status(400).json('No ID given');
            return;
        }
        try {
            let result = await reservationModel.findByIdAndDelete(_id);
            if(result != null){
                res.status(400).json('No models deleted. ID didnt match anything');
                return
            } 
            res.status(200).json('Document succesfully deleted');
        } catch (error) {
            res.status(500).json(error);
        }

    }
};