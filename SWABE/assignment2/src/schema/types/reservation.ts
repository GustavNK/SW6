import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
} from 'graphql';

import User from './user';
import Room from './room';

const fieldsWrapper = () => {
    const reservationField = {
        id: {type: new GraphQLNonNull(GraphQLID)},
        startdate: {type: new GraphQLNonNull(GraphQLString)},
        enddate: {type: new GraphQLNonNull(GraphQLString)},
        createdByUser: {type: User},
        reservedRoom: {type: Room}
    }
    return reservationField;
}

const Reservation = new GraphQLObjectType({
    name: 'Reservation',
    fields: () => fieldsWrapper(),
})

export type ReservationType = typeof Reservation

export default Reservation