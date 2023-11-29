import { auth } from '@clerk/nextjs';
import { Course } from '@prisma/client';
import { z, ZodError, ZodType } from 'zod';

import { db } from '@/lib/db';

type context = {
	params: {
		courseId: string;
	};
};

type Values = Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;

const valuesSchema: ZodType<Partial<Values>> = z
	.object({
		title: z.string().min(1).trim(),
		description: z.string().min(1).trim(),
		imageUrl: z.string().url().trim(),
		price: z.number(),
		isPublished: z.boolean(),
		categoryId: z.string().min(1)
	})
	.partial();

export async function PATCH(req: Request, { params }: context) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new Response('Unauthorized', { status: 401 });
		}

		const { courseId } = params;
		const json = await req.json();
		const body = valuesSchema.parse(json);

		const course = await db.course.update({
			where: {
				id: courseId
			},
			data: {
				...body
			}
		});

		return new Response(null, { status: 204 });
	} catch (error) {
		if (error instanceof ZodError) {
			return new Response(JSON.stringify(error.message), { status: 422 });
		}

		return new Response('Server error', { status: 500 });
	}
}
