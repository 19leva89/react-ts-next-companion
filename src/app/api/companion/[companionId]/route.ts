import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'

import { prisma } from '@/lib/prisma'
import { checkSubscription } from '@/lib/subscription'

interface IParams {
	params: Promise<{ companionId: string }>
}

export async function PATCH(req: NextRequest, { params }: IParams) {
	try {
		const body = await req.json()
		const user = await currentUser()
		const { src, name, description, instructions, seed, categoryId } = body

		if (!(await params).companionId) {
			return new NextResponse('Companion ID is required', { status: 400 })
		}

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

		const companion = await prisma.companion.update({
			where: {
				id: (await params).companionId,
				userId: user.id,
			},
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
		console.error('[COMPANION_PATCH]', error)

		return new NextResponse('Internal error', { status: 500 })
	}
}

export async function DELETE(req: NextRequest, { params }: IParams) {
	try {
		const { userId } = await auth()

		if (!userId) return new NextResponse('Unauthorized', { status: 401 })

		const companion = await prisma.companion.delete({
			where: {
				id: (await params).companionId,
				userId,
			},
		})

		return NextResponse.json(companion)
	} catch (error) {
		console.error('[COMPANION_DELETE]', error)

		return new NextResponse('Internal error', { status: 500 })
	}
}
