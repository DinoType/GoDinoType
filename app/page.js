'use client'

import { useEffect, useState, useRef } from "react";

export default function TypingTest() {
	const [quote, setQuote] = useState("");
	const [input, setInput] = useState("");
	const inputRef = useRef(null);
	const charsRef = useRef([]);
	const wordsRef = useRef([]);
	const [isStarted, setIsStarted] = useState(false);
	const [isFinished, setIsFinished] = useState(false);
	const [timeLeft, setTimeLeft] = useState(30);
	const [wpm, setWpm] = useState(0);
	const [accuracy, setAccuracy] = useState(0);

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
			<div className="text-4xl text-green-400">{timeLeft}</div>

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
	);
}
