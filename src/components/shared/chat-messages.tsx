'use client'

import { ComponentRef, useEffect, useRef, useState } from 'react'

import { Companion } from '@/generated/prisma'
import { ChatMessage, ChatMessageProps } from '@/components/shared'

interface Props {
	messages: ChatMessageProps[]
	isLoading: boolean
	companion: Companion
}

export const ChatMessages = ({ companion, isLoading, messages }: Props) => {
	const scrollRef = useRef<ComponentRef<'div'>>(null)

	const [fakeLoading, setFakeLoading] = useState<boolean>(messages.length === 0 ? true : false)

	useEffect(() => {
		const timeout = setTimeout(() => {
			setFakeLoading(false)
		}, 1000)

		return () => {
			clearTimeout(timeout)
		}
	}, [])

	useEffect(() => {
		scrollRef?.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages.length])

	return (
		<div className="flex-1 pr-4 overflow-y-auto">
			<ChatMessage
				role="system"
				src={companion.src}
				content={`Hello, I'm ${companion.name}, ${companion.description}.`}
				isLoading={fakeLoading}
			/>

			{messages.map((message, index) => (
				<ChatMessage
					key={`${message.role}-${index}`}
					role={message.role}
					src={companion.src}
					content={message.content}
				/>
			))}

			{isLoading && <ChatMessage role="system" src={companion.src} isLoading />}

			<div ref={scrollRef} />
		</div>
	)
}
