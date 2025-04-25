import dotenv from 'dotenv'
import { currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { Replicate } from '@langchain/community/llms/replicate'
import { CallbackManager } from '@langchain/core/callbacks/manager'

import { prisma } from '@/lib/prisma'
import { ratelimit } from '@/lib/rate-limit'
import { MemoryManager } from '@/lib/memory'

dotenv.config({ path: `.env` })

interface IParams {
	params: Promise<{ chatId: string }>
}

export async function POST(request: NextRequest, { params }: IParams) {
	try {
		const user = await currentUser()
		if (!user || !user.emailAddresses || !user.id) {
			return new Response('Unauthorized!', { status: 401 })
		}

		const { prompt } = await request.json()
		if (!prompt) {
			return new Response('Missing prompt', { status: 400 })
		}

		const identifier = request.url + '-' + user.id
		const { success } = await ratelimit(identifier)

		if (!success) return new NextResponse('Ratelimit Exceeded!', { status: 429 })

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

		if (!companion) return new NextResponse('Companion Not Found.', { status: 404 })

		const name = companion.id
		const companion_file_name = name + '.txt'

		const companionKey = {
			companionName: name,
			userId: user.id,
			modelName: 'llama2-13b',
		}

		const memoryManager = await MemoryManager.getInstance()

		const records = await memoryManager.readLatestHistory(companionKey)

		if (records.length === 0) await memoryManager.seedChatHistory(companion.seed, '\n\n', companionKey)

		await memoryManager.writeToHistory('User: ' + prompt + '\n', companionKey)

		const recentChatHistory = await memoryManager.readLatestHistory(companionKey)

		const similarDocs = await memoryManager.vectorSearch(recentChatHistory, companion_file_name)

		let relevantHistory = ''

		if (!!similarDocs && similarDocs.length !== 0)
			relevantHistory = similarDocs.map((doc) => doc.pageContent).join('\n')

		const model = new Replicate({
			model: 'a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5',
			input: { max_length: 2048 },
			apiKey: process.env.REPLICATE_API_TOKEN,
			callbackManager: CallbackManager.fromHandlers({
				handleLLMStart: async () => console.log('[LLM] Streaming from model'),
				handleLLMNewToken: async (token) => {
					// Отправка каждого токена как данных потока
					if (token) {
						stream.push(token)
					}
				},
				handleLLMEnd: async () => {
					console.log('[LLM END]')
				},
				handleLLMError: async (err: Error) => console.error('[LLM ERROR]', err),
			}),
		})

		model.verbose = true

		const resp = String(
			await model
				.invoke(
					`
        ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix. 

        ${companion.instructions}

        Below are relevant details about ${companion.name}'s past and the conversation you are in.
        ${relevantHistory}


        ${recentChatHistory}\n${companion.name}:`,
				)
				.catch(console.error),
		)

		const cleaned = resp.replaceAll(',', '')
		const chunks = cleaned.split('\n')
		const response = chunks[0]

		await memoryManager.writeToHistory('' + response.trim(), companionKey)

		if (response !== undefined && response.length > 1) {
			memoryManager.writeToHistory('' + response.trim(), companionKey)

			await prisma.companion.update({
				where: {
					id: (await params).chatId,
				},
				data: {
					messages: {
						create: {
							content: response.trim(),
							role: 'system',
							userId: user.id,
						},
					},
				},
			})
		}

		const { Readable } = require('stream')
		const stream = new Readable({
			read() {}, // Этот метод будет вызываться при чтении потока
		})
		stream.push(response)
		// stream.push(null)

		return new NextResponse(stream, {
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
				'Transfer-Encoding': 'chunked',
			},
		})
	} catch (error) {
		console.error('[CHAT_POST]', error)

		return new NextResponse('Internal Error', { status: 500 })
	}
}
