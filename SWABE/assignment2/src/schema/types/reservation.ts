import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLInt,
    GraphQLInputObjectType,
} from 'graphql';
import User from './user';
import Room from './room';

const fieldsWrapper = () => {
    let reservationField = {
        id: { type: new GraphQLNonNull(GraphQLID) },
        startDate: { type: new GraphQLNonNull(GraphQLString) },
        endDate: { type: new GraphQLNonNull(GraphQLString) },
        createdByUser: {
            type: new GraphQLNonNull(User),
            resolve: async (obj, args, context, info) => {
                console.log(obj);
                return await context.loaders.getUser.load(obj.createdByUser);
            }
        },
        reservedRoom: {
            type: new GraphQLNonNull(Room),
            resolve: async (obj, args, context, info) => {
                return await context.loaders.getRoom.load(obj.reservedRoom);
            }
        }
    }
    return reservationField;
}

export const ReservationInput = new GraphQLInputObjectType({
    name: 'ReservationInput',
    fields: () => ({
      createdByUser: { type: new GraphQLNonNull(GraphQLInt) },
      reservedRoom: { type: GraphQLInt },
      startDate: { type: GraphQLString },
      endDate: { type: GraphQLString },
    }),
});

export const ReservationPayload = new GraphQLObjectType({
    name: 'ReservationPayload',
    fields: () => ({
        errors: {
            type: new GraphQLNonNull(
                new GraphQLList(new GraphQLNonNull(ReservationError))
            ),
        },
        reservation: { type: Reservation }
    }),
});


export const ReservationError = new GraphQLObjectType({
    name: 'ReservationError',
    fields: () => ({
      message: {
        type: new GraphQLNonNull(GraphQLString),
      },
    }),
});



const Reservation = new GraphQLObjectType({
    name: 'Reservation',
    fields: () => fieldsWrapper(),
})

export type ReservationType = typeof Reservation

export default Reservation