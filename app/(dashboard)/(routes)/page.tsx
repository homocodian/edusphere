import { UserButton } from '@clerk/nextjs';

export default function Home() {
	return (
		<main className="h-full">
			<UserButton afterSignOutUrl="/" />
		</main>
	);
}
