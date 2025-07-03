"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from 'next/image'

export default function SignInPage() {
	const { data: session, status } = useSession()
	const router = useRouter()

	useEffect(() => {
		if (status === "unauthenticated") {
			signIn()
		}
	}, [status])

	if (status === "loading") {
		return <p>Loading...</p>
	}

	if (status === "authenticated") {
		console.log(session)
		return (
			<div className="min-h-screen bg-gray-100 p-4">
				<p className="text-xl font-medium">Welcome, {session?.user?.name}</p>
				<Image width={100} height={100} src={session?.user?.image || ""} alt="Profile" className="w-16 h-16 rounded-full mt-2" />
				<button
					onClick={() => {
						signOut({ callbackUrl: "/" }) // on logout, go home
					}}
					className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
				>
					Sign Out
				</button>
			</div>
		)
	}

	return null // nothing else to show
}
