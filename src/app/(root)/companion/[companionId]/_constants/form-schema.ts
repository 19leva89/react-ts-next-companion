import * as z from 'zod'

export const formSchema = z.object({
	name: z.string().min(1, {
		message: 'Name is Required',
	}),
	description: z.string().min(1, {
		message: 'Description is Required',
	}),
	instructions: z.string().min(200, {
		message: 'Instructions require at least 200 characters',
	}),
	seed: z.string().min(200, {
		message: 'Seed requires at least 200 characters',
	}),
	src: z.string().min(1, {
		message: 'Image is Required',
	}),
	categoryId: z.string().min(1, {
		message: 'Category is Required',
	}),
})

export type IFormSchema = z.infer<typeof formSchema>
