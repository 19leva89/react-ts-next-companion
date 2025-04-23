This project contains the following technologies


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