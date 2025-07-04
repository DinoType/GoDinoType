"use client";

import React, { useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import { useTypingContext } from "@/app/context/TypingContext";
import { calculateResults } from "@/lib/calculateResults";
import CountUp from "@/components/ui/countup";
import { BackgroundBeams } from "@/components/ui/background-beams";
import * as htmlToImage from 'html-to-image';
import { login } from "@/lib/login";
import { getDeviceType } from "@/lib/getDeviceType";

export default function ResultsSection({ reset }) {

	const {
		quote,
		input,
		resultsRef,
		testTime,
		isFinished,
		wpm, setWpm,
		accuracy, setAccuracy,
		charTyped, setCharTyped
	} = useTypingContext();

	const { data: session, status } = useSession()

	useEffect(() => {
		if (isFinished) {
			calculateResults(testTime, quote, input, setWpm, setAccuracy, setCharTyped);
		}
	}, [isFinished]);

	useEffect(() => {
		const updateStats = async () => {
			if (session && session.user && wpm > 0 && status === "authenticated") {
				try {
					const username = session.user.email.split('@')[0];
					const device = getDeviceType();
					const req = await fetch("/api/updatestat", {
						method: "PUT",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							username: username,
							wpm,
							acc: accuracy,
							charTyped,
							testTime,
							device
						})
					});
					const res = await req.json();
					// console.log(res);
				} catch (err) {
					// console.error("Failed to update stats:", err);
				}
			}
		};

		updateStats(); // call the async function
	}, [session, wpm, accuracy, charTyped, testTime, status]);

	const share = async () => {
		if (!session || !session.user) {
			login();
			return;
		}
		try {
			
		} catch (err) {
			console.error(err);
		}
	};


	return (
		<div className="results-container" id="results-container" ref={resultsRef}>
			<div className="results">
				<div id="wpm" className="flex flex-col gap-0">
					<h2 className="heading">wpm</h2>
					<CountUp from={0} to={wpm} duration={1} className="count-up-text stat" />
				</div>
				<div id="acc">
					<h2 className="heading">acc</h2>
					<CountUp from={0} to={accuracy} duration={1} className="count-up-text stat" />
					<span className="text-2xl text-gray-600"> %</span>
				</div>
				<div id="char">
					<h2 className="heading">char</h2>
					<CountUp from={0} to={charTyped} duration={1} className="count-up-text stat" />
				</div>
			</div>
			<div className="buttons">
				<button onClick={reset}>
					<span className="material-symbols-outlined icon">autorenew</span>
				</button>
				<button disabled={wpm < 0} onClick={share}>
					<span className="material-symbols-outlined icon">share</span>
				</button>
			</div>
			{!session && (<div className="signInMsg">
				<button className="underline cursor-pointer" onClick={login}>Sign in</button>
				<span> to save or share your results</span>
			</div>)}
			<BackgroundBeams />
		</div>
	);
}
