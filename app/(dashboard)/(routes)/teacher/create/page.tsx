'use client';

import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { axiosInstance } from '@/lib/axios';

const formSchema = z.object({
	title: z.string().min(1, { message: 'Title is required' })
});

function CreatePage() {
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: ''
		}
	});

	const { isSubmitting, isValid } = form.formState;

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = await axiosInstance.post('/api/courses', values);
			router.push(`/teacher/courses/${response.data.id}`);
			toast.success('Course created');
		} catch (error) {
			toast.error('Something went wrong.');
		}
	}

	return (
		<div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
			<div>
				<h1 className="text-2xl font-medium">Name your course</h1>
				<p className="text-sm text-slate-600">
					What would you like to name your course? Don&apos;t worry, you can
					change this later.
				</p>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8 mt-8"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Title</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="e.g 'Advance web development'"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										What will you teach in this course?
									</FormDescription>
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-x-2">
							<Button asChild type="button" variant="ghost">
								<Link href="/">Cancel</Link>
							</Button>
							<Button disabled={!isValid || isSubmitting}>
								{isSubmitting && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Continue
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}

export default CreatePage;
