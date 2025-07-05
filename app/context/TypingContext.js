"use client"

import React,{ createContext, useContext, useState, useRef } from 'react';

const TypingContext = createContext(null);

export const TypingProvider = ({ children }) => {
	const [quote, setQuote] = useState("");
	const [input, setInput] = useState("");
	const inputRef = useRef(null);
	const charsRef = useRef([]);
	const wordsRef = useRef([]);
	const resultsRef = useRef(null);
	const timeLeftRef = useRef(null);
	const [testTime, setTestTime] = useState(30);
	const [isStarted, setIsStarted] = useState(false);
	const [isFinished, setIsFinished] = useState(false);
	const [timeLeft, setTimeLeft] = useState(30);
	const [wpm, setWpm] = useState(0);
	const [accuracy, setAccuracy] = useState(0);
	const [charTyped, setCharTyped] = useState(0);
	const [username, setUsername] = useState(null);

	return (
		<TypingContext.Provider
			value={{
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
				charTyped, setCharTyped,
				username, setUsername
			}}
		>
			{children}
		</TypingContext.Provider>
	);
};

export const useTypingContext = () => useContext(TypingContext);
