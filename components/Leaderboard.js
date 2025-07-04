"use client"

import React, { useState } from 'react'
import Navbar from '@/components/Navbar';

export default function Leaderboard() {

	const [selectedTime, setSelectedTime] = useState(15);
	const [selectedDevice, setSelectedDevice] = useState('desktop');

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
									{time}s
								</button>
							))}
						</div>
					</div>
				</div>
				<div className="lb">
					<h1 className='heading'>👑 Leaderboard</h1>
				</div>
			</div>
		</div>
	)
}
