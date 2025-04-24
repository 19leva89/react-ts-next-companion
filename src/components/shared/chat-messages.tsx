'use client'

import { ElementRef, useEffect, useRef, useState } from 'react'

import { Companion } from '@/generated/prisma'
import { ChatMessage, ChatMessageProps } from '@/components/shared'

interface Props {
	messages: ChatMessageProps[]
	isLoading: boolean
	companion: Companion
}

export const ChatMessages = ({ companion, isLoading, messages }: Props) => {
	const scrollRef = useRef<ElementRef<'div'>>(null)

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
				isLoading={fakeLoading}
				src={companion.src}
				role="system"
				content={`Hello, I'm ${companion.name}, ${companion.description}.`}
			/>

			{messages.map((message) => (
				<ChatMessage
					key={message.content}
					role={message.role}
					content={message.content}
					src={companion.src}
				/>
			))}

			{isLoading && <ChatMessage role="system" src={companion.src} isLoading />}

			<div ref={scrollRef} />
		</div>
	)
}
