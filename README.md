# Quick Shop - Telegram Mini App

A modern e-commerce mini app built for Telegram with React, TypeScript, and Tailwind CSS.

## Features

- 🛍️ **Product Catalog** - Browse and search products
- 🏷️ **Categories** - Organized product categories with sub-categories
- 🔍 **Search** - Real-time product search
- 🛒 **Shopping Cart** - Add and manage cart items
- 👤 **User Authentication** - Telegram-based authentication
- 💳 **Wallet Integration** - Manage user wallet and transactions
- 📱 **Responsive Design** - Optimized for mobile and desktop
- 🌙 **Dark/Light Theme** - Automatic theme detection from Telegram
- ⚡ **React Query** - Efficient data fetching and caching

## API Integration

The app is now integrated with a backend API using React Query v5 for efficient data management.

### Configuration

To configure the backend URL:

1. Open `src/Config/axios.ts`
2. Replace the placeholder URL:
   ```typescript
   const API_BASE_URL = 'https://your-backend-url.com'; // Replace with actual backend URL
   ```

### Project Structure

```
src/
├── Api/
│   ├── endpoints.ts              # API endpoint definitions
│   └── queriesAndMutations.ts    # React Query hooks
├── hooks/                        # Custom React Query hooks
│   ├── use-fetch-data.tsx        # Custom useQuery hook
│   ├── use-infinit-data.tsx      # Custom useInfiniteQuery hook
│   └── use-mutate-data.tsx       # Custom useMutation hook
├── components/ui/                # Reusable UI components
├── Config/                       # App configuration
├── Constants/                    # App constants
├── Layouts/                      # Layout components
├── Services/                     # API services
├── Stores/                       # State management (Zustand)
├── Types/                        # TypeScript type definitions
├── Utils/                        # Utility functions
└── Views/                        # Page components
```

## API Endpoints

The app uses the following API endpoints:

- `GET /products?page=1&page_size=20&type=GLOBAL_TOPSELLERS` - Get recommended products
- `GET /products/categories` - Get all categories
- `GET /products/products?search=query&local=en_US&country=US&currency=USD&page=1&page_size=20` - Search products
- `GET /products/{product_id}` - Get product details

## React Query Integration

The app uses React Query v5 with custom hooks for:

- **Data Fetching**: `useFetchData` - For regular queries
- **Infinite Queries**: `useInfiniteData` - For paginated data
- **Mutations**: `useMutateData` - For data modifications

### Usage Example

```typescript
// Fetch recommended products
const { data, isLoading, error } = useGetRecommendedProducts({
  page: 1,
  page_size: 20,
  type: 'GLOBAL_TOPSELLERS'
});

// Search products
const { data, isLoading, error } = useSearchProducts({
  search: 'phone',
  page: 1,
  page_size: 20,
  local: 'en_US',
  country: 'US',
  currency: 'USD'
});

// Get categories
const { data, isLoading, error } = useGetCategories();
```

## Authentication

The app automatically authenticates users through Telegram's Web App API. The `telegram_id` is automatically included in all API requests.

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://your-backend-url.com
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query v5** - Data fetching and caching
- **Zustand** - State management
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Router** - Navigation
- **Vite** - Build tool

## Telegram Mini App Features

- Automatic user authentication
- Theme detection (light/dark)
- Native Telegram UI components
- Haptic feedback
- Cloud storage integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
