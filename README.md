This project contains the following technologies

Animation and Interaction:
- React Spinners (loading indicators)

AI (Artificial Intelligence) tools:
- AI (message generation)
- LangChain (AI framework)
- OpenAI (creating AI models)
- Pinecone (vector database)

Authentication and User Management:
- Clerk (Authentication and User Management)

Core Technologies:
- React 19
- TypeScript
- Next 15 (framework)

Data Fetching and State Management:
- Axios (sending requests to backend)
- Prisma 6 (ORM for DB)
- Zustand (state management)

Form and Validation:
- React Hook Form (working with forms)
- Zod (first schema validation)

Image Handling and Optimization:
- Next Cloudinary (optimize images)
- Sharp (image optimizer)

Middleware and Server Utilities:
- Concurrently (all projects are running in tandem)
- Upstash Ratelimit (rate limiting)
- Upstash Redis (serverless Redis database)

Payment:
- Stripe (payment service provider)

Styling and UI Frameworks:
- Lucide React (stylization)
- Next Themes (using theme switcher)
- shadcn/ui (stylization)
- Tailwind CSS (stylization)
- Sonner (stylization)

Utilities and Libraries:
- Knip (code analyzer and declutter)
- PostCSS (transforms CSS code to AST)
- QueryString (parse and stringify URL)



To run the client and server via concurrently:
terminal powershell -> npm run all
terminal powershell -> npm run lint (loading ESLint checker)
terminal powershell -> npm run knip

terminal powershell -> npx prisma generate
terminal powershell -> npx prisma db push
terminal powershell -> npx prisma db pull
terminal powershell -> node prisma/seed.ts (loading test DB)
terminal powershell -> npx prisma migrate reset

terminal CommandPrompt -> stripe login
terminal CommandPrompt -> stripe listen --forward-to localhost:3000/api/webhook