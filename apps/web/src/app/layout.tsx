import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";
// import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "auth",
	description: "auth",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
					<div className="grid grid-rows-[auto_1fr] h-svh">
						{/* <Header /> */}
						{children}
						<Toaster />
					</div>
			</body>
		</html>
	);
}
