import pgClient from './pg-client';



export const pgApiWrapper = async () => {
    const { pgPool } = await pgClient();
    const pgQuery = (text: string, params = {}) =>
    pgPool.query(text, Object.values(params));
    return {
        queries: {
            usersInfo: async (userIds: string[]) => {
                const pgResp = await pgQuery(
                    `
                    `
                );
                return userIds.map((userId: string) =>
                pgResp.rows.find((row: any) => userId === row.id)
                );
            },
        },
        mutators: {
            
        },
    };
};