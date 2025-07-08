"use client"

import React, { useEffect } from 'react'
import { useTypingContext } from "@/app/context/TypingContext";

export default function TypingInput() {

	const {
		input, setInput,
		inputRef,
		isStarted, setIsStarted,
		timeLeft,
	} = useTypingContext();

	// Auto focus input on click anywhere
	useEffect(() => {
		const focus = () => inputRef.current?.focus();
		window.addEventListener("click", focus);
		return () => window.removeEventListener("click", focus);
	}, [inputRef]);

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

	// Handle typing input
	const handleChange = (e) => {
		setInput(e.target.value);

		if (!isStarted && timeLeft > 0 && e.target.value.length > 0) {
			setIsStarted(true);
		}
	};

	return (
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
	)
}
