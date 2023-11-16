import { PropsWithChildren } from 'react';

import { Navbar } from './_components/navbar';
import { Sidebar } from './_components/sidebar';

function DashboardLayout({ children }: PropsWithChildren) {
	return (
		<>
			<div className="h-[80px] md:pl-56 fixed inset-y-0 z-50 w-full">
				<Navbar />
			</div>
			<div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
				<Sidebar />
			</div>
			<main className="md:ml-56 pt-[80px] h-full">{children}</main>
		</>
	);
}

export default DashboardLayout;
