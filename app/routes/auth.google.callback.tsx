import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/services/auth.server";

export const loader = ({ request, context }: LoaderFunctionArgs) => {
	const authenticator = getAuthenticator(context);
	return authenticator.authenticate("google", request, {
		successRedirect: "/",
		failureRedirect: "/login",
	});
};
