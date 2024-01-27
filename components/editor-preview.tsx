'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

import 'react-quill/dist/quill.bubble.css';

type EditorPreviewProps = {
	value: string;
};

function EditorPreview({ value }: EditorPreviewProps) {
	const ReactQuill = useMemo(
		() => dynamic(() => import('react-quill'), { ssr: false }),
		[]
	);

	return <ReactQuill theme="bubble" value={value} readOnly />;
}

export default EditorPreview;
