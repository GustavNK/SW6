import { Request, Response } from 'express'
import mongoose from 'mongoose'

import { ReservationsS } from '../models/reservation'

const hotelConnection = mongoose.createConnection('mongodb://localhost:27017/hotel');
const reservationModel = hotelConnection.model('Reservations',ReservationsS);

export class Reservation{
    static list(req: Request, res: Response) {
        const {from, to, ...etcFilter} = req.body;
        let filter = {};

        if(from && to) {
            filter = { ...filter, ts: { $gt: from, $lt: to }}
          } else {
            if(from) {
              filter = { ...filter, ts: { $gt: from }}
            }
            if(to) {
              filter = { ...filter, ts: { $lt: to }}
            }
          }
    
        let result = reservationModel.find(filter).lean();
        res.json(result);
    }

    static async read(req: Request, res: Response) {
        const {uid} = req.params;
        
        let result = await reservationModel.findById(uid);
        res.status(201).json(result);
    }    
    static async create(req: Request, res: Response) {
        const {roomId, startDate, endDate} = req.body
        let {id} = await new reservationModel({roomId: roomId, startDate: startDate, endDate: endDate}).save();
        res.json(id);
    }

    static update(req: Request, res: Response) {
        throw new Error('Method not implemented.')
    }
    static remove(req: Request, res: Response) {
        let {_id} = req.body;
        if(!_id){
            res.status(400).json('No ID given');
        }

        try {
            let result = reservationModel.findByIdAndDelete(_id);            
            if(result.amount <1){
                res.status(400).json('No models deleted. ID didnt match anything');
            }    
        } catch (error) {
            res.status(500).json(error);
        }

    }
};