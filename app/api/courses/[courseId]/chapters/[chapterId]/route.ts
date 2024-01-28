import { auth } from '@clerk/nextjs';
import Mux from '@mux/mux-node';
import { z } from 'zod';

import { db } from '@/lib/db';

const { Video } = new Mux(
	process.env.MUX_TOKEN_ID!,
	process.env.MUX_TOKEN_SECRET!
);

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

		const ownCourse = await db.chapter.findUnique({
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

		if (data.videoUrl) {
			const existingMuxData = await db.muxData.findFirst({
				where: {
					chapterId: params.chapterId
				}
			});

			if (existingMuxData) {
				await Video.Assets.del(existingMuxData.assestId);
				await db.muxData.delete({
					where: {
						id: existingMuxData.id
					}
				});
			}

			const asset = await Video.Assets.create({
				input: data.videoUrl,
				playback_policy: 'public',
				test: false
			});

			await db.muxData.create({
				data: {
					chapterId: params.chapterId,
					assestId: asset.id,
					playbackId: asset.playback_ids?.[0]?.id
				}
			});
		}

		return new Response(JSON.stringify(chapter));
	} catch (error) {
		console.log('[COURSES_CHAPTER_ID]', error);

		if (error instanceof z.ZodError) {
			return new Response(error.message, { status: 422 });
		}

		return new Response('Internal Error', { status: 500 });
	}
}

export async function DELETE(req: Request, { params }: PatchProps) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new Response('Unauthorized', { status: 401 });
		}

		const ownCourse = await db.chapter.findUnique({
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

		if (!chapter) {
			return new Response('Not Found', { status: 404 });
		}

		if (chapter.videoUrl) {
			const existingMuxData = await db.muxData.findUnique({
				where: {
					chapterId: params.chapterId
				}
			});
			if (existingMuxData) {
				await Video.Assets.del(existingMuxData.assestId);
				await db.muxData.delete({ where: { id: existingMuxData.id } });
			}
		}

		const deletedChapter = await db.chapter.delete({
			where: { id: params.chapterId }
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

		return new Response(JSON.stringify(deletedChapter));
	} catch (error) {
		console.log('[COURSES_CHAPTER_DELETE]', error);

		return new Response('Internal Error', { status: 500 });
	}
}
