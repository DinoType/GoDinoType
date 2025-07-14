import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/ui/SessionWrapper";
import { TypingProvider } from "@/app/context/TypingContext";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const poppins = Poppins({
	subsets: ['latin'],
	variable: '--font-poppins',
	weight: ['400', '500', '600', '700'],
	display: 'swap',
})

export const metadata = {
	title: "GoDinoType - Typing Speed Test",
	description:
		"Challenge yourself with DinoType — check your typing speed and easily share your verified scores with friends!",
	openGraph: {
		title: "GoDinoType - Typing Speed Test",
		description:
			"Challenge yourself with DinoType — check your typing speed and easily share your verified scores with friends!",
		url: "https://godinotype.netlify.app", // replace with your actual deployed domain
		siteName: "GoDinoType",
		type: "website",
		images: [
			{
				url: "https://godinotype.netlify.app/og.jpg?v=2", // full image URL (not relative!)
				width: 1200,
				height: 630,
				alt: "GoDinoType - OG Preview",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "GoDinoType - Typing Speed Test",
		description:
			"Challenge yourself with DinoType — check your typing speed and easily share your verified scores with friends!",
		images: ["https://godinotype.netlify.app/og.jpg"],
	},
};


export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link rel="shortcut icon" href="/logo.svg" type="image/x-icon" />
				<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
			</head>
			<SessionWrapper>
				<body
					className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
				>
					<TypingProvider>
						{children}
					</TypingProvider>
				</body>
			</SessionWrapper>
		</html>
	);
}
