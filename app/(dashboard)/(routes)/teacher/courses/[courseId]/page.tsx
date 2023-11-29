import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';
import { LayoutDashboard } from 'lucide-react';

import IconBadge from '@/components/icon-badge';

import { db } from '@/lib/db';
import DescriptionForm from './_components/description-form';
import TitleForm from './_components/title-form';

type CourseIdPageProps = {
	params: {
		courseId: string;
	};
};

async function CourseIdPage({ params }: CourseIdPageProps) {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}

	const course = await db.course.findUnique({
		where: {
			id: params.courseId
		}
	});

	if (!course) {
		return redirect('/');
	}

	const requiredFields = [
		course.title,
		course.description,
		course.imageUrl,
		course.price,
		course.categoryId
	];

	const totalFields = requiredFields.length;
	const completedFields = requiredFields.filter(Boolean).length;
	const completionText = `(${completedFields}/${totalFields})`;

	return (
		<div className="p-6">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-y-2">
					<h1 className="text-2xl font-medium">Course setup</h1>
					<span className="text-slate-700 text-sm">
						Complete all fields {completionText}
					</span>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
				<div>
					<div className="flex items-center gap-x-2">
						<IconBadge icon={LayoutDashboard} />
						<h2 className="text-xl font-medium">Customize your course</h2>
					</div>
					<TitleForm
						initialData={{ title: course.title }}
						courseId={course.id}
					/>
					<DescriptionForm
						initialData={{ description: course.description || undefined }}
						courseId={course.id}
					/>
				</div>
			</div>
		</div>
	);
}

export default CourseIdPage;
