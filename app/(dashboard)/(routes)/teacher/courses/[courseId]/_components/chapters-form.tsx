'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Chapter, Course } from '@prisma/client';
import { Loader2, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { axiosInstance } from '@/lib/axios';
import { cn } from '@/lib/utils';
import { UpdateData } from '@/lib/validations/chapters-list';
import ChaptersList from './chapters-list';

type ChaptersFormProps = {
	initialData: {
		chapters: Chapter[];
	};
	courseId: Course['id'];
};

const formScheme = z.object({
	title: z.string().min(1)
});

function ChaptersForm({ initialData, courseId }: ChaptersFormProps) {
	const router = useRouter();
	const [isCreating, setIsCreating] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);

	const toggleCreating = () => setIsCreating((current) => !current);

	const form = useForm<z.infer<typeof formScheme>>({
		resolver: zodResolver(formScheme),
		defaultValues: {
			title: ''
		}
	});

	const { isSubmitting, isValid } = form.formState;

	async function onSubmit(values: z.infer<typeof formScheme>) {
		try {
			await axiosInstance.post(`/api/courses/${courseId}/chapters`, values);
			toast.success('Chapter created');
			toggleCreating();
			form.reset();
			router.refresh();
		} catch (error) {
			toast.error('Something went wrong!');
		}
	}

	async function onReorder(updateData: UpdateData[]) {
		try {
			setIsUpdating(true);
			await axiosInstance.patch(
				`/api/courses/${courseId}/chapters/reorder`,
				updateData
			);
			toast.success('Chapters reodered');
			router.refresh();
		} catch (error) {
			toast.error('Something went wrong');
		} finally {
			setIsUpdating(false);
		}
	}

	return (
		<div className="relative mt-6 border bg-slate-100 rounded-md p-4">
			{isUpdating && (
				<div className="inset-0 h-full w-full absolute bg-slate-700/20 rounded-md flex justify-center items-center">
					<Loader2 className="h-6 w-6 animate-spin text-sky-700" />
				</div>
			)}
			<div className="font-medium flex justify-between items-center">
				Course chapter
				<Button variant="ghost" onClick={toggleCreating}>
					{isCreating ? (
						<>Cancel</>
					) : (
						<>
							<PlusCircle className="h-4 w-4 mr-2" />
							Add a chapter
						</>
					)}
				</Button>
			</div>
			{isCreating && (
				<Form {...form}>
					<form
						className="space-y-4 mt-4"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="e.g. Introduction to the course"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<Button disabled={isSubmitting || !isValid}>
							{isSubmitting && (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							)}
							Create
						</Button>
					</form>
				</Form>
			)}
			{!isCreating && (
				<>
					<div
						className={cn(
							'text-sm mt-2',
							initialData.chapters.length === 0 ? 'text-slate-500 italic' : ''
						)}
					>
						{!initialData.chapters.length && 'No chapters'}
						<ChaptersList
							onEdit={() => {}}
							onReorder={onReorder}
							items={initialData.chapters}
						/>
					</div>
					<p className="text-sm text-muted-foreground mt-4">
						Drag and drop to reoder the chapters
					</p>
				</>
			)}
		</div>
	);
}

export default ChaptersForm;
