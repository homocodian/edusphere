import { NavbarRoutes } from '@/components/navbar-routes';

import { MobileSidebar } from './mobile-sidebar';

export function Navbar() {
	return (
		<div className="p-4 border-b flex items-center bg-white shadow-sm h-full">
			<MobileSidebar />
			<NavbarRoutes />
		</div>
	);
}
