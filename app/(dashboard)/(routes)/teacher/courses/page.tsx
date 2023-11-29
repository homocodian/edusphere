import Link from 'next/link';

import { Button } from '@/components/ui/button';

function CoursePage() {
	return (
		<div>
			<Button asChild>
				<Link href="/teacher/create">Create</Link>
			</Button>
		</div>
	);
}

export default CoursePage;
