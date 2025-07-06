// /api/update-user.ts or .js
import clientPromise from "@/lib/mongodb";

export async function PUT(req) {
	try {
		const body = await req.json();
		const { email, username, bio, github, twitter, linkedin } = body;

		const client = await clientPromise;
		const db = client.db("godinotype");
		const users = db.collection("users");

		await users.updateOne(
			{ email },
			{
				$set: {
					username,
					bio,
					github,
					twitter,
					linkedin,
				},
			},
			{ upsert: true }
		);

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ success: false, msg: "Internal server error" }), { status: 500 });
	}
}
