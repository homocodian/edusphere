'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { UserButton } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';

import { Button } from './ui/button';

export function NavbarRoutes() {
	const pathname = usePathname();

	const isTeacherPage = pathname.startsWith('/teacher');
	const isPlayerPage = pathname.startsWith('/chapter');

	return (
		<div className="flex gap-x-2 ml-auto">
			{isTeacherPage || isPlayerPage ? (
				<Button variant="ghost" size="sm" asChild>
					<Link href="/">
						<LogOut className="w-4 h-4 mr-2" />
						Exit
					</Link>
				</Button>
			) : (
				<Button asChild variant="ghost" size="sm">
					<Link href="/teacher/courses">Teacher mode</Link>
				</Button>
			)}
			<div className="w-9">
				<UserButton afterSignOutUrl="/" />
			</div>
		</div>
	);
}
