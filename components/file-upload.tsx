'use client';

import { toast } from 'sonner';

import { ourFileRouter } from '@/app/api/uploadthing/core';
import { UploadDropzone } from '@/lib/uploadthing';

type FileUploadProps = {
	onChange: (url?: string) => void;
	endpoint: keyof typeof ourFileRouter;
};

export function FileUpload({ onChange, endpoint }: FileUploadProps) {
	return (
		<UploadDropzone
			endpoint={endpoint}
			onClientUploadComplete={(res) => {
				onChange(res[0].url);
			}}
			onUploadError={(error: Error) => {
				toast.error(`${error.message}`);
			}}
		/>
	);
}
