import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
	try {
		const { searchParams } = new URL(req.url); // ✅ Extract query parameters
		const page = parseInt(searchParams.get("page") || "1");
		const limit = 5;
		const skip = (page - 1) * limit;

		const client = await clientPromise;
		const db = client.db("dinotype");

		const leaderboard = await db.collection("users").aggregate([
			{ $unwind: "$stats" },
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
			{ $sort: { score: -1, updatedAt: -1 } },
			{ $skip: skip },
			{ $limit: limit },
			{
				$group: {
					_id: { timeLimit: "$timeLimit", device: "$device" },
					topUsers: { $push: "$$ROOT" }
				}
			}
		]).toArray();

		// Format into nested structure
		const formatted = {};

		for (const entry of leaderboard) {
			const time = `${entry._id.timeLimit}s`;
			const device = entry._id.device;

			if (!formatted[time]) formatted[time] = {};
			formatted[time][device] = entry.topUsers;
		}

		return NextResponse.json({ success: true, leaderboard: formatted });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ success: false, msg: "Error fetching leaderboard" }, { status: 500 });
	}
}
