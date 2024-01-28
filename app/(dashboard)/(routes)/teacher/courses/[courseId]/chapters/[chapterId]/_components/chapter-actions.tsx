'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Loader2, Trash } from 'lucide-react';
import { toast } from 'sonner';

import ConfirmModal from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';

import { axiosInstance } from '@/lib/axios';

type ChapterActionsProps = {
	disabled: boolean;
	isPublished: boolean;
	courseId: string;
	chapterId: string;
};

function ChapterActions({
	chapterId,
	courseId,
	disabled,
	isPublished
}: ChapterActionsProps) {
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);
	const [togglingPublish, setTogglingPublish] = useState(false);

	const togglePublish = useCallback(async () => {
		setTogglingPublish(true);
		try {
			if (isPublished) {
				await axiosInstance.patch(
					`/api/courses/${courseId}/chapters/${chapterId}/unpublish`
				);
				toast.success('Chapter unpublished.');
			} else {
				await axiosInstance.patch(
					`/api/courses/${courseId}/chapters/${chapterId}/publish`
				);
				toast.success('Chapter published.');
			}
			router.refresh();
		} catch (error) {
			toast.error('Something went wrong!');
		} finally {
			setTogglingPublish(false);
		}
	}, [isPublished, setTogglingPublish]);

	async function onDelete() {
		try {
			setIsDeleting(true);
			await axiosInstance.delete(
				`/api/courses/${courseId}/chapters/${chapterId}`
			);
			toast.success('Chapter deleted, you will be redirected soon.');
			router.refresh();
			router.push(`/teacher/courses/${courseId}`);
		} catch (error) {
			toast.error('Something went wrong!');
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<div className="flex items-center gap-x-2">
			<Button
				disabled={disabled || isDeleting || togglingPublish}
				onClick={togglePublish}
				size="sm"
				variant="outline"
			>
				{togglingPublish && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
				{isPublished ? 'Unpublish' : 'Publish'}
			</Button>
			<ConfirmModal onConfirm={onDelete}>
				<Button
					disabled={isDeleting || togglingPublish}
					size="sm"
					variant="destructive"
				>
					{isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
					<Trash className="h-4 w-4" />
				</Button>
			</ConfirmModal>
		</div>
	);
}

export default ChapterActions;
