import { auth } from '@clerk/nextjs/server'

import { prisma } from '@/lib/prisma'
import { CompanionForm } from './_components/companion-form'

interface Props {
	params: Promise<{ companionId: string }>
}

const CompanionIdPage = async ({ params }: Props) => {
	const { userId } = await auth()

	if (!userId) return false

	const companion = await prisma.companion.findUnique({
		where: { id: (await params).companionId, userId },
	})

	const categories = await prisma.category.findMany()

	return <CompanionForm initialData={companion} categories={categories} />
}

export default CompanionIdPage
