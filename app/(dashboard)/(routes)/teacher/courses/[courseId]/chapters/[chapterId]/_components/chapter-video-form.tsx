'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import MuxPlayer from '@mux/mux-player-react';
import { MuxData } from '@prisma/client';
import { Pencil, PlusCircle, Video } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';

import { axiosInstance } from '@/lib/axios';

type ChapterVideoFormProps = {
	initialData: {
		videoUrl: string | null;
		muxData?: MuxData | null;
	};
	courseId: string;
	chapterId: string;
};

const formScheme = z.object({
	videoUrl: z.string().url()
});

function ChapterVideoForm({
	initialData,
	courseId,
	chapterId
}: ChapterVideoFormProps) {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);

	const toggleEdit = () => setIsEditing((current) => !current);

	async function onSubmit(values: z.infer<typeof formScheme>) {
		try {
			await axiosInstance.patch(
				`/api/courses/${courseId}/chapters/${chapterId}`,
				values
			);
			toast.success('Chapter updated');
			toggleEdit();
			router.refresh();
		} catch (error) {
			toast.error('Something went wrong!');
		}
	}

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex justify-between items-center">
				Chapter video
				<Button variant="ghost" onClick={toggleEdit}>
					{isEditing ? (
						<>Cancel</>
					) : initialData.videoUrl ? (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Edit video
						</>
					) : (
						<>
							<PlusCircle className="h-4 w-4 mr-2" />
							Add a video
						</>
					)}
				</Button>
			</div>
			{!isEditing ? (
				!initialData.videoUrl ? (
					<div className="flex justify-center items-center h-60 bg-slate-200 rounded-md">
						<Video className="h-10 w-10 text-slate-500" />
					</div>
				) : (
					<div className="relative aspect-video mt-2">
						<MuxPlayer playbackId={initialData.muxData?.playbackId || ''} />
					</div>
				)
			) : (
				<div>
					<FileUpload
						endpoint="chapterVideo"
						onChange={(url) => {
							if (url) {
								onSubmit({ videoUrl: url });
							}
						}}
					/>
					<p className="text-sm text-muted-foreground mt-4">
						Upload this chapter&apos;s video
					</p>
				</div>
			)}
			{initialData.videoUrl && !isEditing && (
				<p className="text-xs text-muted-foreground mt-2">
					Videos can take few minutes to process, refresh the page if video does
					not appear.
				</p>
			)}
		</div>
	);
}

export default ChapterVideoForm;
