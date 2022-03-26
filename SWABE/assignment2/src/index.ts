import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { schema } from "./schema/entry";
import express = require("express");
import cors from "cors";
import * as config from "./config";
import { pgApiWrapper } from "./db/pg-api";
import DataLoader = require("dataloader");
import morgan from "morgan";

async function main() {
	const server = express();
	const pgApi = await pgApiWrapper();

	await pgApi.setup.createUserTable();
	console.log('User table created');
	await pgApi.setup.createRoomTable();
	console.log('Room table created');
	await pgApi.setup.createReservationTable();
	console.log('Reservation table created');
	/*
		ONLY USE WHEN FIRST TIME
	*/
	 
	if (!((await pgApi.queries.getAllUsers()).length)){
		await pgApi.setup.insertData();
		console.log('Inserted dummy data');
	}
	


	server.use(cors());
	//server.use(morgan("dev"));
	server.use(express.urlencoded({ extended: false }));
	server.use(express.json());
	//server.use("/:fav.ico", (req, res) => res.sendStatus(204));

	server.use("/graphql", async (req, res) => {
		const loaders = {
			getUser: new DataLoader((userId: readonly number[]) => {
				return pgApi.queries.getUser(userId)
			}),
			getReservation: new DataLoader((reservationId: readonly number[]) => {
				return pgApi.queries.getReservation(reservationId)
			}),
			getRoom: new DataLoader((roomId: readonly number[]) => {
				return pgApi.queries.getRoom(roomId)
			}),
			reservationsForUser: new DataLoader((userId: readonly number[]) => {
				return pgApi.queries.getReservationsByUser(userId)
			})
		};
		const mutators = {
			...pgApi.mutators,
		};
		graphqlHTTP({
			schema,
			context: { loaders, mutators, pgApi },
			graphiql: true,
			customFormatErrorFn: (err) => {
				const errorReport = {
					message: err.message,
					locations: err.locations,
					stack: err.stack ? err.stack.split("\n") : [],
					path: err.path,
				};
				console.error("GraphQL Error", errorReport);
				return config.isDev
					? errorReport
					: { message: "Oops Woopsie! Sumthing wuent veery bad! :(" };
			},
		})(req, res);
	});

	server.listen(config.PORT, () => {
		console.log(`Server URL: http://localhost:${config.PORT}/`);
	});
}

main();
