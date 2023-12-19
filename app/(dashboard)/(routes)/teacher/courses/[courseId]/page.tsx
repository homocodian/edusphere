import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';
import {
	CircleDollarSign,
	File,
	LayoutDashboard,
	ListChecks
} from 'lucide-react';

import { db } from '@/lib/db';
import AttachmentForm from './_components/attachment-form';
import CategoryForm from './_components/category-form';
import ChaptersForm from './_components/chapters-form';
import DescriptionForm from './_components/description-form';
import ImageForm from './_components/image-form';
import PriceForm from './_components/price-form';
import SectionTitle from './_components/section-title';
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
			id: params.courseId,
			userId
		},
		include: {
			chapters: {
				orderBy: {
					position: 'asc'
				}
			},
			attachments: {
				orderBy: {
					createdAt: 'asc'
				}
			}
		}
	});

	const category = await db.category.findMany({
		orderBy: {
			name: 'asc'
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
		course.categoryId,
		course.chapters.some((chapter) => chapter.isPublished)
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
					<SectionTitle icon={LayoutDashboard} title="Customize your course" />
					<TitleForm
						courseId={course.id}
						initialData={{ title: course.title }}
					/>
					<DescriptionForm
						courseId={course.id}
						initialData={{ description: course.description }}
					/>
					<ImageForm
						courseId={course.id}
						initialData={{ imageUrl: course.imageUrl }}
					/>
					<CategoryForm
						courseId={course.id}
						initialData={{
							categoryId: course.categoryId
						}}
						options={category.map((category) => ({
							label: category.name,
							value: category.id
						}))}
					/>
				</div>
				<div className="space-y-6">
					<div>
						<SectionTitle icon={ListChecks} title="Course chapters" />
						<ChaptersForm
							courseId={course.id}
							initialData={{
								chapters: course.chapters
							}}
						/>
					</div>
					<div>
						Z
						<SectionTitle icon={CircleDollarSign} title="Sell your course" />
						<PriceForm
							initialData={{
								price: course.price
							}}
							courseId={course.id}
						/>
					</div>
					<div>
						<SectionTitle icon={File} title="Resources and attachments" />
						<AttachmentForm
							initialData={{ attachments: course.attachments }}
							courseId={course.id}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CourseIdPage;
