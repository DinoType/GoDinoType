"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

export default function SignInPage() {
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "unauthenticated") {
			signIn(); // redirect to login
		}
	}, [status]);

	useEffect(() => {
		if (status === "authenticated") {
			// Notify opener (main window) and close the popup
			if (window.opener) {
				window.opener.postMessage({ type: "LOGIN_SUCCESS" }, window.location.origin);
				window.close();
			}
		}
	}, [status]);

	return <p>Logging in...</p>;
}
