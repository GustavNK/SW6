import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLInputObjectType,
} from 'graphql';

const fieldsWrapper = () => {
    const roomField = {
        id: { type: new GraphQLNonNull(GraphQLID) },
        floor: { type: new GraphQLNonNull(GraphQLInt) },
        hasRoomService: { type: new GraphQLNonNull(GraphQLBoolean) },
        hasPool: { type: new GraphQLNonNull(GraphQLBoolean) },
        hasView: { type: new GraphQLNonNull(GraphQLBoolean) },
        number: { type: new GraphQLNonNull(GraphQLInt) }
    }
    return roomField;
}

const Room = new GraphQLObjectType({
    name: 'Room',
    fields: () => fieldsWrapper()
})

export const RoomPayload = new GraphQLObjectType({
    name: 'RoomPayload',
    fields: () => ({
        errors: {
            type: new GraphQLNonNull(
                new GraphQLList(new GraphQLNonNull(RoomError))
            ),
        },
        room: { type: Room }
    }),
});

export const RoomError = new GraphQLObjectType({
    name: 'RoomError',
    fields: () => ({
      message: {
        type: new GraphQLNonNull(GraphQLString),
      },
    }),
});


export const RoomInput = new GraphQLInputObjectType({
    name: 'RoomInput',
    fields: () => ({
        number: { type: new GraphQLNonNull(GraphQLInt) },
        floor: { type: GraphQLInt },
        hasRoomService: { type: GraphQLBoolean },
        hasView: { type: GraphQLBoolean },
        hasPool: { type: GraphQLBoolean }
    }),
});

export type RoomPayloadType = typeof RoomPayload;
export type RoomInputType = typeof RoomInput;
export type RoomType = typeof Room;

export default Room;