"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function SignInPage() {
	const { data: session, status } = useSession();
	const [issubmitted, setIssubmitted] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		defaultValues: {
			username: "",
			bio: "",
			github: "",
			twitter: "",
			linkedin: ""
		},
	});

	// Auto-redirect if not logged in
	useEffect(() => {
		if (status === "unauthenticated") {
			signIn();
		}
	}, [status]);

	// Handle postMessage and window close after successful submission
	useEffect(() => {
		if (status === "authenticated" && issubmitted) {
			if (window.opener) {
				window.opener.postMessage({ type: "LOGIN_SUCCESS" }, window.location.origin);
				window.close();
			}
		}
	}, [status, issubmitted]);

	// Pre-fill default username from email
	useEffect(() => {
		if (session?.user?.email) {
			const defaultUsername = session.user.email.split("@")[0];
			setValue("username", defaultUsername);
		}
	}, [session, setValue]);

	const onSubmit = async (data) => {
		const { username, bio, github, twitter, linkedin } = data;

		if (!session?.user?.email) {
			toast.error("Session not found");
			return;
		}

		const res = await fetch("/api/update-user", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: session.user.email,
				username,
				bio,
				github,
				twitter,
				linkedin
			}),
		});

		const result = await res.json();

		if (!result.success) {
			toast.error(result.msg || "Something went wrong");
		} else {
			setIssubmitted(true);
			toast.success("Profile Updated Successfully");
		}
	};

	const onError = (formErrors) => {
		Object.values(formErrors).forEach((error) =>
			toast.error(error.message || "Invalid input")
		);
	};

	return (
		<div className="w-full min-h-[100dvh] flex justify-center items-center bg-black py-16 px-8">

			<ToastContainer
				position="top-center"
				theme="dark"
				autoClose={2000}
				hideProgressBar={false}
				closeOnClick
				pauseOnHover
				draggable
			/>

			<form
				onSubmit={handleSubmit(onSubmit, onError)}
				className="flex flex-col gap-6 bg-primary-bg p-8 rounded-xl text-white w-[90%] md:w-[30%]"
			>
				<label className="block font-medium">Username</label>
				<input
					type="text"
					{...register("username", {
						required: "Username is required",
						pattern: {
							value: /^[a-z0-9_-]+$/,
							message: "Only lowercase letters, numbers, '-' and '_' allowed",
						},
					})}
					className="border border-gray-300 rounded px-3 py-2 w-full"
					placeholder="e.g., john_doe99"
				/>

				<label className="block font-medium">Bio</label>
				<textarea
					{...register("bio")}
					className="border border-gray-300 rounded px-3 py-2 w-full resize-none"
					rows={3}
					placeholder="Tell us a bit about yourself"
				/>

				<label className="block font-medium">GitHub</label>
				<input
					type="url"
					{...register("github", {
						pattern: {
							value: /^(https:\/\/)?(www\.)?github\.com\/[A-z0-9_-]+\/?$/,
							message: "Enter a valid GitHub profile URL"
						}
					})}
					className="border border-gray-300 rounded px-3 py-2 w-full"
					placeholder="https://github.com/username"
				/>

				<label className="block font-medium">Twitter</label>
				<input
					type="url"
					{...register("twitter", {
						pattern: {
							value: /^(https:\/\/)?(www\.)?x\.com\/[A-z0-9_]+\/?$/,
							message: "Enter a valid Twitter profile URL"
						}
					})}
					className="border border-gray-300 rounded px-3 py-2 w-full"
					placeholder="https://twitter.com/username"
				/>

				<label className="block font-medium">LinkedIn</label>
				<input
					type="url"
					{...register("linkedin", {
						pattern: {
							value: /^(https:\/\/)?(www\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?$/,
							message: "Enter a valid LinkedIn profile URL"
						}
					})}
					className="border border-gray-300 rounded px-3 py-2 w-full"
					placeholder="https://linkedin.com/in/username"
				/>

				<button
					type="submit"
					className="bg-blue-500 cursor-pointer border border-blue-500 text-white px-4 py-2 rounded hover:bg-transparent hover:text-blue-50 transition-all duration-300"
				>
					Submit
				</button>
			</form>
		</div>
	);
}
