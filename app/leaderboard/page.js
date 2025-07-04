import React from 'react'
import Navbar from '@/components/Navbar';

export default function Leaderboard() {
	return (
		<div>
			<Navbar />
			<div className='lb-container'>
				<div className="filters-container">
					<div className="filter">
						<button className='filterBtn'>Desktop</button>
						<button className='filterBtn'>Tablet</button>
						<button className='filterBtn'>Mobile</button>
					</div>
					<span className='seprator'></span>
					<div className="filter">
						<button className='filterBtn'>15s</button>
						<button className='filterBtn'>30s</button>
						<button className='filterBtn'>60s</button>
						<button className='filterBtn'>120s</button>
					</div>
				</div>
				<h1 className='heading'>👑 Leaderboard</h1>
			</div>
		</div>
	)
}

export const metadata = {
	title: "👑 Leaderboard | DinoTypeTest",
	description: "Challenge yourself with DinoType — check your typing speed and easily share your verified scores with friends!",
};
