'use client'

import { useEffect, useState, useRef } from "react";
import { splitLines } from "@/lib/splitLines";

export default function TypingTest() {
	const [quote, setQuote] = useState("");
	const [input, setInput] = useState("");
	const [lines, setLines] = useState([]);
	const inputRef = useRef(null);
	const charsRef = useRef([]);
	const linesRef = useRef([]);

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

	// Run splitLines once quote is available
	useEffect(() => {
		if (quote.length > 0) {
			const newLines = splitLines(quote, 46);
			setLines(newLines);
			console.log(newLines);
		}
	}, [quote]);

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
		return quote.split("").map((char, i) => {
			let className = "untyped";

			if (i < input.length) {
				className = input[i] === char ? "correct" : "incorrect";
			} else if (i === input.length) {
				className = "active";
			}

			return (
				<span ref={(el) => (charsRef.current[i] = el)} key={i} className={`${className}`}>
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
