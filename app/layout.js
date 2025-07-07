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
	title: "GoDinoType - Typing Speed Test",
	description: "Challenge yourself with DinoType — check your typing speed and easily share your verified scores with friends!",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link rel="shortcut icon" href="/logo.svg" type="image/x-icon" />
				<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
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
