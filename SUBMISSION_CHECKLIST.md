# Pre-Submission Checklist

Use this checklist before submitting your project to GitHub.

## ✅ Installation & Setup

- [ ] Install dependencies
  ```bash
  cd front-end-payment-app
  npm install
  # or
  pnpm install
  ```

- [ ] Create `.env` file from template
  ```bash
  cp .env.example .env
  ```

- [ ] Configure API base URL in `.env`
  ```env
  VITE_API_BASE_URL=http://localhost:8080
  ```

## ✅ Functional Requirements

### Frontend Implementation
- [x] ✅ Invoice list displayed (mocked data)
- [x] ✅ Payment form with required fields:
  - firstName (derived from name field)
  - lastName (derived from name field)
  - cardNumber
  - expiry
  - cvv
- [x] ✅ Payment API integration with axios
- [x] ✅ Idempotency-Key header support
- [x] ✅ Error handling (including 409 Conflict)
- [x] ✅ Loading states
- [x] ✅ Success confirmation

### API Integration
- [x] ✅ POST /payments endpoint implemented in service
- [x] ✅ Idempotency key generation (crypto.randomUUID())
- [x] ✅ Proper headers sent (Idempotency-Key, Content-Type)
- [x] ✅ Card number cleaning (whitespace removal)
- [x] ✅ Error response handling

## ✅ Testing

- [ ] Run all tests
  ```bash
  npm test
  ```

- [x] ✅ Payment service tests created
  - Idempotency key generation
  - API call structure
  - Error handling
  - 409 Conflict scenario

- [x] ✅ Invoice selection hook tests created
  - Selection logic
  - Total calculations
  - Fee calculations

- [ ] Verify all tests pass

## ✅ Documentation

- [x] ✅ README.md includes:
  - How to run frontend ✓
  - How to run tests ✓
  - Installation instructions ✓
  - Environment setup ✓
  - API documentation ✓

- [x] ✅ AI_USAGE.md created with:
  - 2-5 representative prompts ✓
  - What AI was used for ✓
  - What was changed/rejected ✓
  - Validation methods ✓

## ✅ Code Quality

- [ ] Run linter
  ```bash
  npm run lint
  ```

- [ ] Build succeeds
  ```bash
  npm run build
  ```

- [x] ✅ TypeScript errors resolved (test deps need installation)
- [x] ✅ No hardcoded secrets
- [x] ✅ Environment variables used for configuration

## ✅ Security

- [x] ✅ Card numbers NOT stored in localStorage
- [x] ✅ Card data cleared on modal close
- [x] ✅ HTTPS support via environment config
- [x] ✅ No sensitive data in error messages
- [x] ✅ Idempotency prevents duplicate payments

## ✅ Git & GitHub

- [ ] Create GitHub repository
- [ ] Add all files
  ```bash
  git add .
  ```

- [ ] Commit with meaningful message
  ```bash
  git commit -m "Payment application frontend implementation"
  ```

- [ ] Push to GitHub
  ```bash
  git push origin main
  ```

- [ ] Verify README displays correctly on GitHub
- [ ] Check all files are included

## ✅ Final Checks

- [ ] Test the dev server starts
  ```bash
  npm run dev
  ```

- [ ] Click through the UI
  - Invoice selection works
  - Payment modal opens
  - Form validation works
  - Can view success/error states (may need mock backend)

- [ ] Review file structure matches what's documented
- [ ] Double-check .env.example is committed (but NOT .env)

## 📝 Known Limitations

Since backend is not implemented:
- Payment API calls will fail (expected)
- Mock data is used for invoices (per requirements)
- Success flow can be tested with a mock backend or by updating the service

---

## 🚀 Ready to Submit!

Once all items are checked, your project is ready to submit with the GitHub repo link.

**What to include in submission:**
- GitHub repository URL
- Confirmation that README includes run/test instructions
- Mention of AI_USAGE.md file
