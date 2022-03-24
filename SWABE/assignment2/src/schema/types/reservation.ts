import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLInt,
} from 'graphql';
import User from './user';
import Room from './room';

const fieldsWrapper = () => {
    let reservationField = {
        id: { type: new GraphQLNonNull(GraphQLID) },
        startdate: { type: new GraphQLNonNull(GraphQLString) },
        enddate: { type: new GraphQLNonNull(GraphQLString) },
        createdByUser: {
            type: new GraphQLNonNull(User),
            resolve: async (obj, args, context, info) => {
                // console.log(context);
                return await context.loaders.userInfo.load(obj.createdbyuser);
            }
        },
        reservedRoom: {
            type: new GraphQLNonNull(Room),
            resolve: async (obj, args, context, info) => {
                return await context.loaders.getRoom.load(obj.reservedroom);
            }
        }
    }
    return reservationField;
}

const Reservation = new GraphQLObjectType({
    name: 'Reservation',
    fields: () => fieldsWrapper(),
})

export type ReservationType = typeof Reservation

export default Reservation