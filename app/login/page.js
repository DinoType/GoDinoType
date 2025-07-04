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
	} = useForm();

	useEffect(() => {
		if (status === "unauthenticated") {
			signIn(); // redirect to login
		}
	}, [status]);

	useEffect(() => {
		if (status === "authenticated" && issubmitted) {
			if (window.opener) {
				window.opener.postMessage({ type: "LOGIN_SUCCESS" }, window.location.origin);
				window.close();
			}
		}
	}, [status, issubmitted]);

	const onSubmit = async (data) => {

		const username = data.username;
		const res = await fetch("/api/update-username", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, email: session.user.email }),
		});

		const updateUsername = await res.json();

		if (updateUsername.success === false) {
			toast.error(updateUsername.msg || "Something went wrong");
		} else {
			setIssubmitted(true);
			toast.success("Username Updated Successfully");
		}

	};

	const onError = (formErrors) => {
		if (formErrors.username) {
			toast.error(formErrors.username.message || "Invalid username");
		}
	};

	return (
		<div className="w-full min-h-[100dvh] flex justify-center items-center bg-black">

			<ToastContainer
				position="top-center"
				theme="dark"
				autoClose={2000} // Toast disappears after 2 seconds
				hideProgressBar={false}
				closeOnClick
				pauseOnHover
				draggable
			/>

			<form
				onSubmit={handleSubmit(onSubmit, onError)}
				className="flex flex-col gap-6 bg-primary-bg p-8 rounded-xl text-white w-[80%] md:w-[30%]"
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
