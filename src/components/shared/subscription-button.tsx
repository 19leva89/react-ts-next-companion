'use client'

import axios from 'axios'
import { toast } from 'sonner'
import { useState } from 'react'
import { SparklesIcon } from 'lucide-react'

import { Button } from '@/components/ui'

interface Props {
	isPro: boolean
}

export const SubscriptionButton = ({ isPro }: Props) => {
	const [loading, setLoading] = useState<boolean>(false)

	const onClick = async () => {
		try {
			setLoading(true)

			const response = await axios.get('/api/stripe')

			window.location.href = response.data.url
		} catch (error) {
			toast('Something Went Wrong!')
		} finally {
			setLoading(false)
		}
	}

	return (
		<Button
			variant={isPro ? 'default' : 'premium'}
			size="sm"
			disabled={loading}
			onClick={onClick}
			className="mx-2 cursor-pointer"
		>
			{isPro ? 'Manage subscription' : 'Upgrade'}

			{!isPro && <SparklesIcon className="size-4 ml-2 fill-white" />}
		</Button>
	)
}
