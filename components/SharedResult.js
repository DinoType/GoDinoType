'use client';

import React, { useEffect, useState } from 'react';
import { fetchUser } from '@/lib/fetchUser';

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
		<div>
			
		</div>
	);

}
