"use client"

import React from "react";
import { useTypingContext } from "@/app/context/TypingContext";
import Navbar from "@/components/Navbar";
import TypingSection from "@/components/TypingSection";
import ResultsSection from "@/components/ResultsSection";

export default function TypingTest() {

	const {
		setInput,
		setIsStarted,
		isFinished, setIsFinished,
		setTimeLeft,
		setWpm,
		setAccuracy,
		setCharTyped
	} = useTypingContext();

	const reset = () => {
		setIsStarted(false);
		setIsFinished(false);
		setTimeLeft(30);
		setInput("");
		setWpm(0);
		setAccuracy(0);
		setCharTyped(0);
	}

	return (
		<div className="main">

			<Navbar reset={reset} />

			{!isFinished ? <TypingSection /> : <ResultsSection reset={reset} />}

		</div>

	);
}
