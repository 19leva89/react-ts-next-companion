import { auth } from '@clerk/nextjs/server'

import { prisma } from '@/lib/prisma'

const DAY_IN_MS = 86_400_000

export const checkSubscription = async () => {
	const { userId } = await auth()

	if (!userId) return false

	const userSubscription = await prisma.userSubscription.findUnique({
		where: {
			userId,
		},
		select: {
			stripeCurrentPeriodEnd: true,
			stripeCustomerId: true,
			stripePriceId: true,
			stripeSubscriptionId: true,
		},
	})

	if (!userSubscription) return false

	const isValid = Boolean(
		userSubscription.stripePriceId &&
			userSubscription.stripeCurrentPeriodEnd &&
			userSubscription.stripeCurrentPeriodEnd.getTime() + DAY_IN_MS > Date.now(),
	)

	return isValid
}
