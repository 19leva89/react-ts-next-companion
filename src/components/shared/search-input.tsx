'use client'

import qs from 'query-string'
import { SearchIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEventHandler, useEffect, useState } from 'react'

import { Input } from '@/components/ui'
import { useDebounce } from '@/hooks/use-debounce'

export const SearchInput = () => {
	const router = useRouter()
	const searchParams = useSearchParams()

	const name = searchParams.get('name')
	const categoryId = searchParams.get('categoryId')

	const [value, setValue] = useState<string>(name || '')

	const debouncedValue = useDebounce<string>(value, 500)

	const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		setValue(e.target.value)
	}

	useEffect(() => {
		const query = {
			name: debouncedValue,
			categoryId,
		}

		const url = qs.stringifyUrl(
			{
				url: window.location.href,
				query,
			},
			{ skipEmptyString: true, skipNull: true },
		)

		router.push(url)
	}, [debouncedValue, categoryId, router])

	return (
		<div className="relative">
			<SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />

			<Input value={value} onChange={onChange} placeholder="Search..." className="pl-11 bg-primary/10" />
		</div>
	)
}
