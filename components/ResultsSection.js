// components/ResultsSection.jsx
"use client";

import React, { useEffect } from "react";
import { useTypingContext } from "@/app/context/TypingContext";
import { calculateResults } from "@/lib/calculateResults";
import CountUp from "@/components/ui/countup";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function ResultsSection({ reset }) {
	const {
		quote,
		input,
		resultsRef,
		testTime,
		isFinished,
		wpm, setWpm,
		accuracy, setAccuracy,
		charTyped, setCharTyped
	} = useTypingContext();

	useEffect(() => {
		if (isFinished) {
			calculateResults(testTime, quote, input, setWpm, setAccuracy, setCharTyped);
		}
	}, [isFinished]);

	return (
		<div className="results-container" ref={resultsRef}>
			<div className="results">
				<div id="wpm" className="flex flex-col gap-0">
					<h2 className="heading">wpm</h2>
					<CountUp from={0} to={wpm} duration={1} className="count-up-text stat" />
				</div>
				<div id="acc">
					<h2 className="heading">acc</h2>
					<CountUp from={0} to={accuracy} duration={1} className="count-up-text stat" />
					<span className="text-2xl text-gray-600"> %</span>
				</div>
				<div id="char">
					<h2 className="heading">char</h2>
					<CountUp from={0} to={charTyped} duration={1} className="count-up-text stat" />
				</div>
			</div>
			<div className="buttons">
				<button onClick={reset}>
					<span className="material-symbols-outlined icon">autorenew</span>
				</button>
				<button>
					<span className="material-symbols-outlined icon">share</span>
				</button>
			</div>
			<BackgroundBeams />
		</div>
	);
}
