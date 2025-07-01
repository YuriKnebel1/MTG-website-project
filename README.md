# MTG Website

A comprehensive Magic: The Gathering collection management and deck building platform built with Next.js.

## 🃏 Features

- **Card Collection Management**: Track your MTG card collection with detailed information
- **Deck Builder**: Create and manage your MTG decks
- **Price Tracking**: Monitor card prices from multiple sources (Scryfall, Liga Magic)
- **Meta Analysis**: Stay updated with current meta trends
- **User Authentication**: Secure user accounts with NextAuth.js
- **Responsive Design**: Beautiful, modern UI built with Tailwind CSS
- **Database**: Persistent data storage with Prisma and SQLite

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: Prisma with SQLite
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright
- **Deployment**: Docker support

## 📋 Prerequisites

- Node.js 18+
- npm or yarn package manager
- Git

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd MTG-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up the database**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Set up environment variables**

   ```bash
   # Copy the example env file and fill in your values
   cp .env.example .env.local
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser** Navigate to [http://localhost:3000](http://localhost:3000)

## 🏃‍♂️ Scripts

### Development

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

### Database

- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed the database

### Testing

- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run Playwright E2E tests

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages and API routes
│   ├── api/            # API endpoints
│   ├── cards/          # Card search and management
│   ├── collection/     # Collection management
│   ├── dashboard/      # User dashboard
│   ├── decks/          # Deck builder and management
│   ├── login/          # Authentication pages
│   ├── meta/           # Meta analysis
│   ├── prices/         # Price tracking
│   └── register/       # User registration
├── components/         # Reusable React components
│   └── ui/            # UI component library
└── lib/               # Utility functions and configurations
    ├── auth.ts        # Authentication configuration
    ├── prisma.ts      # Database client
    └── utils.ts       # General utilities

__tests__/             # Jest test files
e2e/                   # Playwright E2E tests
prisma/                # Database schema and migrations
public/                # Static assets
```

## 🗄️ API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Collection Management

- `GET /api/collection` - Get user collection
- `POST /api/collection/add` - Add card to collection
- `DELETE /api/collection/remove` - Remove card from collection
- `PUT /api/collection/update` - Update card in collection
- `GET /api/collection/count` - Get collection statistics

### Card Data

- `GET /api/meta` - Get meta information
- `GET /api/meta/untapped` - Get data from Untapped
- `GET /api/prices/scryfall` - Get prices from Scryfall
- `GET /api/prices/liga-magic` - Get prices from Liga Magic

### Utilities

- `GET /api/health` - Health check endpoint
- `POST /api/translate` - Translation service
- `GET /api/test` - Test endpoint

## 🧪 Testing

The project includes comprehensive testing setup:

### Unit & Integration Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### E2E Tests

```bash
# Run Playwright tests
npm run test:e2e
```

## 🐳 Docker Support

Build and run with Docker:

```bash
# Build the image
docker build -t mtg-website .

# Run the container
docker run -p 3000:3000 mtg-website
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and contribution guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Scryfall API](https://scryfall.com/docs/api) for MTG card data
- [Liga Magic](https://www.ligamagic.com.br/) for Brazilian market prices
- [Next.js](https://nextjs.org/) for the amazing framework
- [Prisma](https://prisma.io/) for database management
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Happy deck building!** 🃏✨
