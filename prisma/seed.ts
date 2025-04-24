const { PrismaClient } = require('../src/generated/prisma')

const prisma = new PrismaClient()

async function up() {
	await prisma.category.createMany({
		data: [
			{ name: 'Famous People' },
			{ name: 'Movies & TV' },
			{ name: 'Musicians' },
			{ name: 'Games' },
			{ name: 'Animals' },
			{ name: 'Philosophy' },
			{ name: 'Scientists' },
		],
	})
}

async function down() {
	await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`
	await prisma.$executeRaw`TRUNCATE TABLE user_subscription;`
	await prisma.$executeRaw`TRUNCATE TABLE message;`
	await prisma.$executeRaw`TRUNCATE TABLE companion;`
	await prisma.$executeRaw`TRUNCATE TABLE category;`
	await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`
}

async function main() {
	try {
		await down()
		await up()
	} catch (e) {
		console.error(e)
	}
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
