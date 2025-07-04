"use client"

import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar';

export default function Leaderboard() {

	const [selectedTime, setSelectedTime] = useState(30);
	const [selectedDevice, setSelectedDevice] = useState('desktop');
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [leaderboard, setLeaderboard] = useState([]);

	useEffect(() => {

		const fetchLeaderboard = async () => {
			try {
				const req = await fetch(`/api/ranking?time=${selectedTime}&device=${selectedDevice}&page=${currentPage}`);
				const res = await req.json();
				setLeaderboard(res.ranking);
				setTotalPages(Math.ceil(res.total / res.limit));
				console.log(res)
			} catch (err) {
				console.log(err);
			}
		};

		fetchLeaderboard();

	}, [selectedTime, selectedDevice, currentPage]);

	const nextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	}
	
	const prevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	}

	return (
		<div>
			<Navbar />
			<div className='lb-container'>
				<div className="filters-container">
					<div className="filters">
						<h1>Filter By Device</h1>
						<div className="filterBtns">
							{['desktop', 'tablet', 'mobile'].map((device) => (
								<button key={device}
									onClick={() => {
										setSelectedDevice(device);
									}}
									className={`filterBtn ${selectedDevice === device
										? "selected"
										: "not-selected"
										}`}
								>
									{device}
								</button>
							))}
						</div>
					</div>
					<div className="filters">
						<h1>Filter By Time</h1>
						<div className="filterBtns">
							{[15, 30, 60, 120].map((time) => (
								<button key={time}
									onClick={() => {
										setSelectedTime(time);
									}}
									className={`filterBtn ${selectedTime === time
										? "selected"
										: "not-selected"
										}`}
								>
									{time}
								</button>
							))}
						</div>
					</div>
				</div>
				<div className="lb">
					<h1 className='heading'>👑 Leaderboard</h1>
					<button onClick={nextPage}>Next Page</button>
					<button onClick={prevPage}>Previous Page</button>
					{leaderboard.length === 0 ? (
						<p>No results found.</p>
					) : (
						<ol>
							{leaderboard.map((user, index) => (
								<li key={user._id || index}>
									#{user.rank} {user.name || user.username} – {user.wpm} WPM
								</li>
							))}
						</ol>
					)}
				</div>

			</div>
		</div>
	)
}
