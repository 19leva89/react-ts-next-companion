'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon, EditIcon, MessagesSquareIcon, MoreVerticalIcon, TrashIcon } from 'lucide-react'

import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui'
import { BotAvatar, ChatDelete } from '@/components/shared'
import { Companion, Message } from '@/generated/prisma/client'

interface Props {
	companion: Companion & {
		messages: Message[]
		_count: { messages: number }
	}
}

export const ChatHeader = ({ companion }: Props) => {
	const router = useRouter()

	const { user } = useUser()

	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

	const handleDeleteClick = () => {
		setIsDropdownOpen(false)
		setIsDeleteDialogOpen(true)
	}

	return (
		<div className='flex w-full items-center justify-between border-b border-primary/10 pb-4'>
			<div className='flex items-center gap-x-2'>
				<Button variant='ghost' size='icon' onClick={() => router.push(`/`)} className='cursor-pointer'>
					<ChevronLeftIcon className='size-8' />
				</Button>

				<BotAvatar src={companion.src} />

				<div className='flex flex-col gap-y-1'>
					<div className='flex items-center gap-x-2'>
						<p className='font-bold'>{companion.name}</p>

						<div className='flex items-center text-xs text-muted-foreground'>
							<MessagesSquareIcon className='mr-1 size-3' />

							{companion._count.messages}
						</div>
					</div>

					<p className='text-xs text-muted-foreground'>Created by {companion.email}</p>
				</div>
			</div>

			{user?.id === companion.userId && (
				<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
					<DropdownMenuTrigger asChild>
						<Button variant='secondary' size='icon' className='cursor-pointer'>
							<MoreVerticalIcon />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align='end'>
						<DropdownMenuItem
							onClick={() => router.push(`/companion/${companion.id}`)}
							className='cursor-pointer'
						>
							<EditIcon className='mr-2 size-4' />
							Edit
						</DropdownMenuItem>

						<DropdownMenuItem onSelect={handleDeleteClick} className='cursor-pointer'>
							<TrashIcon className='mr-2 size-4' />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}

			{/* Delete Dialog */}
			<ChatDelete
				companion={companion}
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
			/>
		</div>
	)
}
