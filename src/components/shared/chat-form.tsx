'use client'

import { ChatRequestOptions } from 'ai'
import { ChangeEvent, SubmitEvent } from 'react'
import { SendHorizontalIcon } from 'lucide-react'

import { Button, Input } from '@/components/ui'

interface Props {
	input: string
	isLoading: boolean
	handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void
	onSubmit: (e: SubmitEvent, chatRequestOptions?: ChatRequestOptions | undefined) => void
}

export const ChatForm = ({ input, isLoading, handleInputChange, onSubmit }: Props) => {
	return (
		<form onSubmit={onSubmit} className='flex items-center gap-x-2 border-t border-primary/10 py-4'>
			<Input
				value={input}
				disabled={isLoading}
				onChange={handleInputChange}
				placeholder='Type a message'
				className='rounded-lg bg-primary/10'
			/>

			<Button variant='ghost' disabled={isLoading} className='cursor-pointer'>
				<SendHorizontalIcon className='size-6' />
			</Button>
		</form>
	)
}
