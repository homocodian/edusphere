import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

export async function POST(req: Request) {
	try {
		const { userId } = auth();
		const { title } = await req.json();

		if (!userId) {
			return new Response('Unauthorized', { status: 401 });
		}

		const data = await db.course.create({
			data: {
				userId,
				title
			}
		});

		return new Response(JSON.stringify(data), { status: 201 });
	} catch (error) {
		console.log('🚀 ~ file: route.ts:5 ~ POST ~ error:', error);
		return new Response(null, { status: 500 });
	}
}
