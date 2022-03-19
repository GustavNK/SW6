import { graphqlHTTP } from 'express-graphql';
import { Request, Response } from 'express'
const server = require('express')();
import { schema } from './schema/room';
require('dotenv').config();

async function main(){
    server.use(
        '/graphql',
        graphqlHTTP({
          schema,
          graphiql: true,
        })
      );

      server.use('/', (_:Request, res: Response) => {
        res.send('Hello from demo 5e');
      });
    
      server.listen(process.env.PORT, () => {
        console.log(`Server URL: http://localhost:${process.env.PORT}/`);
      });
}

main();