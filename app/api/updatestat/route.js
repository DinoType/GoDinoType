import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function PUT(request) {
	try {
		const body = await request.json();
		const { username, wpm, acc, charTyped, testTime, device } = body;

		const client = await clientPromise;
		const db = client.db("dinotype");

		const userDoc = await db.collection("users").findOne({ username });
		if (!userDoc) {
			return NextResponse.json(
				{ success: false, msg: "User not found" },
				{ status: 404 }
			);
		}

		// Calculate score with weighted formula
		const score = (wpm * 2) + (acc * 1) + (charTyped * 0.5);

		// Initialize stats array if not exists
		let stats = userDoc.stats || [];

		// Check if a record for this time+device combo exists
		const existingIndex = stats.findIndex(
			(s) => s.timeLimit === testTime && s.device === device
		);

		const newStat = {
			timeLimit: testTime,
			device,
			wpm,
			acc,
			charTyped,
			score,
			updatedAt: new Date(),
		};

		let msg = "Score not higher. No update.";

		if (existingIndex === -1) {
			// No previous entry — add new stat
			stats.push(newStat);
			msg = "New leaderboard entry created!";
		} else if (score > stats[existingIndex].score) {
			// Replace old stat if new score is better
			stats[existingIndex] = newStat;
			msg = "New high score! Leaderboard updated.";
		}

		if (msg !== "Score not higher. No update.") {
			await db.collection("users").updateOne(
				{ username },
				{ $set: { stats } }
			);
		}

		return NextResponse.json({
			success: true,
			msg,
		});

	} catch (error) {
		console.error("PUT /update-stats error:", error);
		return NextResponse.json({
			status: 500,
			success: false,
			msg: error.message || "Something went wrong",
		});
	}
}
