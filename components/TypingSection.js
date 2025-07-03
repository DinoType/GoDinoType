// components/TypingSection.jsx
"use client";

import React, { useEffect } from "react";
import Timer from "@/components/Timer";
import RenderText from "@/components/RenderText";
import TypingInput from "@/components/TypingInput";
import { fetchQuotes } from "@/lib/fetchQuotes";
import { useTypingContext } from "@/app/context/TypingContext";

export default function TypingSection() {

	const {
		setQuote, wordsRef,
	} = useTypingContext();

	useEffect(() => {
		fetchQuotes(setQuote);
	}, []);

	return (
		<div className="typing-container">
			<Timer />
			<div className="words" ref={wordsRef}>
				<RenderText/>
			</div>
			<TypingInput />
		</div>
	);
}
