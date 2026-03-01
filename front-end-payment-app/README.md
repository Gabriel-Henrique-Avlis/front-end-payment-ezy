# Payment Application - React + TypeScript + Vite

A modern React payment processing application built with TypeScript and Vite. This project demonstrates a fully functional payment modal with card validation, idempotent payment requests, and comprehensive test coverage.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install
```

### Running the Application

```bash
# Start the development server
pnpm dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the optimized production bundle
pnpm build

# Preview the production build locally
pnpm preview
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests in watch mode
pnpm test

# Run tests once (CI mode)
pnpm test --run

# Run tests with UI dashboard
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

### Test Coverage

The project includes comprehensive tests with 59+ test cases covering:
- Payment service API calls and error handling
- Invoice selection and filtering
- Payment helper utilities (card masking, formatting, validation)
- Error message handling for various API responses
- API configuration and axios instance setup

Current coverage includes:
- **100%** of utility functions (paymentHelpers)
- **100%** of hook logic (useInvoiceSelection)
- **80%+** of service layer (paymentService, errorHandler)

## 📁 Project Structure

```
src/
├── App.tsx                    # Main application component
├── main.tsx                   # Application entry point
├── index.css                  # Global styles
├── App.css                    # App component styles
│
├── invoices/                  # Invoice-related features
│   ├── InvoicesPage.tsx      # Main invoices list page
│   ├── InvoicesPage.css      # Page styles
│   ├── components/           # Reusable components
│   │   ├── InvoicesTable.tsx # Invoices data table
│   │   ├── InvoiceRow.tsx    # Individual invoice row
│   │   ├── Summary.tsx       # Total summary display
│   │   ├── PaymentModal.tsx  # Payment form modal
│   │   ├── PaymentModal.css  # Modal styles
│   │   ├── VisaLogo.tsx      # Visa card SVG component
│   │   ├── MastercardLogo.tsx # Mastercard card SVG component
│   │   ├── AmexLogo.tsx      # American Express card SVG component
│   │   └── DiscoverLogo.tsx  # Discover card SVG component
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useInvoiceSelection.ts # Invoice selection logic
│   │   └── useInvoiceSelection.test.ts # Hook tests
│   │
│   ├── types/                # TypeScript type definitions
│   │   ├── Invoice.ts        # Invoice data type
│   │   ├── InvoiceRow.ts     # Invoice row type
│   │   ├── InvoiceSortKey.ts # Sort key enum
│   │   ├── InvoicesTable.ts  # Table configuration type
│   │   └── PaymentModal.ts   # Payment form types
│   │
│   ├── utils/                # Utility functions
│   │   ├── paymentHelpers.ts # Card formatting, payment utilities
│   │   └── paymentHelpers.test.ts # Utility tests
│   │
│   └── data/                 # Mock data
│       └── sampleInvoices.ts # Sample invoice data
│
├── services/                 # API and business logic
│   ├── api.ts               # Axios instance configuration
│   ├── api.test.ts          # API configuration tests
│   ├── paymentService.ts    # Payment API integration
│   ├── paymentService.test.ts # Payment service tests
│   ├── errorHandler.ts      # Error message handling
│   └── errorHandler.test.ts # Error handler tests
│
├── components/              # Shared components
│   └── [shared components]
│
├── data/                    # Shared mock data
│   └── [shared data]
│
├── hooks/                   # Shared custom hooks
│   └── [shared hooks]
│
├── types/                   # Shared TypeScript types
│   └── [shared types]
│
└── test/
    └── setup.ts             # Vitest configuration and setup
```

## 🔌 API Integration

### Configuration

The application uses `axios` with a centralized instance configured in `src/services/api.ts`.

Set the API base URL via environment variable:

```bash
# .env file at project root
VITE_API_BASE_URL=http://localhost:4000
```

Or pass it via command line:

```bash
VITE_API_BASE_URL=http://localhost:8080 pnpm dev
```

### Payment Requests

Payment processing is handled by `createPayment()` in `src/services/paymentService.ts`:

- **Endpoint**: `POST /payments`
- **Idempotency**: Includes `Idempotency-Key` header to prevent duplicate charges
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "cardNumber": "4111111111111111",
    "expiry": "12/25",
    "cvv": "123"
  }
  ```
- **Response**: Payment confirmation with reference number and timestamp

## 💳 Payment Features

- **Card Validation**: Real-time card number formatting and masking
- **Card Brand Detection**: Visual indicators for Visa, Mastercard, Amex, Discover
- **Embedded SVG Logos**: All card logos are embedded as React components (no external requests)
- **Error Handling**: Comprehensive error messages with specific handling for:
  - Duplicate transactions (409 Conflict)
  - Invalid card data (400 Bad Request)
  - Network failures
  - API unavailability
- **Idempotent Requests**: Prevents accidental duplicate payments with UUID v4 keys
- **Beautiful UI**: Responsive payment modal with real-time validation

## 📝 Linting

```bash
# Run ESLint
pnpm lint
```

## 🛠 Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool with HMR
- **Vitest** - Unit testing framework
- **Axios** - HTTP client
- **CSS3** - Styling with responsive design

## 📄 License

This project is provided as-is for demonstration purposes.
