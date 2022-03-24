import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean,
} from 'graphql';

const fieldsWrapper = () => {
    const roomField = {
        id:             {type: new GraphQLNonNull(GraphQLID)},
        floor:          {type: GraphQLInt},
        hasRoomService: {type: GraphQLBoolean},
        hasPool:        {type: GraphQLBoolean},
        hasView:        {type: GraphQLBoolean},
        number:         {type: new GraphQLNonNull(GraphQLInt)}
    }
    return roomField;
}

const Room = new GraphQLObjectType({
    name: 'Room',
    fields: () => fieldsWrapper()
})

export type RoomType = typeof Room

export default Room