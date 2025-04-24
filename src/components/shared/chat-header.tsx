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
import { Companion, Message } from '@/generated/prisma'
import { BotAvatar, ChatDelete } from '@/components/shared'

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
		<div className="flex items-center justify-between w-full pb-4 border-b border-primary/10">
			<div className="flex gap-x-2 items-center">
				<Button variant="ghost" size="icon" onClick={() => router.push(`/`)} className="cursor-pointer">
					<ChevronLeftIcon className="size-8" />
				</Button>

				<BotAvatar src={companion.src} />

				<div className="flex flex-col gap-y-1">
					<div className="flex items-center gap-x-2">
						<p className="font-bold">{companion.name}</p>

						<div className="flex items-center text-xs text-muted-foreground">
							<MessagesSquareIcon className="size-3 mr-1" />

							{companion._count.messages}
						</div>
					</div>

					<p className="text-xs text-muted-foreground">Created by {companion.email}</p>
				</div>
			</div>

			{user?.id === companion.userId && (
				<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
					<DropdownMenuTrigger asChild>
						<Button variant="secondary" size="icon" className="cursor-pointer">
							<MoreVerticalIcon />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => router.push(`/companion/${companion.id}`)}
							className="cursor-pointer"
						>
							<EditIcon className="size-4 mr-2" />
							Edit
						</DropdownMenuItem>

						<DropdownMenuItem onSelect={handleDeleteClick} className="cursor-pointer">
							<TrashIcon className="size-4 mr-2" />
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
