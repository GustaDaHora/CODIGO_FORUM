# CODIGO_FORUM

A modern forum application built with Next.js, Prisma, and NextAuth.

## Overview

CODIGO_FORUM is a full-featured discussion platform designed for developers to ask questions, share knowledge, and engage in meaningful discussions about programming and software development topics.

## Features

- User authentication with NextAuth
- Database integration with Prisma ORM
- Responsive UI built with Tailwind CSS
- Thread and post management
- User profiles
- Syntax highlighting for code snippets

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL (via Vercel Postgres)
- **Authentication**: NextAuth.js
- **ORM**: Prisma

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GustaDaHora/CODIGO_FORUM.git
   cd CODIGO_FORUM
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://your_database_url"
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   # or
   yarn prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

This project is configured for deployment on Vercel. When deployed, the build script will automatically generate the Prisma client, push the database schema, and seed the database with initial data.

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
