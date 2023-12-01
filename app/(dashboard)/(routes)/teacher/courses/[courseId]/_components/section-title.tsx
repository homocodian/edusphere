import { LucideIcon } from 'lucide-react';

import IconBadge from '@/components/icon-badge';

type SectionTitleProps = {
	icon: LucideIcon;
	title: string;
};

function SectionTitle({ title, icon }: SectionTitleProps) {
	return (
		<div className="flex items-center gap-x-2">
			<IconBadge icon={icon} />
			<h2 className="text-xl font-medium">{title}</h2>
		</div>
	);
}

export default SectionTitle;
