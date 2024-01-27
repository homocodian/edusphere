import { auth } from '@clerk/nextjs';
import { z } from 'zod';

import { db } from '@/lib/db';

type PatchProps = {
	params: {
		courseId: string;
		chapterId: string;
	};
};

const chapterSchema = z
	.object({
		title: z.string().min(1).max(256),
		description: z.string().min(1),
		videoUrl: z.string().url(),
		isFree: z.boolean()
	})
	.partial();

export async function PATCH(req: Request, { params }: PatchProps) {
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

		const json = await req.json();
		const data = chapterSchema.parse(json);

		const chapter = await db.chapter.update({
			where: {
				id: params.chapterId,
				courseId: params.courseId
			},
			data: {
				...data
			}
		});
		return new Response(JSON.stringify(chapter));
	} catch (error) {
		console.log('[COURSES_CHAPTER_ID]', error);

		if (error instanceof z.ZodError) {
			return new Response(error.message, { status: 422 });
		}

		return new Response('Internal Error', { status: 500 });
	}
}
