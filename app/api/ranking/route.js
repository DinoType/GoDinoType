import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
	try {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1");
		const time = parseInt(searchParams.get("time"));
		const device = searchParams.get("device");
		const limit = 50;
		const skip = (page - 1) * limit;

		const client = await clientPromise;
		const db = client.db("dinotype");

		const matchStage = {
			$match: {
				"stats.timeLimit": time,
				"stats.device": device,
			},
		};

		const totalCount = await db.collection("users").aggregate([
			{ $unwind: "$stats" },
			matchStage,
			{ $count: "count" },
		]).toArray();

		const total = totalCount[0]?.count || 0;

		const pipeline = [
			{ $unwind: "$stats" },
			matchStage,
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
					updatedAt: "$stats.updatedAt",
				},
			},
			{ $sort: { score: -1, updatedAt: -1 } },
			{ $skip: skip },
			{ $limit: limit },
		];

		const users = await db.collection("users").aggregate(pipeline).toArray();

		// Add rank to each user (based on pagination)
		const rankedUsers = users.map((user, index) => ({
			...user,
			rank: skip + index + 1, // rank starts from 1, continues across pages
		}));

		return NextResponse.json({
			success: true,
			ranking: rankedUsers,
			total,
			limit,
			currentPage: page,
		});
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ success: false, msg: "Error fetching leaderboard" },
			{ status: 500 }
		);
	}
}
