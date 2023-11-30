import { PrismaClient } from '@prisma/client';

const database = new PrismaClient();

async function main() {
	try {
		await database.category.createMany({
			data: [
				{ name: 'Computer Science' },
				{ name: 'Music' },
				{ name: 'Photography' },
				{ name: 'Accounting' },
				{ name: 'Filming' }
			]
		});
	} catch (error) {
		console.log('Failed to seed category in database.', error);
	} finally {
		await database.$disconnect();
	}
}

main();
