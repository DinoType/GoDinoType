import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function PUT(request) {
	try {
		const body = await request.json();
		const { username, email } = body;

		const client = await clientPromise;
		const db = client.db("dinotype");

		// Check if user exists

		const usernameDoc = await db.collection("users").findOne({ username });
		if (usernameDoc) {
			return NextResponse.json(
				{ success: false, msg: "Username Taken" },
				{ status: 404 }
			);
		}

		const userDoc = await db.collection("users").findOne({ email });
		if (!userDoc) {
			return NextResponse.json(
				{ success: false, msg: "User not found" },
				{ status: 404 }
			);
		}

		const update = await db.collection("users").updateOne({ email }, { $set: { username } });

		if (update.acknowledged) {
			return NextResponse.json({
				status: 200,
				success: true,
				msg: "Username Updated Successfully"
			});
		}
		else {
			return NextResponse.json({
				status: 500,
				success: false,
				msg: "Something went wrong"
			});
		}

	} catch (error) {
		console.error("PUT /update-stats error:", error);
		return NextResponse.json({
			status: 500,
			success: false,
			msg: error.message || "Something went wrong",
		});
	}
}
