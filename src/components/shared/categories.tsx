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
		<div className='flex w-full space-x-2 overflow-x-auto p-1'>
			<button
				onClick={() => onClick(undefined)}
				className={cn(
					'flex cursor-pointer items-center rounded-md bg-primary/10 px-2 py-2 text-center text-xs transition hover:opacity-75 md:px-4 md:py-3 md:text-sm',
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
						'flex cursor-pointer items-center rounded-md bg-primary/10 px-2 py-2 text-center text-xs transition hover:opacity-75 md:px-4 md:py-3 md:text-sm',
						item.id === categoryId ? 'bg-primary/25' : 'bg-primary/10',
					)}
				>
					{item.name}
				</button>
			))}
		</div>
	)
}
