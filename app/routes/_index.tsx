import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
	return [
		{ title: "Remix Bookmark" },
		{
			name: "description",
			content: "Welcome to Remix on Cloudflare!",
		},
	];
};

export default function Index() {
	return (
		<>
			<section className="flex flex-row items-center justify-center mt-4">
				<h1 className="text-2xl font-bold">Home</h1>
			</section>
			<section className="flex flex-row items-center justify-center mt-4">
				<a href="/login">Login</a>
			</section>
		</>
	);
}
