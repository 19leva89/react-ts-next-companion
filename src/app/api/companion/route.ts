import { currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { checkSubscription } from '@/lib/subscription'

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const user = await currentUser()
		const { src, name, description, instructions, seed, categoryId } = body

		if (!user || !user.id || !user.emailAddresses) {
			return new NextResponse('Unauthorized', { status: 401 })
		}

		if (!src || !name || !description || !instructions || !seed || !categoryId) {
			return new NextResponse('Missing required field', { status: 400 })
		}

		const isPro = await checkSubscription()

		if (!isPro) {
			return new NextResponse('Pro subscription is required to create new companion', { status: 403 })
		}

		const companion = await prisma.companion.create({
			data: {
				categoryId,
				userId: user.id,
				email: user.emailAddresses[0].emailAddress,
				src,
				name,
				description,
				instructions,
				seed,
			},
		})

		return NextResponse.json(companion)
	} catch (error) {
		console.error('[COMPANION_POST]', error)

		return new NextResponse('Internal error', { status: 500 })
	}
}
