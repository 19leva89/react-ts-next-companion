// import { prisma } from '@/lib/prisma'
// import Companions from '@/components/companions'
// import Categories from '@/components/categories'

import { SearchInput } from '@/components/shared'

interface Props {
	searchParams: {
		categoryId: string
		name: string
	}
}

const RootPage = async ({ searchParams }: Props) => {
	// const data = await prisma.companion.findMany({
	// 	where: {
	// 		categoryId: searchParams.categoryId,
	// 		name: {
	// 			search: searchParams.name,
	// 		},
	// 	},
	// 	orderBy: {
	// 		createdAt: 'desc',
	// 	},
	// 	include: {
	// 		_count: {
	// 			select: {
	// 				messages: true,
	// 			},
	// 		},
	// 	},
	// })

	// const categories = await prisma.category.findMany()

	return (
		<div className="h-full p-4 space-y-2">
			<SearchInput />

			{/* <Categories data={categories} /> */}

			{/* <Companions data={data} /> */}
		</div>
	)
}

export default RootPage
