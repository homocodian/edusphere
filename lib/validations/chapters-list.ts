import { z } from 'zod';

export const updateData = z.object({
	id: z.string().min(1),
	position: z.number()
});

export const updateDataArray = z.array(updateData);

export type UpdateData = z.infer<typeof updateData>;
