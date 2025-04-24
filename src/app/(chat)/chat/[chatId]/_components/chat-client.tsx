'use client'

import { useCompletion } from 'ai/react'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Companion, Message } from '@/generated/prisma'
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
		onFinish(prompt, completion) {
			const systemMessage: ChatMessageProps = {
				role: 'system',
				content: completion,
			}

			setMessages((current) => [...current, systemMessage])
			setInput('')

			router.refresh()
		},
	})

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		const userMessage: ChatMessageProps = {
			role: 'user',
			content: input,
		}

		setMessages((current) => [...current, userMessage])

		handleSubmit(e)
	}

	return (
		<div className="flex flex-col h-full p-4 space-y-2">
			<ChatHeader companion={companion} />

			<ChatMessages companion={companion} isLoading={isLoading} messages={messages} />

			<ChatForm
				handleInputChange={handleInputChange}
				input={input}
				onSubmit={onSubmit}
				isLoading={isLoading}
			/>
		</div>
	)
}
