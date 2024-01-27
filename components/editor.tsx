'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

import 'react-quill/dist/quill.snow.css';

type EditorProps = {
	onChange: (value: string) => void;
	value: string;
};

function Editor({ onChange, value }: EditorProps) {
	const ReactQuill = useMemo(
		() => dynamic(() => import('react-quill'), { ssr: false }),
		[]
	);

	return <ReactQuill theme="snow" onChange={onChange} value={value} />;
}

export default Editor;
