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

		const query = email ? { email } : { username };

		// Use minimal projection for email-based fetch
		const projection = email
			? {
				username: 1,
				bio: 1,
				github: 1,
				twitter: 1,
				linkedin: 1,
			}
			: {
				username: 1,
				name: 1,
				email: 1,
				bio: 1,
				image: 1,
				github: 1,
				linkedin: 1,
				twitter: 1,
				stats: 1,
			};

		const user = await db.collection("users").findOne(query, { projection });

		if (!user) {
			return NextResponse.json(
				{ success: false, msg: "User not found" },
				{ status: 404 }
			);
		}

		// If requested by email, return minimal fields directly
		if (email) {
			return NextResponse.json({ success: true, user }, { status: 200 });
		}

		// If no stats, return early for username-based request
		if (!user.stats || user.stats.length === 0) {
			return NextResponse.json({
				success: true,
				user,
				ranks: {},
				bestCategory: null,
			});
		}

		// Calculate ranks for all categories in parallel
		const ranksPromises = user.stats.map(async (stat) => {
			const { device, timeLimit, score, updatedAt } = stat;

			const betterCount = await db.collection("users").aggregate([
				{ $unwind: "$stats" },
				{
					$match: {
						"stats.device": device,
						"stats.timeLimit": timeLimit,
						$or: [
							{ "stats.score": { $gt: score } },
							{
								$and: [
									{ "stats.score": score },
									{ "stats.updatedAt": { $gt: updatedAt } },
								],
							},
						],
					},
				},
				{ $count: "count" },
			]).toArray();

			const rank = (betterCount[0]?.count || 0) + 1;
			const key = `${device}:${timeLimit}`;

			return { key, rank, stat };
		});

		const ranksResults = await Promise.all(ranksPromises);

		const ranks = {};
		let bestCategory = null;
		let bestRank = Number.MAX_SAFE_INTEGER;

		for (const { key, rank, stat } of ranksResults) {
			ranks[key] = rank;
			if (rank < bestRank) {
				bestRank = rank;
				bestCategory = { category: key, rank, details: stat };
			}
		}

		return NextResponse.json({
			success: true,
			user,
			ranks,
			bestCategory,
		});
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ success: false, msg: "Error fetching user data" },
			{ status: 500 }
		);
	}
}
