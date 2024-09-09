import { drizzle } from "drizzle-orm/d1";

export const createClientDB = (db: D1Database) => {
	return drizzle(db);
};
