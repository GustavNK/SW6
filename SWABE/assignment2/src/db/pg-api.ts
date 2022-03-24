import pgClient from './pg-client';
import sqls from './sqls';


export const pgApiWrapper = async () => {
    const { pgPool } = await pgClient();
    const pgQuery = (text, params = {}) =>
    pgPool.query(text, Object.values(params));

    return {
        queries: {
            usersInfo: async (userIds) => {
                console.log("Inside usersInfo");
                const pgResp = await pgQuery(sqls.userFromId,{
                    $1: userIds
                    });
                return userIds.map((userId) =>
                pgResp.rows.filter((row) => userId === row.userId)
                );
            },

            getAllUsers: async () => {
                console.log("Inside getAllUsers");
                const pgResp = await pgQuery(sqls.getAllUsers);
                return pgResp.rows;
            }
        },
        mutators: {
            userCreate: async ( input ) => {
                const payload = {user: ""};

                const pgResp = await pgQuery(sqls.userInsert, {
                $1: input.username.toLowerCase(),
                $2: input.firstName,
                $3: input.lastName,
                });
                if (pgResp.rows[0]) {
                    payload.user = pgResp.rows[0];
                  }
                return payload;
              },
        },
    };
};