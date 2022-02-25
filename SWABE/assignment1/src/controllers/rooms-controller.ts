import { Request, Response } from 'express'
import mongoose from 'mongoose'

import { RoomS } from '../models/room'

const hotelConnection = mongoose.createConnection('mongodb://localhost:27017/hotel');
const roomModel = hotelConnection.model('Rooms', RoomS);

export class Rooms{
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

        let result = roomModel.find(filter).lean();
        res.json(result);
    }

    static async create(req: Request, res: Response) {
        const {number, roleNeeded} = req.body
        let newRoom = await new roomModel({number: number, roleNeeded: roleNeeded}) 
        try {
            await newRoom.save()
            console.log(newRoom.number + " saved to collection");
            res.status(201).json(newRoom);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
    static async read(req: Request, res: Response) {
        const {uid, } = req.body
        try {
            let result = await roomModel.find({_id:uid}).exec();
            res.status(200).json(result); 
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
        
    }
    static async update(req: Request, res: Response) {
        //const {uid, number, roleNeeded} = req.body
        //let filter = {};
        //filter = {... filter, ts: {$eq: uid}}
        // 
        //try {
        //    let updatedRoom = await roomModel.updateOne(filterToFindModel, ChangesToMakeToModel);
        //} catch (error) {
        //    
        //}
        throw new Error('Method not implemented.')
    }
    static async remove(req: Request, res: Response) {
        throw new Error('Method not implemented.')
    }

}