import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
// //import { schema } from './schema/entry'; // Commented until local schema is no longer in use
import express = require("express");
// import cors from 'cors';
// import morgan =  require('morgan');
import * as config from './config';
import { pgApiWrapper } from './db/pg-api';
import DataLoader = require("dataloader");


let schema = buildSchema(
    `
    type Query {
        hello: String
    }
    `
);

// let root = {
//     hello: function() {
//         return "Hello World! poopoopeepee, haha, funny!"
//     }
// }

async function main(){
    const server = express();
    const pgApi = await pgApiWrapper();

    // server.use('/graphql', graphqlHTTP({
    //     schema: schema,
    //     rootValue: root,
    //     graphiql: true
    // }));

    // server.use(cors());
    // server.use(express.urlencoded({ extended: false }));
    // server.use(express.json());

    server.use('/graphql', (_, __) => {
        const loaders = {
          users: new DataLoader((userIds) => pgApi.queries.usersInfo(userIds))
        };
        graphqlHTTP({
          schema,
          context: { pgApi, loaders },
          graphiql: true,
          customFormatErrorFn: (err) => {
            const errorReport = {
              message: err.message,
              locations: err.locations,
              stack: err.stack ? err.stack.split('\n') : [],
              path: err.path,
            };
            console.error('GraphQL Error', errorReport);
            return config.isDev
              ? errorReport
              : { message: 'Oops! Something went wrong! :(' };
          },
        });
      });
    
      server.listen(config.PORT, () => {
        console.log(`Server URL: http://localhost:${config.PORT}/`);
      });
    
}


main();