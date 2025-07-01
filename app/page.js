'use client'

import { useEffect, useState, useRef } from "react";
import Image from 'next/image'

export default function TypingTest() {
	const [quote, setQuote] = useState("");
	const [input, setInput] = useState("");
	const inputRef = useRef(null);
	const charsRef = useRef([]);
	const wordsRef = useRef([]);
	const resultsRef = useRef(null);
	const timeLeftRef = useRef(null);
	const [testTime, setTestTime] = useState(30)
	const [isStarted, setIsStarted] = useState(false);
	const [isFinished, setIsFinished] = useState(false);
	const [timeLeft, setTimeLeft] = useState(testTime);
	const [wpm, setWpm] = useState(0);
	const [accuracy, setAccuracy] = useState(0);
	const [charTyped, setCharTyped] = useState(0);

	// Fetch quotes on mount
	useEffect(() => {
		async function fetchQuotes() {
			const skip = Math.floor(Math.random() * 1000);
			const res = await fetch(`https://dummyjson.com/quotes?limit=10&skip=${skip}`, {
				cache: "no-store",
			});
			const data = await res.json();
			const combined = data.quotes.map(q => q.quote).join(" ");
			setQuote(combined);
		}
		fetchQuotes();
	}, []);

	// Auto focus input on click anywhere
	useEffect(() => {
		const focus = () => inputRef.current?.focus();
		window.addEventListener("click", focus);
		return () => window.removeEventListener("click", focus);
	}, []);

	// Block arrow keys
	useEffect(() => {
		const blockKeys = (e) => {
			if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
				e.preventDefault();
			}
		};
		window.addEventListener("keydown", blockKeys);
		return () => window.removeEventListener("keydown", blockKeys);
	}, []);

	useEffect(() => {
		if (isFinished) {
			calculateResults(30, quote);
		}
	}, [isFinished])

	const calculateResults = (timeInSeconds, quote) => {
		const typed = input;
		const totalTypedChars = typed.length;
		setCharTyped(totalTypedChars);
		let correctChars = 0;

		for (let i = 0; i < typed.length; i++) {
			if (typed[i] === quote[i]) {
				correctChars++;
			}
		}

		const timeInMinutes = timeInSeconds / 60;
		const wordsTyped = correctChars / 5;
		const calculatedWPM = Math.round(wordsTyped / timeInMinutes);
		const calculatedAccuracy = Math.round((correctChars / totalTypedChars) * 100) || 0;

		setWpm(calculatedWPM);
		setAccuracy(calculatedAccuracy);
	};

	// Timer logic
	useEffect(() => {
		if (!isStarted) return;

		const interval = setInterval(() => {
			setTimeLeft(prev => {
				if (prev <= 1) {
					clearInterval(interval);
					setIsFinished(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [isStarted]);

	// Handle typing input
	const handleChange = (e) => {
		setInput(e.target.value);

		if (!isStarted && timeLeft > 0 && e.target.value.length > 0) {
			setIsStarted(true);
		}
	};

	const reset = () => {
		setIsStarted(false);
		setIsFinished(false);
		setTimeLeft(30);
		setInput("");
		setWpm(0);
		setAccuracy(0);
		setCharTyped(0);
	}

	// Render quote with classes
	const renderText = () => {
		const inputLength = input.length;
		const LINE_SIZE = 43;
		const NUM_VISIBLE_LINES = 3;
		const CHUNK_SIZE = LINE_SIZE * NUM_VISIBLE_LINES;

		let visibleStart = 0;

		while (
			visibleStart + LINE_SIZE * 2 < quote.length &&
			inputLength > visibleStart + LINE_SIZE * 2
		) {
			visibleStart += LINE_SIZE;
			while (quote[visibleStart] !== " " && visibleStart > 0) {
				visibleStart--;
			}
		}

		const renderEnd = visibleStart + CHUNK_SIZE;

		return quote.split("").map((char, i) => {
			let className = "untyped";

			if (i < input.length) {
				className = input[i] === char ? "correct" : "incorrect";
			} else if (i === input.length) {
				className = "active";
			}

			if (i < visibleStart || i >= renderEnd) {
				className += " hidden";
			}

			return (
				<span
					ref={(el) => (charsRef.current[i] = el)}
					key={i}
					className={className}
				>
					{char}
				</span>
			);
		});
	};

	return (
		<div className="relative w-full h-screen bg-[#1a1a1a] font-mono flex flex-col gap-4 items-center justify-center">

			{!isFinished && (
				<div className="relative w-full h-screen bg-[#1a1a1a] font-mono flex flex-col gap-4 items-center justify-center">
					<div ref={timeLeftRef} className="text-4xl text-green-400">{timeLeft}</div>

					<div className="words" ref={wordsRef}>
						{renderText()}
					</div>

					<input
						ref={inputRef}
						type="text"
						name="wordsInput"
						value={input}
						onChange={handleChange}
						autoFocus
						autoCapitalize="none"
						autoCorrect="off"
						autoComplete="off"
						spellCheck={false}
						className="wordsInput"
					/>
				</div>
			)}

			{isFinished && (
				<div className="flex flex-col gap-20 items-center justify-center" ref={resultsRef}>
					<div className="results">
						<div id="wpm" className="flex flex-col gap-0">
							<h2 className="text-[2rem] text-gray-600">wpm</h2>
							<p className="text-[4rem] text-green-400">{wpm}</p>
						</div>
						<div id="acc">
							<h2 className="text-[2rem] text-gray-600">acc</h2>
							<p className="text-[4rem] text-green-400">{accuracy}%</p>
						</div>
						<div id="char">
							<h2 className="text-[2rem] text-gray-600">char</h2>
							<p className="text-[4rem] text-green-400">{charTyped}</p>
						</div>
					</div>
					<button className="cursor-pointer" onClick={reset}>
						<span className="material-symbols-outlined resetIcon">
							autorenew
						</span>
					</button>
				</div>
			)}

		</div>
	);
}
