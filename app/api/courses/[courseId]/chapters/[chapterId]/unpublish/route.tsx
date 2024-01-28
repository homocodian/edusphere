import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

type PatchProps = {
	params: {
		courseId: string;
		chapterId: string;
	};
};

export async function PATCH(_req: Request, { params }: PatchProps) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new Response('Unauthorized', { status: 401 });
		}

		const ownCourse = db.chapter.findUnique({
			where: {
				id: params.chapterId,
				courseId: params.courseId
			}
		});

		if (!ownCourse) {
			return new Response('Unauthorized', { status: 403 });
		}

		const unPublishedchapter = await db.chapter.update({
			where: {
				id: params.chapterId,
				courseId: params.courseId
			},
			data: {
				isPublished: false
			}
		});

		const publishedChaptersInCourse = await db.chapter.findMany({
			where: {
				courseId: params.courseId,
				isPublished: true
			}
		});

		if (!publishedChaptersInCourse.length) {
			await db.course.update({
				where: {
					id: params.courseId
				},
				data: {
					isPublished: false
				}
			});
		}

		return new Response(JSON.stringify(unPublishedchapter));
	} catch (error) {
		console.log('[COURSES_CHAPTER_UNPUBLISH]', error);

		return new Response('Internal Error', { status: 500 });
	}
}
