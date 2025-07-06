import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
	try {
		const { searchParams } = new URL(req.url);
		const email = searchParams.get("email"); // Change here to email if fetching by email

		if (!email) {
			return NextResponse.json({ success: false, msg: "Email is required" }, { status: 400 });
		}

		const client = await clientPromise;
		const db = client.db("godinotype");

		const user = await db.collection("users").findOne({ email: email });

		if (!user) {
			return NextResponse.json({ success: false, msg: "User not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, user: user }, { status: 200 });
	}
	catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
