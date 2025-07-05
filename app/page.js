"use client"

import React, { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useTypingContext } from "@/app/context/TypingContext";
import Navbar from "@/components/Navbar";
import TypingSection from "@/components/TypingSection";
import ResultsSection from "@/components/ResultsSection";
import { fetchQuotes } from "@/lib/fetchQuotes";

export default function TypingTest() {

	const {
		setInput,
		setIsStarted,
		isFinished, setIsFinished,
		setTestTime,
		setTimeLeft,
		setWpm,
		setAccuracy,
		setCharTyped,
		setQuote,
		username, setUsername
	} = useTypingContext();

	const { data: session, status } = useSession()

	const reset = () => {
		setIsStarted(false);
		setIsFinished(false);
		setTimeLeft(30);
		setTestTime(30)
		setInput("");
		setWpm(0);
		setAccuracy(0);
		setCharTyped(0);
		fetchQuotes(setQuote);
	}

	useEffect(() => {
		const fetchAndSetUsername = async () => {
			if (session?.user?.email) {
				try {
					const res = await fetch(`/api/get-username?email=${session.user.email}`);
					const data = await res.json();
					if (data.success) {
						setUsername(data.username);
					} else {
						setUsername(null);
					}
				} catch (err) {
					console.error("Error fetching username:", err);
					setUsername(null);
				}
			} else {
				// User logged out
				setUsername(null);
			}
		};

		fetchAndSetUsername();
	}, [session, setUsername]); // trigger whenever session changes

	return (
		<div className="main">

			<Navbar reset={reset} />

			{!isFinished ? <TypingSection /> : <ResultsSection reset={reset} />}

		</div>

	);
}
