'use client'

import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui'
import { Companion } from '@/generated/prisma'

interface Props {
	companion: Companion
	isOpen: boolean
	onClose: () => void
}

export const ChatDelete = ({ companion, isOpen, onClose }: Props) => {
	const router = useRouter()

	const onDelete = async () => {
		try {
			await axios.delete(`/api/companion/${companion.id}`)

			toast.success('Success')

			router.refresh()
			router.push('/')

			// onClose()
		} catch (error) {
			toast.error('Something Went Wrong')
		}
	}

	return (
		<AlertDialog open={isOpen} onOpenChange={onClose}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete this companion and remove all
						associated data
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>

					<AlertDialogAction onClick={onDelete} className="cursor-pointer">
						Confirm Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
