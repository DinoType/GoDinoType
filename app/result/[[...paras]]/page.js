import SharedResult from '@/components/SharedResult';

export async function generateMetadata({ params }) {
	const { paras } = await params;
	const [username, wpm, acc, shareType] = await paras || [];

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
	const imageUrl = shareType === '0'
		? `${baseUrl}/api/og?username=${username}&wpm=${wpm}&acc=${acc}`
		: `${baseUrl}/og.jpg`;

	return {
		title: `${username}'s Typing Result`,
		description: `WPM: ${wpm}, Accuracy: ${acc}%`,
		openGraph: {
			title: `${username}'s Typing Result`,
			description: `WPM: ${wpm}, Accuracy: ${acc}%`,
			url: `${baseUrl}/result/${username}/${wpm}/${acc}/${shareType}`,
			images: [{ url: imageUrl }],
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title: `${username}'s Typing Result`,
			description: `WPM: ${wpm}, Accuracy: ${acc}%`,
			images: [imageUrl],
		},
	};
}

export default async function Page({ params }) {
	const { paras } = await params;
	const username = await paras[0];
	
	return <SharedResult username={username} />;
}
