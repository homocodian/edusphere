'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { axiosInstance } from '@/lib/axios';

type TitleFormProps = {
	initialData: {
		title: string;
	};
	courseId: string;
};

const formScheme = z.object({
	title: z.string().min(1, {
		message: 'Title is required'
	})
});

function TitleForm({ initialData, courseId }: TitleFormProps) {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);

	const toggleEdit = () => setIsEditing((current) => !current);

	const form = useForm<z.infer<typeof formScheme>>({
		resolver: zodResolver(formScheme),
		defaultValues: initialData
	});

	const { isSubmitting, isValid } = form.formState;

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
				Course Title
				<Button variant="ghost" onClick={toggleEdit}>
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Edit title
						</>
					)}
				</Button>
			</div>
			{!isEditing ? (
				<p className="text-sm mt-2">{initialData.title}</p>
			) : (
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
											{...field}
											placeholder="e.g. Advance rust"
										/>
									</FormControl>
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

export default TitleForm;
