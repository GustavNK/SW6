import pgClient from './pg-client';
import sqls from './sqls';


export const pgApiWrapper = async () => {
    const { pgPool } = await pgClient();
    const pgQuery = (text: string, params = {}) =>
    pgPool.query(text, Object.values(params));
    return {
        queries: {
            usersInfo: async (userIds: readonly string[]) => {
                const pgResp = await pgQuery(sqls.usersFromIds,{$1: userIds});
                return userIds.map((userId: string) =>
                pgResp.rows.filter((row) => userId === row.userId)
                );
            },
        },
        mutators: {
            userCreate: async ( input ) => {
                console.log(input);

                const pgResp = await pgQuery(sqls.userInsert, {
                $1: input.username.toLowerCase(),
                $2: input.password,
                $3: input.firstName,
                $4: input.lastName,
                });
                
                return pgResp;
              },
        },
    };
};