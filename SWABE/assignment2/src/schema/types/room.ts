import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLInt,
} from 'graphql';

const fieldsWrapper = () => {
    const roomField = {
        id: {type: new GraphQLNonNull(GraphQLID)}, 
        number:{type: new GraphQLNonNull(GraphQLInt)}
    }
    return roomField;
}

const Room = new GraphQLObjectType({
    name: 'Room',
    fields: () => fieldsWrapper()
})

export type RoomType = typeof Room

export default Room