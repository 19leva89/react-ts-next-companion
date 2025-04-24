import { Avatar, AvatarImage } from '@/components/ui'

interface Props {
	src: string
}

export const BotAvatar = ({ src }: Props) => {
	return (
		<Avatar className="size-12">
			<AvatarImage src={src} className="size-12" />
		</Avatar>
	)
}
