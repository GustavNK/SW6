import Reservation from '../schema/types/reservation';
import pgClient from './pg-client';
import sqls from './sqls';


export const pgApiWrapper = async () => {
    const { pgPool } = await pgClient();
    const pgQuery = (text, params = {}) =>
        pgPool.query(text, Object.values(params));

    return {
        setup: {
            createUserTable: async () => {
                pgPool.connect();
                const pgResp = await pgQuery(sqls.createUserTable);
                return pgResp.rows;
            },
            createRoomTable: async () => {
                const pgResp = await pgQuery(sqls.createRoomTable);
                return pgResp.rows;
            },
            createReservationTable: async () => {
                const pgResp = await pgQuery(sqls.createResevationsTable);
                return pgResp.rows;
            },
            insertData: async () => {
                pgPool.connect();
                try {
                    await pgQuery(sqls.createDummyUsers);
                    console.log('Inserted dummy Users');
                    await pgQuery(sqls.createDummyRooms);
                    console.log('Inserted dummy Rooms');
                    await pgQuery(sqls.createDummyReservations);
                    console.log('Inserted dummy Reservations');
                } catch (error) {
                    console.log(error);
                }
            },

        },
        queries: {
            /*
                USER QUERIES
            */
            usersInfo: async (userIds: readonly number[]) => {
                const pgResp = await pgQuery(sqls.userFromId, {
                    $1: userIds.join(', ')
                });
                return userIds.map((userId) =>
                    pgResp.rows.find((row) => userId === row.id)
                );
            },
            getAllUsers: async () => {
                return (await pgQuery(sqls.getAllUsers)).rows;
            },
            /*
                RESERVATION QUERIES
            */
            getReservation: async (reservationIds: readonly number[]) => {
                const pgResp = await pgQuery(sqls.reservationFromId, {
                    $1: reservationIds.join(', ')
                })
                return reservationIds.map(resId =>
                    pgResp.rows.find(row => row.id === resId))
            },
            getAllReservations: async () => {
                return (await pgQuery(sqls.getAllReservations)).rows;
            },
            getAllReservationInTimespan: async (start: readonly string[], end: readonly string[]) => {
                const pgResp = await pgQuery(sqls.reservationInterval, {
                    $1: start[0],
                    $2: end[0]
                })
            },
            /*
                ROOM QUERIES
            */
            getRoom: async (roomIds: readonly number[]) => {
                const pgResp = await pgQuery(sqls.roomFromId, {
                    $1: roomIds.join(',')
                })
                return roomIds.map(roomId =>
                    pgResp.rows.find(row => row.id === roomId))
            },
            getAllRooms: async () => {
                return (await pgQuery(sqls.getAllRooms)).rows;
            },
        },
        mutators: {
            userCreate: async (input) => {
                const payload = { user: "" };

                const pgResp = await pgQuery(sqls.userInsert, {
                    $1: input.username.toLowerCase(),
                    $2: input.firstName + ' ' + input.lastName
                });
                if (pgResp.rows[0]) {
                    payload.user = pgResp.rows[0];
                }
                return payload;
            },
            roomCreate: async (input) => {

            },
            reservationCreate: async (input) => {

            }
        },
    };
};