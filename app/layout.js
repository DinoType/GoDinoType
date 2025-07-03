import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata = {
	title: "DinoType - Typing Speed Test",
	description: "Challenge yourself with DinoType — check your typing speed and easily share your verified scores with friends!",
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
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					<TypingProvider>
						{children}
					</TypingProvider>
				</body>
			</SessionWrapper>
		</html>
	);
}
