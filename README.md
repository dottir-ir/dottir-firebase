# MedCase - Medical Case Sharing Platform

A platform for doctors to share radiography cases with medical students for educational purposes.

## Features

- User authentication with role-based access (Doctors, Medical Students, Admin)
- Case sharing and viewing
- Image upload and management
- Comments and likes on cases
- User profiles
- Responsive design

## Tech Stack

- React 18+
- TypeScript 4.9+
- Firebase 9+ (Authentication, Firestore, Storage)
- React Router 6+
- Redux Toolkit
- Styled Components
- React Query
- Jest and React Testing Library

## Prerequisites

- Node.js 16+
- npm or yarn
- Firebase account

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/medcase.git
cd medcase
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
  ├── components/        # React components
  │   ├── auth/         # Authentication components
  │   ├── cases/        # Case-related components
  │   ├── layout/       # Layout components
  │   └── profile/      # Profile components
  ├── config/           # Configuration files
  ├── hooks/            # Custom React hooks
  ├── types/            # TypeScript type definitions
  ├── utils/            # Utility functions
  └── App.tsx           # Main App component
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 