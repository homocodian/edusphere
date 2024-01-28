'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem
} from '@/components/ui/form';

import { axiosInstance } from '@/lib/axios';
import { cn } from '@/lib/utils';

type AccessFormProps = {
	initialData: {
		isFree: boolean;
	};
	courseId: string;
	chapterId: string;
};

const formScheme = z.object({
	isFree: z.boolean().default(false)
});

function ChapterAccessForm({
	initialData,
	courseId,
	chapterId
}: AccessFormProps) {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);

	const toggleEdit = () => setIsEditing((current) => !current);

	const form = useForm<z.infer<typeof formScheme>>({
		resolver: zodResolver(formScheme),
		defaultValues: {
			isFree: !!initialData.isFree
		}
	});

	const { isSubmitting, isValid } = form.formState;

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
				Chapter access
				<Button variant="ghost" onClick={toggleEdit}>
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Edit access
						</>
					)}
				</Button>
			</div>
			{!isEditing ? (
				<p
					className={cn(
						'text-sm mt-2',
						!initialData.isFree && 'text-slate-500 italic'
					)}
				>
					{initialData.isFree
						? 'This chapter is free for preview.'
						: 'This chapter is not free.'}
				</p>
			) : (
				<Form {...form}>
					<form
						className="space-y-4 mt-4"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name="isFree"
							render={({ field }) => (
								<FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormDescription>
											Check this box if you want to make this chapter free for
											preview.
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
						<Button disabled={isSubmitting || !isValid}>
							{isSubmitting && (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							)}
							Save
						</Button>
					</form>
				</Form>
			)}
		</div>
	);
}

export default ChapterAccessForm;
