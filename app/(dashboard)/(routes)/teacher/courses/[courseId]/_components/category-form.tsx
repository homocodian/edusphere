'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Course } from '@prisma/client';
import { Loader2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { axiosInstance } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

type CategoryFormProps = {
	initialData: {
		categoryId: Course["categoryId"]
	};
	courseId: Course['id'];
	options: { label: string; value: string }[];
};

const formScheme = z.object({
	categoryId: z.string().min(1)
});

function CategoryForm({ initialData, courseId, options }: CategoryFormProps) {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);

	const toggleEdit = () => setIsEditing((current) => !current);

	const form = useForm<z.infer<typeof formScheme>>({
		resolver: zodResolver(formScheme),
		defaultValues: {
			categoryId: initialData.categoryId || ''
		}
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

	const selectedOption = options.find(
		(option) => option.value === initialData.categoryId
	);

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex justify-between items-center">
				Course category
				<Button variant="ghost" onClick={toggleEdit}>
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Edit category
						</>
					)}
				</Button>
			</div>
			{!isEditing ? (
				<p
					className={cn(
						'text-sm mt-2',
						!initialData.categoryId && 'text-slate-500 italic'
					)}
				>
					{selectedOption?.label || 'No category'}
				</p>
			) : (
				<Form {...form}>
					<form
						className="space-y-4 mt-4"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Combobox options={...options} {...field}  />
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

export default CategoryForm;
