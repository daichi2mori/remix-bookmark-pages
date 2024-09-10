import { type ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/services/auth.server";

export const loader = () => redirect("/login");

export const action = ({ request, context }: ActionFunctionArgs) => {
	const authenticator = getAuthenticator(context);
	return authenticator.authenticate("google", request, {
		successRedirect: "/user",
		failureRedirect: "/login",
	});
};
