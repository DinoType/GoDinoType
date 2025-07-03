'use client'

import { useEffect, useState, useRef } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import CountUp from "@/components/ui/countup";
import Image from 'next/image'
import Link from "next/link";

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
	}, [isFinished]);

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
		<div className="main">

			<nav className="navbar">
				<Link href="/" onClick={reset} className="logo">
					<Image src="/logo.svg" width={50} height={50} alt="Logo" />
					<p>DinoType</p>
				</Link>
				<div className="links">
					<Link href="/" className="link">
						<span className="material-symbols-outlined icon">keyboard</span>
					</Link>
					<Link href="/leaderboard" className="link">
						<span className="material-symbols-outlined icon">crown</span>
					</Link>
					<Link href="/login" className="link">
						<span className="material-symbols-outlined icon">person</span>
					</Link>
				</div>
			</nav>

			{!isFinished && (
				<div className="typing-container">
					<div ref={timeLeftRef} className="timer">{timeLeft}</div>

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
