import { PropsWithChildren } from 'react'

const ChatLayout = ({ children }: PropsWithChildren) => {
	return <div className="size-full max-w-4xl mx-auto">{children}</div>
}

export default ChatLayout
