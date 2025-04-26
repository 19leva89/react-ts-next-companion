import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
	const body = await req.text()
	const signature = req.headers.get('stripe-signature')!
	const secret = process.env.STRIPE_WEBHOOK_SECRET!

	let event: Stripe.Event

	try {
		event = stripe.webhooks.constructEvent(body, signature, secret)
	} catch (err) {
		const error = err instanceof Error ? err : new Error('Unknown error')

		console.error('❌ Webhook Error:', error.message)

		return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
	}

	try {
		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object as Stripe.Checkout.Session

				if (!session.subscription) {
					throw new Error('Subscription ID not found in session')
				}

				const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

				if (!session?.metadata?.userId) {
					return new NextResponse('User id is required', { status: 400 })
				}

				await prisma.userSubscription.create({
					data: {
						userId: session.metadata.userId,
						stripeCustomerId: subscription.customer as string,
						stripeSubscriptionId: subscription.id,
						stripePriceId: subscription.items.data[0].price.id,
						stripeCurrentPeriodEnd: new Date(subscription.items.data[0]?.current_period_end * 1000),
					},
				})
				break
			}

			case 'invoice.payment_succeeded': {
				const invoice = event.data.object as Stripe.Invoice & {
					parent?: {
						subscription_details?: {
							subscription?: string
						}
					}
				}

				const subscriptionId = invoice.parent?.subscription_details?.subscription

				if (!subscriptionId) {
					console.error('❌ Subscription ID not found on invoice.parent.subscription_details')
					return new NextResponse('Subscription ID not found', { status: 400 })
				}

				const subscription = await stripe.subscriptions.retrieve(subscriptionId)

				await prisma.userSubscription.upsert({
					where: {
						stripeSubscriptionId: subscription.id,
					},
					create: {
						userId: subscription.customer as string,
						stripeCustomerId: subscription.customer as string,
						stripeSubscriptionId: subscription.id,
						stripePriceId: subscription.items.data[0].price.id,
						stripeCurrentPeriodEnd: new Date(subscription.items.data[0]?.current_period_end * 1000),
					},
					update: {
						stripePriceId: subscription.items.data[0].price.id,
						stripeCurrentPeriodEnd: new Date(subscription.items.data[0]?.current_period_end * 1000),
					},
				})

				break
			}

			default:
				console.warn(`⚠️ Unhandled event type: ${event.type}`)
		}
	} catch (error) {
		console.error('❌ Webhook processing error:', error)

		return new NextResponse('Internal Server Error', { status: 500 })
	}

	return new NextResponse(null, { status: 200 })
}
