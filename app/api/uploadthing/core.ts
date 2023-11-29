import type { FileRouter } from 'uploadthing/next';

import { auth } from '@clerk/nextjs';
import { createUploadthing } from 'uploadthing/next';

const f = createUploadthing();

const handleAuth = () => {
	const { userId } = auth();

	if (!userId) throw new Error('Unauthorized');
	return { userId };
};

export const ourFileRouter = {
	courseImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
		.middleware(handleAuth)
		.onUploadComplete(() => ({})),
	courseAttachment: f(['text', 'image', 'pdf', 'video', 'audio'])
		.middleware(handleAuth)
		.onUploadComplete(() => ({})),
	chapterVideo: f({ video: { maxFileSize: '512MB', maxFileCount: 1 } })
		.middleware(handleAuth)
		.onUploadComplete(() => ({}))
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
