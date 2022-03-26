import Reservation, { ReservationType } from '../schema/types/reservation';
import pgClient from './pg-client';
import sqls from './sqls';


export const pgApiWrapper = async () => {
    const { pgPool } = await pgClient();
    const pgQuery = (text, params = {}) =>
        pgPool.query(text, Object.values(params));

    return {
        setup: {
            createUserTable: async () => {
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
            getUser: async (userIds: readonly number[]) => {
                const pgResp = await pgQuery(sqls.userFromId, {
                    $1: userIds
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
                    $1: reservationIds
                })
                return reservationIds.map(resId =>
                    pgResp.rows.find(row => row.id === resId))
            },
            getAllReservations: async () => {
                return (await pgQuery(sqls.getAllReservations)).rows;
            },
            getReservationsByUser: async (userIds: readonly number[]) => {
                const pgResp = await pgQuery(sqls.reservationsFromUser,{
                    $1: userIds
                })
               return userIds.map<ReservationType>(userId =>
                    pgResp.rows.filter(row => row.createdByUser === userId));
            },
            getAllReservationInTimespan: async (start: string, end: string) => {
                const pgResp = await pgQuery(sqls.reservationInterval, {
                    $1: start,
                    $2: end
                })
                console.log(pgResp.rows);
                return pgResp.rows || [];
            },
            /*
                ROOM QUERIES
            */
            getRoom: async (roomIds: readonly number[]) => {
                const pgResp = await pgQuery(sqls.roomFromId, {
                    $1: roomIds
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
                const payload = {room: ""};
                const pgResp = await pgQuery(sqls.createNewRoom, {
                    $1: input.number,
                    $2: input.floor,
                    $3: input.hasRoomService,
                    $4: input.hasView,
                    $5: input.hasPool
                });
                if(pgResp.rows[0]){
                    payload.room = pgResp.rows[0];
                }
                return payload;
            },
            reservationCreate: async (input) => {
                const payload = {reservation: ""};
                const pgResp = await pgQuery(sqls.createNewReservation,{
                    $1: input.createdByUser,
                    $2: input.reservedRoom,
                    $3: input.startDate,
                    $4: input.endDate
                });
                if(pgResp.rows[0]){
                    payload.reservation = pgResp.rows[0];
                }
                return payload;
            }

        }
    };
};