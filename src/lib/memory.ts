import { Redis } from '@upstash/redis'
import { PineconeStore } from '@langchain/pinecone'
import { OpenAIEmbeddings } from '@langchain/openai'
import { Pinecone } from '@pinecone-database/pinecone'

export type CompanionKey = {
	userId: string
	modelName: string
	companionName: string
}

export class MemoryManager {
	private static instance: MemoryManager
	private history: Redis
	private pineconeClient: Pinecone
	private pineconeIndex: ReturnType<Pinecone['index']>

	public constructor() {
		this.history = Redis.fromEnv()
		this.pineconeClient = new Pinecone({
			apiKey: process.env.PINECONE_API_KEY!,
		})
		this.pineconeIndex = this.pineconeClient.index(process.env.PINECONE_INDEX!)
	}

	public async init() {
		try {
			await this.pineconeIndex.describeIndexStats()
		} catch (error) {
			console.error('Failed to connect to Pinecone index:', error)

			throw new Error('Pinecone index not available')
		}
	}

	public async vectorSearch(recentChatHistory: string, companionFileName: string) {
		try {
			const embeddings = new OpenAIEmbeddings({
				openAIApiKey: process.env.OPENAI_API_KEY!,
			})

			const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
				pineconeIndex: this.pineconeIndex,
				namespace: companionFileName,
			})

			const similarDocs = await vectorStore.similaritySearch(recentChatHistory, 3)
			return similarDocs
		} catch (error) {
			console.error('Failed to perform vector search:', error)
			return []
		}
	}

	public static async getInstance(): Promise<MemoryManager> {
		if (!MemoryManager.instance) {
			MemoryManager.instance = new MemoryManager()
			await MemoryManager.instance.init()
		}

		return MemoryManager.instance
	}

	private generateRedisCompanionKey(companionKey: CompanionKey): string {
		return `${companionKey.companionName}-${companionKey.modelName}-${companionKey.userId}`
	}

	public async writeToHistory(text: string, companionKey: CompanionKey) {
		if (!companionKey || typeof companionKey.userId == 'undefined') {
			console.error('Companion key set incorrectly!')

			return ''
		}

		const key = this.generateRedisCompanionKey(companionKey)
		const result = await this.history.zadd(key, {
			score: Date.now(),
			member: text,
		})

		return result
	}

	public async readLatestHistory(companionKey: CompanionKey): Promise<string> {
		if (!companionKey || typeof companionKey.userId == 'undefined') {
			console.error('Companion key set incorrectly!')

			return ''
		}

		const key = this.generateRedisCompanionKey(companionKey)

		let result = await this.history.zrange(key, 0, Date.now(), {
			byScore: true,
		})

		result = result.slice(-30).reverse()
		const recentChats = result.reverse().join('\n')

		return recentChats
	}

	public async seedChatHistory(seedContent: string, delimiter: string = '\n', companionKey: CompanionKey) {
		const key = this.generateRedisCompanionKey(companionKey)

		if (await this.history.exists(key)) {
			console.log('User already has chat history')

			return
		}

		const content = seedContent.split(delimiter)
		let counter = 0

		for (const line of content) {
			await this.history.zadd(key, { score: counter, member: line })
			counter += 1
		}
	}
}
