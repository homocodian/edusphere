import { auth } from '@clerk/nextjs';
import { z, ZodError } from 'zod';

import { db } from '@/lib/db';

const schema = z.object({
	title: z.string().min(1)
});

export async function POST(req: Request) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new Response('Unauthorized', { status: 401 });
		}

		const json = await req.json();
		const body = schema.parse(json);

		const data = await db.course.create({
			data: {
				userId,
				title: body.title
			}
		});

		return new Response(JSON.stringify(data), { status: 201 });
	} catch (error) {
		if (error instanceof ZodError) {
			return new Response(JSON.stringify(error.message), { status: 422 });
		}

		return new Response(null, { status: 500 });
	}
}
