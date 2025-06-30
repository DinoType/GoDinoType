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
			const res = await fetch(`https://dummyjson.com/quotes?limit=10&skip=${skip}`);
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

		// Step 1: Find the start of the current visible chunk
		let visibleStart = 0;
		let limit = 86;

		while (visibleStart + limit < quote.length && inputLength > visibleStart + limit) {
			// Move to next chunk
			visibleStart += limit;

			// Go back to last space (to not break word)
			while (quote[visibleStart] !== " " && visibleStart > 0) {
				visibleStart--;
			}
		}

		return quote.split("").map((char, i) => {
			let className = "untyped";

			if (i < input.length) {
				className = input[i] === char ? "correct" : "incorrect";
			} else if (i === input.length) {
				className = "active";
			}

			// Hide characters before visibleStart
			if (i < visibleStart) className += " hidden";

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
