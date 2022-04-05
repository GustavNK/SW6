
import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import Reservation from './types/reservation';
import Room from './types/room';
import User from './types/user';

const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        currentTime: {
            type: GraphQLString,
            resolve: () => {
                const isoString = new Date().toISOString();
                return isoString.slice(11, 19);
            },
        },
        /*
            USER QUERIES
        */
        getUser: {
            type: User,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: async (source, args, { loaders }) => {
                return await loaders.getUser.load(args.id)
            }
        },
        getAllUsers: {
            type: new GraphQLList(new GraphQLNonNull(User)),
            resolve: async (source, args, { pgApi }) => {
                return await pgApi.queries.getAllUsers();
            }
        },
        /*
            RESERVATION QUERIES
        */
        getReservation: {
            type: new GraphQLNonNull(Reservation),
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: async (source, args, { loaders }) => {
                return await loaders.getReservation.load(args.id);
            }
        },
        getAllReservations: {
            type: new GraphQLList(new GraphQLNonNull(Reservation)),
            resolve: async (source, args, { pgApi }) => {
                return await pgApi.queries.getAllReservations();
            }
        },
        getAllReservationInTimespan: {
            type: new GraphQLList(Reservation),
            args: {
                start: { type: new GraphQLNonNull(GraphQLString) },
                end: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (source, args, { pgApi }) => {
                return await pgApi.queries.getAllReservationInTimespan(args.start, args.end)
            }
        },
        /*
            ROOM QUERIES
        */
        getRoom: {
            type: Room,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: async (source, args, { loaders }) => {
                return await loaders.getRoom.load(args.id);
            }
        },
        getAllRooms: {
            type: new GraphQLList(new GraphQLNonNull(Room)),
            resolve: async (source, args, { pgApi }) => {
                return await pgApi.queries.getAllRooms();
            }
        },
    },
})

export default QueryType;