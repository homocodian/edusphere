'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Attachment, Course } from '@prisma/client';
import { File, Loader2, PlusCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';

import { axiosInstance } from '@/lib/axios';

type AttchmentFormProps = {
	initialData: { attachments: Attachment[] };
	courseId: Course['id'];
};

const formScheme = z.object({
	url: z.string().url()
});

function AttachmentForm({ initialData, courseId }: AttchmentFormProps) {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const toggleEdit = () => setIsEditing((current) => !current);

	async function onSubmit(values: z.infer<typeof formScheme>) {
		try {
			await axiosInstance.post(`/api/courses/${courseId}/attachments`, values);
			toast.success('Course updated');
			toggleEdit();
			router.refresh();
		} catch (error) {
			toast.error('Something went wrong!');
		}
	}

	async function deleteAttachment(id: string) {
		try {
			setDeletingId(id);
			await axiosInstance.delete(`/api/courses/${courseId}/attachments/${id}`);
			toast.success('Attachment deleted');
			router.refresh();
		} catch (error) {
			toast.error('Something went wrong');
		} finally {
			setDeletingId(null);
		}
	}

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex justify-between items-center">
				Course attachment
				<Button variant="ghost" onClick={toggleEdit}>
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<PlusCircle className="h-4 w-4 mr-2" />
							Add a file
						</>
					)}
				</Button>
			</div>
			{!isEditing ? (
				initialData.attachments.length <= 0 ? (
					<p className="text-sm mt-2 text-slate-500 italic">
						No attachments yet
					</p>
				) : (
					<div className="space-y-2">
						{initialData.attachments.map((attachment) => (
							<div
								key={attachment.id}
								className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
							>
								<File className="h- w-4 mr-2 flex-shrink-0" />
								<p className="text-sm line-clamp-1">{attachment.name}</p>
								{deletingId === attachment.id ? (
									<div className="ml-auto">
										<Loader2 className="h-4 w-4 animate-spin" />
									</div>
								) : (
									<button
										className="ml-auto hover:opacity-75 transition"
										onClick={() => deleteAttachment(attachment.id)}
									>
										<X className="h-4 w-4" />
									</button>
								)}
							</div>
						))}
					</div>
				)
			) : (
				<div>
					<FileUpload
						endpoint="courseAttachment"
						onChange={(url) => {
							if (url) {
								onSubmit({ url });
							}
						}}
					/>
					<p className="text-sm text-muted-foreground mt-4">
						Add anything your students might need to complete the course.
					</p>
				</div>
			)}
		</div>
	);
}

export default AttachmentForm;
