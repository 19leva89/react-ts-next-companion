'use client'

import axios from 'axios'
import { toast } from 'sonner'
import { useState } from 'react'

import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Separator,
} from '@/components/ui'
import { useClient } from '@/hooks/use-client'
import { useProModal } from '@/hooks/use-pro-modal'

export const ProModal = () => {
	const proModal = useProModal()

	const { isMounted } = useClient()

	const [loading, setLoading] = useState<boolean>(false)

	const onSubscribe = async () => {
		try {
			setLoading(true)
			const response = await axios.get('/api/stripe')

			window.location.href = response.data.url
		} catch (error) {
			toast.error('Something Went Wrong!')
		} finally {
			setLoading(false)
		}
	}

	if (!isMounted) return null

	return (
		<Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
			<DialogContent>
				<DialogHeader className="space-y-4">
					<DialogTitle className="text-center">Upgrade to Pro</DialogTitle>

					<DialogDescription className="text-center space-y-2">
						Create
						<span className="mx-1 text-sky-500 font-medium">Custom AI</span>
						Companions!
					</DialogDescription>
				</DialogHeader>

				<Separator />
				<div className="flex justify-between">
					<p className="text-2xl font-medium">
						$9<span className="text-sm font-normal">.99 / mo</span>
					</p>

					<Button variant="premium" disabled={loading} onClick={onSubscribe} className="cursor-pointer">
						Subscribe
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
