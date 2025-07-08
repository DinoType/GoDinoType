"use client"

import React, { useEffect } from 'react'
import { useTypingContext } from "@/app/context/TypingContext";

export default function Timer() {

	const {
		timeLeftRef,
		testTime, setTestTime,
		isStarted,
		setIsFinished,
		timeLeft, setTimeLeft,
	} = useTypingContext();

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
	}, [isStarted, setIsFinished, setTimeLeft]);

	return (
		<>
			{!isStarted ? (
				<div className="timerSelector">
					{[15, 30, 60, 120].map((time) => (
						<button
							key={time}
							onClick={() => {
								setTestTime(time);
								setTimeLeft(time);
							}}
							className={`selectBtn ${testTime === time
								? "selected"
								: "not-selected"
								}`}
						>
							{time}s
						</button>
					))}
				</div>
			) : (
				<div ref={timeLeftRef} className="timer text-3xl font-bold text-center my-4">{timeLeft}</div>
			)
			}
		</>
	)
}
