"use client"

import React from "react";
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
		setQuote
	} = useTypingContext();

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

	return (
		<div className="main">

			<Navbar reset={reset} />

			{!isFinished ? <TypingSection /> : <ResultsSection reset={reset} />}

		</div>

	);
}
