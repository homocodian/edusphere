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

		const chapter = await db.chapter.findUnique({
			where: {
				id: params.chapterId,
				courseId: params.courseId
			}
		});

		const muxData = await db.muxData.findUnique({
			where: { chapterId: params.chapterId }
		});

		if (
			!chapter ||
			!muxData ||
			!chapter.title ||
			!chapter.description ||
			!chapter.videoUrl
		) {
			return new Response('Missing required fields', { status: 400 });
		}

		const publishedChapter = await db.chapter.update({
			where: {
				id: params.chapterId,
				courseId: params.courseId
			},
			data: {
				isPublished: true
			}
		});

		return new Response(JSON.stringify(publishedChapter));
	} catch (error) {
		console.log('[COURSES_CHAPTER_PUBLISH]', error);

		return new Response('Internal Error', { status: 500 });
	}
}
