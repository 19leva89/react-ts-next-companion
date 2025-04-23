'use client'

import axios from 'axios'
import { toast } from 'sonner'
import { Wand2Icon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import {
	Button,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
	Textarea,
} from '@/components/ui'
import { ImageUpload } from '@/components/shared'
import { Category, Companion } from '@/generated/prisma'
import { PREAMBLE, SEED_CHAT } from '../_constants/constants'
import { formSchema, IFormSchema } from '../_constants/form-schema'

interface Props {
	initialData: Companion | null
	categories: Category[]
}

export const CompanionForm = ({ initialData, categories }: Props) => {
	const router = useRouter()

	const form = useForm<IFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: '',
			description: '',
			instructions: '',
			seed: '',
			src: '',
			categoryId: undefined,
		},
	})

	const isLoading = form.formState.isSubmitting

	const onSubmit = async (values: IFormSchema) => {
		try {
			if (initialData) {
				await axios.patch(`/api/companion/${initialData.id}`, values)
			} else {
				await axios.post('/api/companion', values)
			}

			toast.success('Success')

			router.refresh()
			router.push('/')
		} catch (error) {
			toast.error('Something Went Wrong!')
		}
	}

	return (
		<div className="h-full max-w-3xl p-4 space-y-2 mx-auto">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
					<div className="w-full space-y-2">
						<div>
							<h3 className="text-lg font-medium">General Information</h3>

							<p className="text-sm text-muted-foreground">General information about your Companion</p>
						</div>

						<Separator className="bg-primary/10" />
					</div>

					<FormField
						name="src"
						render={({ field }) => (
							<FormItem className="flex flex-col items-center justify-center space-y-4">
								<FormControl>
									<ImageUpload value={field.value} disabled={isLoading} onChange={field.onChange} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							name="name"
							control={form.control}
							render={({ field }) => (
								<FormItem className="col-span-2 md:col-span-1">
									<FormLabel>Name</FormLabel>

									<FormControl>
										<Input disabled={isLoading} placeholder="Elon Musk" {...field} />
									</FormControl>

									<FormDescription>This is how your AI Companion will be named</FormDescription>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							name="description"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>

									<FormControl>
										<Input disabled={isLoading} placeholder="CEO & Founder of Tesla, SpaceX" {...field} />
									</FormControl>

									<FormDescription>Short description for your AI Companion</FormDescription>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>

									<Select
										value={field.value}
										defaultValue={field.value}
										disabled={isLoading}
										onValueChange={field.onChange}
									>
										<FormControl>
											<SelectTrigger className="bg-background cursor-pointer">
												<SelectValue defaultValue={field.value} placeholder="Select a category" />
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											{categories.map((category) => (
												<SelectItem key={category.id} value={category.id} className="cursor-pointer">
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<FormDescription>Select a category for your AI</FormDescription>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="w-full space-y-2">
						<div>
							<h3 className="text-lg font-medium">Configuration</h3>

							<p className="text-sm text-muted-foreground">Detailed instructions for AI Behavior</p>
						</div>

						<Separator className="bg-primary/10" />
					</div>

					<FormField
						name="instructions"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Instructions</FormLabel>

								<FormControl>
									<Textarea
										rows={7}
										placeholder={PREAMBLE}
										disabled={isLoading}
										className="bg-background resize-none"
										{...field}
									/>
								</FormControl>

								<FormDescription>
									Describe in detail your companion&apos;s backstory and relevant details
								</FormDescription>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name="seed"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Example Conversation</FormLabel>

								<FormControl>
									<Textarea
										rows={7}
										placeholder={SEED_CHAT}
										disabled={isLoading}
										className="bg-background resize-none"
										{...field}
									/>
								</FormControl>

								<FormDescription>
									Write couple of examples of a human chatting with your AI companion, write expected answers
								</FormDescription>

								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex justify-center w-full">
						<Button size="lg" disabled={isLoading} className="cursor-pointer">
							{initialData ? 'Edit your companion' : 'Create your companion'}

							<Wand2Icon className="size-4 ml-2" />
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}
