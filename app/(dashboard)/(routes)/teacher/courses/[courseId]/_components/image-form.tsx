'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Course } from '@prisma/client';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';

import { axiosInstance } from '@/lib/axios';

type ImageFormProps = {
	initialData: {
		imageUrl: Course['imageUrl'];
	};
	courseId: Course['id'];
};

const formScheme = z.object({
	imageUrl: z.string().min(1, {
		message: 'Image is required'
	})
});

function ImageForm({ initialData, courseId }: ImageFormProps) {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);

	const toggleEdit = () => setIsEditing((current) => !current);

	async function onSubmit(values: z.infer<typeof formScheme>) {
		try {
			await axiosInstance.patch(`/api/courses/${courseId}`, values);
			toast.success('Course updated');
			toggleEdit();
			router.refresh();
		} catch (error) {
			toast.error('Something went wrong!');
		}
	}

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex justify-between items-center">
				Course Image
				<Button variant="ghost" onClick={toggleEdit}>
					{isEditing ? (
						<>Cancel</>
					) : initialData.imageUrl ? (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Edit image
						</>
					) : (
						<>
							<PlusCircle className="h-4 w-4 mr-2" />
							Add an image
						</>
					)}
				</Button>
			</div>
			{!isEditing ? (
				!initialData.imageUrl ? (
					<div className="flex justify-center items-center h-60 bg-slate-200 rounded-md">
						<ImageIcon className="h-10 w-10 text-slate-500" />
					</div>
				) : (
					<div className="relative aspect-video mt-2">
						<Image
							alt="upload"
							fill
							className="object-cover rounded-md"
							src={initialData.imageUrl}
						/>
					</div>
				)
			) : (
				<div>
					<FileUpload
						endpoint="courseImage"
						onChange={(url) => {
							if (url) {
								onSubmit({ imageUrl: url });
							}
						}}
					/>
					<p className="text-sm text-muted-foreground mt-4">
						16:9 aspect ratio recommanded
					</p>
				</div>
			)}
		</div>
	);
}

export default ImageForm;
