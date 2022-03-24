import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { schema } from './schema/entry';
import express = require("express");
import cors from 'cors';
import * as config from './config';
import { pgApiWrapper } from './db/pg-api';
import DataLoader = require("dataloader");
import morgan from 'morgan';

async function main() {
	const server = express();
	const pgApi = await pgApiWrapper();

  server.use(cors());
  server.use(morgan('dev'));
  server.use(express.urlencoded({ extended: false }));
  server.use(express.json());
  server.use('/:fav.ico', (req, res) => res.sendStatus(204));

	server.use('/graphql', async (req, res) => {
		const loaders = {
			userInfo: new DataLoader((userId) => 
				pgApi.queries.usersInfo(userId)
			),
		};
		const mutators = {
			...pgApi.mutators
		}
		graphqlHTTP({
			schema,
			context: { loaders, mutators, pgApi },
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
					: { message: 'Oops Woopsie! Sumthing wuent veery bad! :(' };
			},
		})(req, res);
	});

	server.listen(config.PORT, () => {
		console.log(`Server URL: http://localhost:${config.PORT}/`);
	});

}


main();