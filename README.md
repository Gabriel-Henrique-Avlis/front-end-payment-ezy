# Payment Application - Frontend

A React + TypeScript application for managing invoice payments with integrated payment processing.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (or compatible version)
- npm or pnpm

### Installation

1. Navigate to the frontend directory:
```bash
cd front-end-payment-app
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your API base URL:
```env
VITE_API_BASE_URL=http://localhost:8080
```

### Running the Application

Start the development server:
```bash
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Building for Production

```bash
npm run build
# or
pnpm build
```

The production build will be available in the `dist` folder.

## 🧪 Running Tests

### Run all tests:
```bash
npm test
# or
pnpm test
```

### Run tests with UI (interactive):
```bash
npm run test:ui
# or
pnpm run test:ui
```

### Run tests with coverage:
```bash
npm run test:coverage
# or
pnpm run test:coverage
```

## 📋 Features

### Implemented Functional Requirements

1. **Invoice Management**
   - Display list of invoices to pay (mocked data as per requirements)
   - Select multiple invoices for batch payment
   - View invoice details (vendor, amount, due date, priority)
   - Real-time total calculation with fees

2. **Payment Processing**
   - Integrated payment form with card details
   - API integration via axios
   - Real-time validation
   - Success/error feedback

3. **Idempotency Support**
   - Automatic generation of unique idempotency keys using `crypto.randomUUID()`
   - Idempotency-Key header sent with every payment request
   - Handles 409 Conflict responses for duplicate requests

4. **Security**
   - Card details not stored locally
   - Secure HTTPS communication (when backend supports it)
   - Sensitive data sent only to backend

## 🏗️ Project Structure

```
front-end-payment-app/
├── src/
│   ├── invoices/              # Invoice feature module
│   │   ├── components/        # Invoice-specific components
│   │   │   ├── InvoicesTable.tsx
│   │   │   ├── InvoiceRow.tsx
│   │   │   ├── PaymentModal.tsx   # Payment form with API integration
│   │   │   └── Summary.tsx
│   │   ├── data/              # Mock invoice data
│   │   │   └── sampleInvoices.ts
│   │   ├── hooks/             # Invoice-related hooks
│   │   │   └── useInvoiceSelection.ts
│   │   ├── services/          # Invoice API services
│   │   │   └── invoiceService.ts
│   │   ├── types/             # TypeScript type definitions
│   │   │   └── Invoice.ts
│   │   └── InvoicesPage.tsx   # Main invoice page
│   ├── services/              # Global services
│   │   ├── api.ts             # Axios instance configuration
│   │   └── paymentService.ts  # Payment API integration
│   ├── test/                  # Test configuration
│   │   └── setup.ts
│   └── main.tsx               # Application entry point
├── .env.example               # Environment variable template
├── package.json
├── vite.config.ts            # Vite + Vitest configuration
└── README.md
```

## 🔧 Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **Vitest** - Unit testing framework
- **Testing Library** - React component testing

## 📝 API Integration

The frontend integrates with a backend Payment API. Key endpoints:

### POST /payments
Creates a new payment with idempotency support.

**Headers:**
- `Idempotency-Key`: Unique UUID to prevent duplicate payments
- `Content-Type`: application/json

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "cardNumber": "4111111111111111",
  "expiry": "12/25",
  "cvv": "123"
}
```

**Response (200 OK):**
```json
{
  "id": "payment-123",
  "refNumber": "REF-789456",
  "paymentTime": "2026-02-27T10:30:00Z",
  "amount": 100.00,
  "fee": 5.00,
  "status": "success"
}
```

**Error (409 Conflict):**
```json
{
  "message": "Idempotency key already used with different payload"
}
```

## 🧪 Testing Strategy

The application includes comprehensive unit tests covering:

### 1. Payment Service Tests (`paymentService.test.ts`)
- ✅ Idempotency key generation (UUID v4 format)
- ✅ Unique key generation on multiple calls
- ✅ Correct API call with headers
- ✅ Success response handling
- ✅ Error propagation
- ✅ 409 Conflict handling for duplicate idempotency keys
- ✅ Card number inclusion validation

### 2. Invoice Selection Hook Tests (`useInvoiceSelection.test.ts`)
- ✅ Initial state (no selections)
- ✅ Toggle selection on/off
- ✅ Total amount calculation
- ✅ Fee calculation (fixed $5 when items selected)
- ✅ Multiple selections
- ✅ Clear all selections
- ✅ Recalculation on invoice list changes

## 🔐 Security Considerations

1. **No Plaintext Storage**: Card details are never stored in localStorage or state beyond the form
2. **Idempotency**: Prevents duplicate payments via unique request keys
3. **HTTPS**: Should be used in production for all API calls
4. **Environment Variables**: Sensitive configuration kept in .env files
5. **Input Validation**: Client-side validation before API calls

## 📚 Additional Documentation

- [Front-end Implementation Details](front-end-payment-app/README.md)
- API documentation: See root OpenAPI specification (if available)

## 🤝 Contributing

When making changes:
1. Ensure all tests pass (`npm test`)
2. Add tests for new features
3. Follow TypeScript best practices
4. Update documentation as needed

## 📄 License

See [LICENSE](LICENSE) file for details.
