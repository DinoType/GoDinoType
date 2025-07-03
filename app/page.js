"use client"

import React from 'react'
import { useTypingContext } from '@/app/context/TypingContext';
import { useEffect, useState, useRef } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { fetchQuotes } from "@/lib/fetchQuotes";
import { calculateResults } from "@/lib/calculateResults";
import CountUp from "@/components/ui/countup";
import Navbar from '@/components/Navbar';
import Timer from '@/components/Timer';
import RenderText from '@/components/RenderText';
import TypingInput from '@/components/TypingInput';

export default function TypingTest() {

	const {
		quote, setQuote,
		input, setInput,
		inputRef,
		charsRef,
		wordsRef,
		resultsRef,
		timeLeftRef,
		testTime, setTestTime,
		isStarted, setIsStarted,
		isFinished, setIsFinished,
		timeLeft, setTimeLeft,
		wpm, setWpm,
		accuracy, setAccuracy,
		charTyped, setCharTyped
	} = useTypingContext();

	// Fetch quotes on mount
	useEffect(() => {
		fetchQuotes(setQuote);
	}, [isFinished]);

	useEffect(() => {
		if (isFinished) {
			calculateResults(testTime, quote, input, setWpm, setAccuracy, setCharTyped);
		}
	}, [isFinished])

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

			{!isFinished && (
				<div className="typing-container">

					<Timer
						isStarted={isStarted}
						testTime={testTime}
						setTestTime={setTestTime}
						timeLeft={timeLeft}
						setTimeLeft={setTimeLeft}
						timeLeftRef={timeLeftRef}
						setIsFinished={setIsFinished}
					/>

					<div className="words" ref={wordsRef}>
						<RenderText quote={quote} input={input} charsRef={charsRef} />
					</div>

					<TypingInput inputRef={inputRef} input={input} setInput={setInput} isStarted={isStarted} setIsStarted={setIsStarted} timeLeft={timeLeft} />

				</div>
			)}

			{isFinished && (
				<div className="results-container" ref={resultsRef}>
					<div className="results">
						<div id="wpm" className="flex flex-col gap-0">
							<h2 className="heading">wpm</h2>
							<CountUp
								from={0}
								to={wpm}
								separator=","
								direction="up"
								duration={1}
								className="count-up-text stat"
							/>
						</div>
						<div id="acc">
							<h2 className="heading">acc</h2>
							<CountUp
								from={0}
								to={accuracy}
								separator=","
								direction="up"
								duration={1}
								className="count-up-text stat"
							/><span className="text-2xl text-gray-600"> %</span>
						</div>
						<div id="char">
							<h2 className="heading">char</h2>
							<CountUp
								from={0}
								to={charTyped}
								separator=","
								direction="up"
								duration={1}
								className="count-up-text stat"
							/>
						</div>
					</div>
					<div className="buttons">
						<button onClick={reset}>
							<span className="material-symbols-outlined icon">autorenew</span>
						</button>
						<button >
							<span className="material-symbols-outlined icon">share</span>
						</button>
					</div>
					<BackgroundBeams />
				</div>
			)}
		</div>

	);
}
