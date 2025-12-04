'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCompletion } from '@ai-sdk/react'

import { Companion, Message } from '@/generated/prisma/client'
import { ChatForm, ChatHeader, ChatMessageProps, ChatMessages } from '@/components/shared'

interface Props {
	companion: Companion & {
		messages: Message[]
		_count: {
			messages: number
		}
	}
}

export const ChatClient = ({ companion }: Props) => {
	const router = useRouter()
	const [messages, setMessages] = useState<ChatMessageProps[]>(companion.messages)

	const { input, isLoading, handleInputChange, handleSubmit, setInput } = useCompletion({
		api: `/api/chat/${companion.id}`,
		onFinish(_prompt, completion) {
			const systemMessage: ChatMessageProps = {
				role: 'system',
				content: completion,
				companionId: companion.id,
				createdAt: new Date(),
			} as Message

			setMessages((current) => [...current, systemMessage])
			setInput('')

			router.refresh()
		},
		onError: (error) => {
			console.error('Stream Error Details:', {
				error,
				lastInput: input,
				companionId: companion.id,
			})

			setInput('')

			router.refresh()
		},
	})

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		const userMessage = {
			role: 'user',
			content: input,
			companionId: companion.id,
			createdAt: new Date(),
		} as Message

		setMessages((current) => [...current, userMessage])

		handleSubmit(e)
	}

	return (
		<div className='flex h-full flex-col space-y-2 p-4'>
			<ChatHeader companion={companion} />

			<ChatMessages companion={companion} isLoading={isLoading} messages={messages} />

			<ChatForm
				input={input}
				isLoading={isLoading}
				handleInputChange={handleInputChange}
				onSubmit={onSubmit}
			/>
		</div>
	)
}
