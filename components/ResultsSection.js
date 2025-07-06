"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useTypingContext } from "@/app/context/TypingContext";
import { calculateResults } from "@/lib/calculateResults";
import CountUp from "@/components/ui/countup";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { login } from "@/lib/login";
import { getDeviceType } from "@/lib/getDeviceType";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ResultsSection({ reset }) {

	const {
		quote,
		input,
		resultsRef,
		testTime,
		isFinished,
		wpm, setWpm,
		accuracy, setAccuracy,
		charTyped, setCharTyped,
	} = useTypingContext();

	const { data: session, status } = useSession();

	const [isSharing, setIsSharing] = useState(false);

	useEffect(() => {
		if (isFinished) {
			calculateResults(testTime, quote, input, setWpm, setAccuracy, setCharTyped);
		}
	}, [isFinished]);

	useEffect(() => {
		const updateStats = async () => {
			if (session && session.user && wpm > 0 && status === "authenticated") {
				try {
					const device = getDeviceType();
					const req = await fetch("/api/update-stat", {
						method: "PUT",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							email: session.user.email,
							wpm,
							acc: accuracy,
							charTyped,
							testTime,
							device
						})
					});
					const res = await req.json();
					console.log(res);
					if (res.msg == 'New leaderboard entry created!'){
						toast.success('New Highscore 🎉');
					}
				} catch (err) {
					console.error("Failed to update stats:", err);
				}
			}
		};

		updateStats(); // call the async function
	}, [session, wpm, accuracy, charTyped, testTime, status]);

	const share = async (platform) => {
		setIsSharing(true); // start loader
		try {
			let resolvedUsername = null;

			if (!resolvedUsername && session?.user?.email) {
				const res = await fetch(`/api/get-user?email=${session.user.email}`);
				const data = await res.json();
				if (data.success) {
					resolvedUsername = data.user.username;
				}
			}

			if (!resolvedUsername) {
				console.warn("Username not available, cannot share.");
				setIsSharing(false); // stop loader
				return;
			}

			if (platform === "twitter") {
				const text = `Can you even get close to me?`;
				const url = `${process.env.NEXT_PUBLIC_BASE_URL}/result/${resolvedUsername}/${wpm}/${accuracy}/0`;
				const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
				const width = 550;
				const height = 420;
				const left = (window.innerWidth / 2) - (width / 2);
				const top = (window.innerHeight / 2) - (height / 2);
				window.open(
					shareUrl,
					'twitter-share-dialog',
					`width=${width},height=${height},top=${top},left=${left},scrollbars=no,resizable=no`
				);
			}

			if (platform === "linkedin") {
				const text = `Can you even get close to me?`;
				const url = `${process.env.NEXT_PUBLIC_BASE_URL}/result/${resolvedUsername}/${wpm}/${accuracy}/1`;
				const shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
				const width = 550;
				const height = 420;
				const left = (window.innerWidth / 2) - (width / 2);
				const top = (window.innerHeight / 2) - (height / 2);
				window.open(
					shareUrl,
					'linkedin-share-dialog',
					`width=${width},height=${height},top=${top},left=${left},scrollbars=no,resizable=no`
				);
			}

		} catch (err) {
			console.error("Error during sharing:", err);
		} finally {
			setIsSharing(false); // always stop loader
		}
	};

	return (
		<div className="results-container" id="results-container" ref={resultsRef}>
			<ToastContainer
				position="top-right"
				theme="dark"
				autoClose={3000}
				hideProgressBar={false}
				closeOnClick
				pauseOnHover
				draggable
			/>
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
				<button onClick={reset} className="iconBtn">
					<Image src="/reset.svg" width={40} height={40} alt="Reset Icon" />
				</button>
				<button onClick={() => share("twitter")} className="iconBtn scale-[1.1]">
					<Image src="/x.svg" width={40} height={40} alt="X Icon" />
				</button>
				<button onClick={() => share("linkedin")} className="iconBtn">
					<Image src="/linkedin.svg" width={40} height={40} alt="Linkedin Icon" />
				</button>
			</div>

			{!session && (<div className="signInMsg">
				<button className="underline cursor-pointer" onClick={login}>Sign in</button>
				<span> to save or share your results</span>
			</div>)}

			{isSharing && (
				<div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
					<div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
				</div>
			)}
			
			<BackgroundBeams />
		</div>
	);
}
