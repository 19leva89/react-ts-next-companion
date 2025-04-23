'use client'

import qs from 'query-string'
import { useRouter, useSearchParams } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Category } from '@/generated/prisma'

interface Props {
	data: Category[]
}

export const Categories = ({ data }: Props) => {
	const router = useRouter()
	const searchParams = useSearchParams()

	const categoryId = searchParams.get('categoryId')

	const onClick = (id: string | undefined) => {
		const query = { categoryId: id }

		const url = qs.stringifyUrl({ url: window.location.href, query }, { skipNull: true })

		router.push(url)
	}

	return (
		<div className="flex w-full space-x-2 p-1 overflow-x-auto">
			<button
				onClick={() => onClick(undefined)}
				className={cn(
					'flex items-center px-2 md:px-4 py-2 md:py-3 rounded-md text-center text-xs md:text-sm bg-primary/10 cursor-pointer hover:opacity-75 transition',
					!categoryId ? 'bg-primary/25' : 'bg-primary/10',
				)}
			>
				Newest
			</button>

			{data.map((item) => (
				<button
					key={item.id}
					onClick={() => onClick(item.id)}
					className={cn(
						'flex items-center px-2 md:px-4 py-2 md:py-3 rounded-md text-center text-xs md:text-sm bg-primary/10 cursor-pointer hover:opacity-75 transition',
						item.id === categoryId ? 'bg-primary/25' : 'bg-primary/10',
					)}
				>
					{item.name}
				</button>
			))}
		</div>
	)
}
