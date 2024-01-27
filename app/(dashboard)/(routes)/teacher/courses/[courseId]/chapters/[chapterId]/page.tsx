import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';

import IconBadge from '@/components/icon-badge';

import { db } from '@/lib/db';
import ChapterDescriptionForm from './_components/chapter-description-form';
import ChapterTitleForm from './_components/chapter-title-form';

type ChaptersPageProps = {
	params: {
		courseId: string;
		chapterId: string;
	};
};

async function ChaptersPage({ params }: ChaptersPageProps) {
	const userId = auth();

	if (!userId) {
		redirect('/');
	}

	const chapter = await db.chapter.findUnique({
		where: {
			courseId: params.courseId,
			id: params.chapterId
		},
		include: {
			muxData: true
		}
	});

	if (!chapter) {
		redirect('/');
	}

	const requiredFields = [chapter.title, chapter.videoUrl, chapter.description];

	const totalFields = requiredFields.length;
	const completedFields = requiredFields.filter(Boolean).length;
	const completionText = `${completedFields}/${totalFields}`;

	return (
		<div className="p-6">
			<div className="flex items-center justify-between">
				<div className="w-full">
					<Link
						href={`/teacher/courses/${params.courseId}`}
						className="flex items-center text-sm hover:opacity-75 transition mb-6"
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to course setup
					</Link>
					<div className="flex items-center justify-between w-full">
						<div className="flex flex-col gap-y-2">
							<h1 className="text-2xl font-medium">Chapter creation</h1>
							<span className="text-slate-700 text-sm">
								Complete all fields {completionText}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
				<div className="space-y-4">
					<div>
						<div className="flex items-center gap-x-2">
							<IconBadge icon={LayoutDashboard} />
							<h2 className="text-xl">Customize your chapter</h2>
						</div>
						<ChapterTitleForm
							chapterId={params.chapterId}
							courseId={params.courseId}
							initialData={{
								title: chapter.title
							}}
						/>
						<ChapterDescriptionForm
							initialData={{
								description: chapter.description
							}}
							chapterId={params.chapterId}
							courseId={params.courseId}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ChaptersPage;
