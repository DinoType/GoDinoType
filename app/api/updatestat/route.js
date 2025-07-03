import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function PUT(request) {
	try {
		const body = await request.json();
		const { username, wpm, acc, charTyped, testTime } = body;

		const client = await clientPromise;
		const db = client.db("dinotype");

		const userDoc = await db.collection("users").findOne({ username });

		if (!userDoc) {
			return NextResponse.json(
				{ success: false, msg: "User not found" },
				{ status: 404 }
			);
		}

		// Normalize stats for 30s base
		const normalizedWpm = (wpm * 30) / testTime;
		const normalizedCharTyped = (charTyped * 30) / testTime;
		const score = (normalizedWpm * 2) + (acc * 1) + (normalizedCharTyped * 0.5);

		const currentBestScore = userDoc.userStats?.score || 0;

		// Update only if this score is higher
		if (score > currentBestScore) {
			await db.collection("users").updateOne(
				{ username },
				{
					$set: {
						userStats: {
							wpm,
							acc,
							charTyped,
							testTime,
							score,
							updatedAt: new Date()
						}
					}
				}
			);
		}

		return NextResponse.json({
			status: 200,
			success: true,
			msg: score > currentBestScore
				? "New high score! Stats updated."
				: "Score not higher than previous. No update."
		});
		
	} catch (error) {
		console.error("PUT /update-stats error:", error);
		return NextResponse.json({
			status: 500,
			success: false,
			msg: error.message || "Something went wrong"
		});
	}
}
