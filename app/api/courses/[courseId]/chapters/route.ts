import { auth } from '@clerk/nextjs';
import { z, ZodError } from 'zod';

import { db } from '@/lib/db';

type Context = {
	params: {
		courseId: string;
	};
};

const schema = z.object({
	title: z.string().min(1)
});

export async function POST(req: Request, { params }: Context) {
	try {
		const { courseId } = params;
		const { userId } = auth();

		if (!userId) {
			return new Response('Unauthorized', { status: 401 });
		}

		const json = await req.json();
		const body = schema.parse(json);

		const courseOwner = await db.course.findUnique({
			where: {
				id: courseId,
				userId
			}
		});

		if (!courseOwner) {
			return new Response('Unauthorized', { status: 401 });
		}

		const lastChapter = await db.chapter.findFirst({
			where: {
				courseId
			},
			orderBy: {
				position: 'desc'
			}
		});

		const newPosition = lastChapter ? lastChapter.position + 1 : 1;

		const chapter = await db.chapter.create({
			data: {
				title: body.title,
				courseId,
				position: newPosition
			}
		});

		return new Response(JSON.stringify(chapter), { status: 201 });
	} catch (error) {
		if (error instanceof ZodError) {
			return new Response(JSON.stringify(error.message), { status: 422 });
		}

		return new Response(null, { status: 500 });
	}
}
