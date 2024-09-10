import { type LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/services/auth.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const authenticator = getAuthenticator(context);
	const user = await authenticator.isAuthenticated(request);
	if (!user) return redirect("/login");

	return redirect(`/user/${user.profileId}`);
};
