import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

const firstNames = [
	"Aarav", "Vivaan", "Aditya", "Ishaan", "Krishna", "Rohan", "Aryan",
	"Isha", "Diya", "Ananya", "Tanvi", "Saanvi", "Kavya", "Sneha"
];
const lastNames = [
	"Sharma", "Mehta", "Reddy", "Patel", "Verma", "Gupta", "Kumar", "Joshi", "Bansal", "Nair"
];

function getRandom(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function generateTypingStat() {
	const timeLimit = [15, 30, 60][Math.floor(Math.random() * 3)];
	const device = Math.random() < 0.5 ? "desktop" : "mobile";
	const wpm = Math.floor(Math.random() * 50) + 35; // 35–85
	const acc = Math.floor(Math.random() * 10) + 90; // 90–99
	const charTyped = Math.floor(wpm * timeLimit * 5 / 60); // Estimate based on time
	const score = (wpm * 2) + acc + (charTyped * 0.5);

	return {
		timeLimit,
		device,
		wpm,
		acc,
		charTyped,
		score: parseFloat(score.toFixed(1)),
		updatedAt: new Date()
	};
}

export async function GET() {
	try {
		const client = await clientPromise;
		const db = client.db("godinotype");

		const users = [];

		for (let i = 0; i < 100; i++) {
			const firstName = getRandom(firstNames);
			const lastName = getRandom(lastNames);
			const name = `${firstName} ${lastName}`;
			const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}`;
			const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@gmail.com`;
			const gender = Math.random() > 0.5 ? "men" : "women";
			const image = `https://randomuser.me/api/portraits/${gender}/${Math.floor(Math.random() * 100)}.jpg`;

			users.push({
				username,
				name,
				email,
				image,
				stats: [generateTypingStat()],
			});
		}

		await db.collection("users").insertMany(users);

		return NextResponse.json({
			success: true,
			msg: "100 fake users inserted",
		});
	} catch (error) {
		console.error("Error generating users:", error);
		return NextResponse.json({
			success: false,
			msg: error.message || "Internal server error",
		}, { status: 500 });
	}
}
