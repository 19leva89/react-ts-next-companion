import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

import { prisma } from '@/lib/prisma'
import { ChatClient } from './_components/chat-client'

interface Props {
	params: Promise<{ chatId: string }>
}

const ChatIdPage = async ({ params }: Props) => {
	const { userId } = await auth()

	if (!userId) return false

	const companion = await prisma.companion.findUnique({
		where: { id: (await params).chatId },
		include: {
			messages: { orderBy: { createdAt: 'asc' }, where: { userId } },
			_count: { select: { messages: true } },
		},
	})

	if (!companion) return redirect('/')

	return <ChatClient companion={companion} />
}

export default ChatIdPage
