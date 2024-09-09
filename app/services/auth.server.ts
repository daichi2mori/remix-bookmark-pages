import {
	type AppLoadContext,
	createCookie,
	createWorkersKVSessionStorage,
} from "@remix-run/cloudflare";
import { users } from "db/schema";
import { type InferInsertModel, eq } from "drizzle-orm";
import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { createClientDB } from "./db.server";

type AuthUser = {
	id: number;
	profileId: string;
	iconUrl: string | null;
	displayName: string;
};

type CreateUser = InferInsertModel<typeof users>;

let _authenticatedUser: Authenticator<AuthUser> | null = null;

export const getAuthenticator = (context: AppLoadContext) => {
	if (!_authenticatedUser) {
		const cookie = createCookie("__session", {
			sameSite: "lax",
			path: "/",
			httpOnly: true,
			secrets: [context.cloudflare.env.SESSION_SECRET],
			secure: import.meta.env.PROD,
		});

		const sessionStorage = createWorkersKVSessionStorage({
			kv: context.cloudflare.env.generalKV,
			cookie,
		});

		_authenticatedUser = new Authenticator<AuthUser>(sessionStorage);

		const googleAuth = new GoogleStrategy(
			{
				clientID: context.cloudflare.env.GOOGLE_AUTH_CLIENT_ID,
				clientSecret: context.cloudflare.env.GOOGLE_AUTH_CLIENT_SECRET,
				callbackURL: `${context.cloudflare.env.GOOGLE_AUTH_CALLBACK_URL}/auth/google/callback`,
			},
			async ({ profile }) => {
				const db = createClientDB(context.cloudflare.env.DB);
				const user = await db
					.select()
					.from(users)
					.where(eq(users.profileId, profile.id))
					.get();
				if (user) return user;

				const newUser: CreateUser = {
					profileId: profile.id,
					iconUrl: profile.photos?.[0].value || null,
					displayName: profile.displayName,
					createdAt: new Date(),
				};

				const ret = await db.insert(users).values(newUser).returning().get();

				return {
					id: ret.id,
					profileId: profile.id,
					iconUrl: profile.photos?.[0].value || null,
					displayName: profile.displayName,
					createdAt: new Date(),
				};
			},
		);

		_authenticatedUser.use(googleAuth);
	}

	return _authenticatedUser;
};
