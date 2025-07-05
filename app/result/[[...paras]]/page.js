export async function generateMetadata({ params }) {
	const { paras } = await params;
	const username = paras[0];
	const wpm = paras[1];
	const acc = paras[2];
	const charTyped = paras[3];

	const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?username=${username}&wpm=${wpm}&acc=${acc}`;

	return {
		title: `${username}'s Typing Result`,
		description: `WPM: ${wpm}, Accuracy: ${acc}%`,
		openGraph: {
			title: `${username}'s Typing Result`,
			description: `WPM: ${wpm}, Accuracy: ${acc}%`,
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/result?username=${username}&wpm=${wpm}&acc=${acc}&char=${charTyped}`,
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

export default function page({ params }) {
	const { username } = params;
	return (
		<div>
			{username}
		</div>
	)
}
