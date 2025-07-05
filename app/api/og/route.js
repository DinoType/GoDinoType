import { ImageResponse } from '@vercel/og';

export const runtime = 'edge'; 

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const username = searchParams.get('username') || 'Anonymous';
	const wpm = searchParams.get('wpm') || 0;
	const acc = searchParams.get('acc') || 0;

	return new ImageResponse(
		(
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					width: '100%',
					height: '100%',
					backgroundColor: 'black',
					color: 'white',
					fontSize: 60,
					fontWeight: 'bold',
				}}
			>
				<p>Typing Test Result</p>
				<p>Username: {username}</p>
				<p>WPM: {wpm}</p>
				<p>Accuracy: {acc}%</p>
			</div>
		),
		{
			width: 1200,
			height: 630,
		}
	);
}
