"use client"

import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar';
import Image from 'next/image'
import { formatDate } from '@/lib/formatDate';

export default function Leaderboard() {

	const [loading, setLoading] = useState(true);
	const [selectedTime, setSelectedTime] = useState(30);
	const [selectedDevice, setSelectedDevice] = useState('desktop');
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [leaderboard, setLeaderboard] = useState([]);

	useEffect(() => {

		const fetchLeaderboard = async () => {
			try {
				setLoading(true);
				const req = await fetch(`/api/ranking?time=${selectedTime}&device=${selectedDevice}&page=${currentPage}`);
				const res = await req.json();
				setLeaderboard(res.ranking);
				setTotalPages(Math.ceil(res.total / res.limit));
				console.log(res)
			} catch (err) {
				console.log(err);
			} finally {
				setLoading(false);
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
					{loading ? (
						<div className="flex justify-center items-center py-20">
							<div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
						</div>
					) : (
						<>
							<table>
								<thead>
									<tr>
										<th>#</th>
										<th>Username</th>
										<th>WPM</th>
										<th>Accuracy</th>
										<th className='hidden md:table-cell'>Score</th>
										<th className='hidden md:table-cell'>Date</th>
									</tr>
								</thead>
								<tbody>
									{leaderboard.length === 0 && (
										<tr>
											<td colSpan={6}>No results found.</td>
										</tr>
									)}
									{leaderboard.map((user, index) => (
										<tr key={user._id || index}>
											<td>{user.rank}</td>
											<td>
												<div className="flex items-center gap-3">
													<Image
														src={user.image || "/default-avatar.png"}
														alt={user.name || user.username}
														width={32}
														height={32}
														className="rounded-full object-cover"
													/>
													<span>{user.name || user.username}</span>
												</div>
											</td>

											<td>{user.wpm}</td>
											<td>{user.acc}%</td>
											<td className='hidden md:table-cell'>{user.score}</td>
											<td className='hidden md:table-cell'>{formatDate(user.updatedAt)}</td>
										</tr>
									))}
								</tbody>
							</table>
						</>
					)}

					<div className="paginationBtns">
						<button onClick={prevPage} disabled={currentPage === 1}>
							<Image
								src="/back.svg"
								width={20}
								height={20}
								alt="Back Button"
							/>
						</button>
						<button onClick={nextPage} disabled={currentPage === totalPages}>
							<Image
								src="/forward.svg"
								width={20}
								height={20}
								alt="Forward Button"
							/>
						</button>
					</div>
				</div>

				{/* <button onClick={nextPage}>Next Page</button>
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
					)} */}

			</div>
		</div>
	)
}
