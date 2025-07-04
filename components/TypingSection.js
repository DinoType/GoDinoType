// components/TypingSection.jsx
"use client";

import React, { useEffect } from "react";
import Timer from "@/components/Timer";
import RenderText from "@/components/RenderText";
import TypingInput from "@/components/TypingInput";
import { fetchQuotes } from "@/lib/fetchQuotes";
import { useTypingContext } from "@/app/context/TypingContext";
import { useSession, signIn } from "next-auth/react";
import { login } from "@/lib/login";

export default function TypingSection() {

	const {
		setQuote, wordsRef,
	} = useTypingContext();

	const { data: session, status } = useSession()

	useEffect(() => {
		fetchQuotes(setQuote);
	}, []);

	return (
		<div className="typing-container">
			<Timer />
			<div className="words" ref={wordsRef}>
				<RenderText />
			</div>
			{!session && (
				<div className="signInMsg mt-4">
					<span className="mr-1">🎯</span>
					<button className="underline cursor-pointer font-medium" onClick={login}>
						Sign in
					</button>
					<span> to save your score and appear on the leaderboard</span>
				</div>
			)}

			<TypingInput />
		</div>
	);
}
