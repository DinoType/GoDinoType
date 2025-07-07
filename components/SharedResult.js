'use client';

import React, { useEffect, useState } from 'react';
import { fetchUser } from '@/lib/fetchUser';
import { BackgroundBeams } from "@/components/ui/background-beams";
import Link from 'next/link';
import Image from 'next/image'

export default function SharedResult({ username }) {

	const [isLoading, setIsLoading] = useState(true);
	const [userData, setUserData] = useState(null);
	const [rankData, setRankData] = useState(null);

	useEffect(() => {
		const getUser = async () => {
			try {
				const data = await fetchUser('username', username);
				setUserData(data);
				console.log(data);
			} catch (err) {
				console.error(err);
			} finally {
				setIsLoading(false)
			}
		};

		if (username) {
			getUser();
		}
	}, [username]);

	return (
		<div className='bg-[#101010] w-full h-full'>
			{!isLoading && userData ? (
				<div className='bg-[#101010] w-full max-w-5xl flex items-center justify-center mx-auto'>
					<div className="bento-container">
						<div className="bento-grid">
							<div className='bento user-info col-span-2 row-span-1'>
								<h1>I'm a T'Rex</h1>
								<p>{userData.user.bio || ''} Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores distinctio similique perspiciatis atque nihil, magni consequuntur eveniet, officia doloribus, obcaecati facilis enim numquam commodi aliquam? Tempore suscipit assumenda optio aut.</p>
								<div className="socials">
									{userData.user.github && userData.user.github !== "" && (
										<Link href={userData.user.github}>
											Github
											<span className="w-4 h-4 flex items-center justify-center">
												<svg
													xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
													<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
													<path d="M9 18c-4.51 2-5-2-7-2"></path>
												</svg>
											</span>
										</Link>
									)}
									{userData.user.linkedin && userData.user.linkedin !== "" && (
										<Link href={userData.user.linkedin}>
											LinkedIn
											<span className="w-4 h-4 flex items-center justify-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="currentColor"
													className="w-full h-full"
												>
													<path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 7h4V21h-4V7zm7.5 0h3.5v1.95h.05c.49-.9 1.69-1.85 3.45-1.85 3.7 0 4.5 2.45 4.5 5.65V21h-4v-6.5c0-1.55-.03-3.55-2.15-3.55-2.15 0-2.5 1.68-2.5 3.42V21h-4V7z" />
												</svg>
											</span>
										</Link>
									)}
									{userData.user.twitter && userData.user.twitter !== "" && (
										<Link href={userData.user.twitter}>
											<span className="w-6 h-6 flex items-center justify-center">
												<svg viewBox="0 0 24 24" fill="none"
													xmlns="http://www.w3.org/2000/svg">
													<path d="M2 3H8.32813L12.6981 8.75109L17.7506 3H20.8181L14.1187 10.6248L22 21H15.8281L10.9944 14.7082L5.46312 20.9994H2.39562L9.56125 12.8444L2 3ZM5.58125 4.7318L16.675 19.1717H18.375L7.40437 4.7318H5.58125Z" fill="currentColor" />
												</svg>
											</span>
										</Link>
									)}
								</div>
							</div>
							<div className='bento user-image col-span-1 row-span-1'>
								<Image
									src={userData.user.image}
									width={500}
									height={500}
									alt="Avtar"
								/>
								<div className="gradient-overlay" />
								<div className='absolute flex flex-col gap-2 bottom-4 p-4 z-2'>
									<p className='text-4xl'>I'm {userData.user.name.split(' ')[0]}</p>
									<p className='text-base text-gray-200 line-clamp-2'>{userData.user.bio || ''} Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti rem voluptates architecto, accusamus consequatur ipsam corporis et odio cupiditate quasi, consectetur eius nulla sequi, esse accusantium facilis suscipit quia. A?</p>
								</div>
							</div>
							
						</div>
					</div>
					<BackgroundBeams />
				</div>
			) : (
				<div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
					<div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
				</div>
			)}
		</div>
	);

}
