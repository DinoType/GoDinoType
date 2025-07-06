'use client';

import React, { useEffect, useState } from 'react';
import { fetchUser } from '@/lib/fetchUser';
import { BackgroundBeams } from "@/components/ui/background-beams";
import Navbar from '@/components/Navbar';

export default function SharedResult({ username }) {

	const [userData, setUserData] = useState(null);

	useEffect(() => {
		const getUser = async () => {
			try {
				const data = await fetchUser('username', username);
				setUserData(data);
			} catch (err) {
				console.error(err);
			}
		};

		if (username) {
			getUser();
		}
	}, [username]);

	return (
		<div className='bg-black min-h-screen w-full'>
			<Navbar reset={() => {}} />
				<div className="bento-container">
					<div className="bento-grid">
						
					</div>
				</div>
			<BackgroundBeams />
		</div>
	);

}
