import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const client = await clientPromise;
		const db = client.db("dinotype");

		const leaderboard = await db.collection("users").aggregate([
			{ $unwind: "$stats" }, // break array
			{
				$project: {
					username: 1,
					name: 1,
					image: 1,
					wpm: "$stats.wpm",
					acc: "$stats.acc",
					score: "$stats.score",
					charTyped: "$stats.charTyped",
					timeLimit: "$stats.timeLimit",
					device: "$stats.device",
					updatedAt: "$stats.updatedAt"
				}
			},
			{ $sort: { score: -1, updatedAt: -1 } }, // sort high scores first
			{
				$group: {
					_id: { timeLimit: "$timeLimit", device: "$device" },
					topUsers: { $push: "$$ROOT" } // group into array
				}
			}
		]).toArray();

		// Format into nested structure
		const formatted = {};

		for (const entry of leaderboard) {
			const time = `${entry._id.timeLimit}s`;
			const device = entry._id.device;

			if (!formatted[time]) formatted[time] = {};
			formatted[time][device] = entry.topUsers.slice(0, 10); // Top 10
		}

		return NextResponse.json({ success: true, leaderboard: formatted });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ success: false, msg: "Error fetching leaderboard" }, { status: 500 });
	}
}
