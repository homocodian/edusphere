import { Inter as FontSans } from 'next/font/google';

import type { Metadata } from 'next';

import { ClerkProvider } from '@clerk/nextjs';

import { cn } from '@/lib/utils';

import './globals.css';

export const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans'
});

export const metadata: Metadata = {
	title: 'EduSphere',
	description:
		'EduSphere: Your pathway to seamless education. A user-friendly Learning Management System that empowers educators and learners. Create, manage, and deliver engaging courses effortlessly. Dive into the future of education with EduSphere - where knowledge meets innovation.'
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang="en" className="h-full">
				<body
					className={cn(
						'h-full bg-background font-sans antialiased',
						fontSans.variable
					)}
				>
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
