import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

type Context = {
	params: {
		courseId: string;
		attachmentId: string;
	};
};

export async function DELETE(_req: Request, { params }: Context) {
	try {
		const { userId } = auth();
		const { courseId, attachmentId } = params;

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
		
		const attachment = await db.attachment.delete({
			where: {
				id: attachmentId
			}
		});

		return new Response(JSON.stringify(attachment));
	} catch (error) {
		return new Response(null, { status: 500 });
	}
}
