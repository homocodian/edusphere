import { auth } from '@clerk/nextjs';
import { ZodError } from 'zod';

import { db } from '@/lib/db';
import { updateDataArray } from '@/lib/validations/chapters-list';

type Context = {
	params: {
		courseId: string;
	};
};

export async function PATCH(req: Request, { params }: Context) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new Response('Unauthorized', { status: 401 });
		}

		const { courseId } = params;
		const json = await req.json();
		const body = updateDataArray.parse(json);

		const courseOwner = await db.course.findUnique({
			where: {
				id: courseId,
				userId
			}
		});

		if (!courseOwner) {
			return new Response('Unauthorized', { status: 401 });
		}

		for await (const item of body) {
			await db.chapter.update({
				where: { id: item.id },
				data: { position: item.position }
			});
		}

		return new Response(null, { status: 204 });
	} catch (error) {
		if (error instanceof ZodError) {
			return new Response(JSON.stringify(error.message), { status: 422 });
		}

		return new Response(null, { status: 500 });
	}
}
