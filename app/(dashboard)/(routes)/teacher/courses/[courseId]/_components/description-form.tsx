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
import { Textarea } from '@/components/ui/textarea';

import { axiosInstance } from '@/lib/axios';
import { cn } from '@/lib/utils';

type DescriptionFormProps = {
	initialData: {
		description: string | undefined;
	};
	courseId: string;
};

const formScheme = z.object({
	description: z.string().min(1, {
		message: 'Description is required'
	})
});

function DescriptionForm({ initialData, courseId }: DescriptionFormProps) {
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
				Description Title
				<Button variant="ghost" onClick={toggleEdit}>
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Description title
						</>
					)}
				</Button>
			</div>
			{!isEditing ? (
				<p
					className={cn(
						'text-sm mt-2',
						!initialData.description && 'text-slate-500 italic'
					)}
				>
					{initialData.description || 'No description'}
				</p>
			) : (
				<Form {...form}>
					<form
						className="space-y-4 mt-4"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											disabled={isSubmitting}
											{...field}
											placeholder="e.g. 'This course is about..'"
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

export default DescriptionForm;
