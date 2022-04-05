import { GraphQLObjectType, GraphQLNonNull} from 'graphql';
import {UserInput, UserPayload} from './types/user';
import { RoomInput, RoomPayload } from './types/room';
import { ReservationInput, ReservationPayload } from './types/reservation';

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        userCreate: {
            type: new GraphQLNonNull(UserPayload),
            args: {
                input: { type: new GraphQLNonNull(UserInput) },
            },
            resolve: async (source, {input}, { mutators }) => {
                return mutators.userCreate(input);
            },
        },
        roomCreate: {
            type: new GraphQLNonNull(RoomPayload),
            args: {
                input: {type: new GraphQLNonNull(RoomInput)}
            },
            resolve: async (source, {input}, {mutators}) => {
                return mutators.roomCreate(input);
            }
        },

        reservationCreate: {
            type: new GraphQLNonNull(ReservationPayload),
            args:{
                input: {type: new GraphQLNonNull(ReservationInput)}
            },
            resolve: async (source , {input}, {mutators}) => {
                return mutators.reservationCreate(input);
            }
        }
    })
});
export default MutationType;

