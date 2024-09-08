import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: integer("id").primaryKey().notNull(),
	profileId: text("profileId").notNull(),
	iconUrl: text("iconUrl"),
	displayName: text("displayName").notNull(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});
