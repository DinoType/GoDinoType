'use client'

import { useEffect, useState, useRef } from "react";

export default function TypingTest() {
	const [quote, setQuote] = useState("");
	const [input, setInput] = useState("");
	const inputRef = useRef(null);
	const charsRef = useRef([]);
	const carretRef = useRef(null);

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
		return quote.split("").map((char, i) => {
			let className = "text-gray-600 text-4xl";

			if (i < input.length) {
				className = input[i] === char ? "text-white" : "text-red-500";
			} else if (i === input.length) {
				className = "border-l-2 border-green-400 animate-pulse";
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

			<div className="carret" ref={carretRef}></div>

			<input
				ref={inputRef}
				type="text"
				name="wordsInput"
				value={input}
				onChange={handleChange}
				autoFocus
				spellCheck={false}
				className="wordsInput"
			/>

		</div>
	);
}
