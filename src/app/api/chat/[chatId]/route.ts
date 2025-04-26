import { streamText } from 'ai'
import { currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { openai } from '@/lib/openai'
import { ratelimit } from '@/lib/rate-limit'
import { MemoryManager } from '@/lib/memory'

interface IParams {
	params: Promise<{ chatId: string }>
}

export async function POST(request: NextRequest, { params }: IParams) {
	try {
		// User authentication
		const user = await currentUser()
		if (!user || !user.emailAddresses || !user.id) return new NextResponse('Unauthorized', { status: 401 })

		// Validation of the request body
		const { prompt } = await request.json()
		if (!prompt) return new NextResponse('Prompt required', { status: 400 })

		// Validation of the rate limit
		const identifier = request.url + '-' + user.id
		const { success } = await ratelimit(identifier)
		if (!success) return new NextResponse('Rate limit exceeded', { status: 429 })

		// Find the companion
		const companion = await prisma.companion.update({
			where: { id: (await params).chatId },
			data: {
				messages: {
					create: {
						content: prompt,
						role: 'user',
						userId: user.id,
					},
				},
			},
		})

		if (!companion) return new NextResponse('Companion not found', { status: 404 })

		const companionKey = {
			companionName: companion.id,
			userId: user.id,
			modelName: 'llama2-13b',
		}

		// Init memory manager
		const memoryManager = await MemoryManager.getInstance()

		// Init chat history
		const records = await memoryManager.readLatestHistory(companionKey)
		if (records.length === 0) {
			await memoryManager.seedChatHistory(companion.seed, '\n\n', companionKey)
		}

		// Update chat history
		await memoryManager.writeToHistory(`User: ${prompt}\n`, companionKey)
		const recentChatHistory = await memoryManager.readLatestHistory(companionKey)

		// Vector search
		const similarDocs = await memoryManager.vectorSearch(recentChatHistory, `${companion.id}.txt`)
		let relevantHistory = ''

		if (!!similarDocs && similarDocs.length !== 0)
			relevantHistory = similarDocs.map((doc) => doc.pageContent).join('\n')

		// Generate a response
		const result = streamText({
			model: openai('gpt-3.5-turbo'),
			system: `
				ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix.

        ${companion.instructions}
        
        Below are relevant details about ${companion.name}'s past and the conversation you are in.
        ${relevantHistory}

				${recentChatHistory}\n${companion.name}:
      `,
			messages: [{ role: 'user', content: prompt }],
		})

		let completion = ''

		// Receive a text stream
		const stream = result.textStream

		// Collect the full response and save it in the DB
		const saveCompletion = async () => {
			for await (const textPart of stream) {
				completion += textPart
			}

			await prisma.companion.update({
				where: {
					id: (await params).chatId,
				},
				data: {
					messages: {
						create: {
							content: completion,
							role: 'system',
							userId: user.id,
						},
					},
				},
			})
		}

		// Start saving in the background
		saveCompletion().catch(console.error)

		// Return the text stream directly
		return result.toDataStreamResponse()
	} catch (error) {
		console.error('[CHAT_POST_ERROR]', error)

		return new NextResponse('Internal server error', { status: 500 })
	}
}
