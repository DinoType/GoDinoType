export async function generateMetadata({ params }) {
	const [username, wpm, acc, shareType] = params.paras;

	let imageUrl = '';

	if (shareType === '0') {
		imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?username=${username}&wpm=${wpm}&acc=${acc}`;
	} else {
		imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/og.jpg`;
	}

	return {
		title: `${username}'s Typing Result`,
		description: `WPM: ${wpm}, Accuracy: ${acc}%`,
		openGraph: {
			title: `${username}'s Typing Result`,
			description: `WPM: ${wpm}, Accuracy: ${acc}%`,
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/result/${username}/${wpm}/${acc}/${shareType}`,
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

export default function Page({ params }) {
	const { paras } = params;
	const username = paras[0];

	return (
		<div>
			{username}
		</div>
	);
}
