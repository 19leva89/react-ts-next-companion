import { prisma } from '@/lib/prisma'
import { Categories, Companions, SearchInput } from '@/components/shared'

interface Props {
	searchParams: Promise<{
		categoryId: string
		name: string
	}>
}

const RootPage = async ({ searchParams }: Props) => {
	const data = await prisma.companion.findMany({
		where: {
			categoryId: (await searchParams).categoryId,
			name: {
				search: (await searchParams).name,
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			_count: {
				select: {
					messages: true,
				},
			},
		},
	})

	const categories = await prisma.category.findMany()

	return (
		<div className="h-full p-4 space-y-2">
			<SearchInput />

			<Categories data={categories} />

			<Companions data={data} />
		</div>
	)
}

export default RootPage
