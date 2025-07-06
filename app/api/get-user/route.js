import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
	try {
		const { searchParams } = new URL(req.url);
		const email = searchParams.get("email");
		const username = searchParams.get("username");

		if (!email && !username) {
			return NextResponse.json(
				{ success: false, msg: "Email or username is required" },
				{ status: 400 }
			);
		}

		const client = await clientPromise;
		const db = client.db("godinotype");

		let query = {};
		if (email) {
			query.email = email;
		} else {
			query.username = username;
		}

		const user = await db.collection("users").findOne(query);

		if (!user) {
			return NextResponse.json(
				{ success: false, msg: "User not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, user }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
