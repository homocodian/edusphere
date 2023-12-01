import { auth } from '@clerk/nextjs';
import { z, ZodError } from 'zod';

import { db } from '@/lib/db';

type Context = {
	params: {
		courseId: string;
	};
};

const schema = z.object({
	url: z.string().url()
});

export async function POST(req: Request, { params }: Context) {
	try {
		const { userId } = auth();
		const { courseId } = params;

		if (!userId) {
			return new Response('Unauthorized', { status: 401 });
		}

		const courseOwner = await db.course.findUnique({
			where: {
				id: courseId,
				userId
			}
		});

		if (!courseOwner) {
			return new Response('Unauthorized', { status: 401 });
		}

		const json = await req.json();
		const body = schema.parse(json);

		const attachment = await db.attachment.create({
			data: {
				url: body.url,
				name: body.url.split('/').pop() || crypto.randomUUID(),
				courseId
			}
		});

		return new Response(JSON.stringify(attachment), { status: 201 });
	} catch (error) {
		if (error instanceof ZodError) {
			return new Response(JSON.stringify(error.message), { status: 422 });
		}

		return new Response(null, { status: 500 });
	}
}
