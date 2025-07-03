"use client"

import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState, useRef } from "react";
import Image from 'next/image'
import Link from "next/link";

export default function Navbar({reset}) {

	const { data: session, status } = useSession()

	return (
		<nav className="navbar">
			<Link href="/" onClick={reset} className="logo">
				<Image src="/logo.svg" width={50} height={50} alt="Logo" />
				<p>DinoType</p>
			</Link>
			<div className="links">
				<Link onClick={reset} href="/" className="link">
					<span className="material-symbols-outlined icon">keyboard</span>
				</Link>
				<Link href="/leaderboard" className="link">
					<span className="material-symbols-outlined icon">crown</span>
				</Link>
				<Link href="/profile" className="link">
					<span className="material-symbols-outlined icon">person</span>
				</Link>
				{session && (<button onClick = { () => signOut() }><span className = "material-symbols-outlined logout">logout</span></button>)}
			</div >
		</nav >
	)
}
