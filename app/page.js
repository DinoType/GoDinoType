'use client'

import { useEffect, useState, useRef } from "react";

export default function TypingTest() {
	const [quote, setQuote] = useState("");
	const [input, setInput] = useState("");
	const inputRef = useRef(null);
	const charsRef = useRef([]);

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

	useEffect(() => {
		const focus = () => inputRef.current?.focus();
		window.addEventListener("click", focus);
		return () => window.removeEventListener("click", focus);
	}, []);

	useEffect(() => {
		const blockKeys = (e) => {
			if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
				e.preventDefault();
			}
		};

		window.addEventListener("keydown", blockKeys);
		return () => window.removeEventListener("keydown", blockKeys);
	}, []);

	const handleChange = (e) => {
		setInput(e.target.value);
	};

	const renderText = () => {
		const inputLength = input.length;
		const LINE_SIZE = 43;
		const NUM_VISIBLE_LINES = 3;
		const CHUNK_SIZE = LINE_SIZE * NUM_VISIBLE_LINES;

		let visibleStart = 0;

		// Move forward by 1 line (43 chars) each time input passes end of second line
		while (
			visibleStart + LINE_SIZE * 2 < quote.length &&
			inputLength > visibleStart + LINE_SIZE * 2
		) {
			visibleStart += LINE_SIZE;

			// Snap to previous word boundary for clean rendering
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

			// Hide characters outside the current visible chunk
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
		<div className="relative w-full h-screen bg-[#1a1a1a] font-mono flex items-center justify-center">

			<div className="words">
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
