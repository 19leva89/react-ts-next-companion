'use client'

import { toast } from 'sonner'
import { useTheme } from 'next-themes'
import { CopyIcon } from 'lucide-react'
// import { BeatLoader } from 'react-spinners'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { BotAvatar, UserAvatar } from '@/components/shared'

export interface ChatMessageProps {
	role: 'system' | 'user'
	content?: string
	isLoading?: boolean
	src?: string
}

export const ChatMessage = ({ role, content, isLoading, src }: ChatMessageProps) => {
	const { theme } = useTheme()

	const onCopy = () => {
		if (!content) return

		navigator.clipboard.writeText(content)

		toast.success('Message copied to clipboard')
	}

	return (
		<div className={cn('group flex items-start gap-x-3 w-full py-4', role === 'user' && 'justify-end')}>
			{role !== 'user' && src && <BotAvatar src={src} />}

			<div className="max-w-sm px-4 py-2 rounded-md text-sm bg-primary/10">
				{/* {isLoading ? <BeatLoader size={5} color={theme === 'light' ? 'black' : 'white'} /> : content} */}
			</div>

			{role === 'user' && <UserAvatar />}

			{role !== 'user' && (
				<Button
					variant="ghost"
					size="icon"
					onClick={onCopy}
					className="opacity-0 cursor-pointer group-hover:opacity-100 transition"
				>
					<CopyIcon className="size-4" />
				</Button>
			)}
		</div>
	)
}
