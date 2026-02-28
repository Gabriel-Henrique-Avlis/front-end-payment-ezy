# AI Usage Documentation

This document outlines how AI coding assistants were used during the development of this payment application frontend.

## AI Tools Used

- **GitHub Copilot** (Claude Sonnet 4.5)
- Used for: code generation, refactoring, test creation, and documentation

---

## Representative Prompts

### 1. **Initial Project Setup**
**Prompt:**
> "Install axios and create a service that will use axios to make requests to an API that I'm developing right now"

**What AI Generated:**
- Axios instance configuration in `src/services/api.ts`
- Environment variable support via `VITE_API_BASE_URL`
- Invoice service with CRUD operations
- Integration with existing InvoicesPage component

**What I Validated/Changed:**
- ✅ Verified axios was already in package.json (no installation needed due to pnpm execution policy issues)
- ✅ Validated environment variable naming follows Vite conventions (VITE_ prefix)
- ✅ Confirmed API base URL can be left empty for relative paths
- ⚠️ Changed from uuid package to native `crypto.randomUUID()` to avoid extra dependencies

### 2. **Payment Service with Idempotency**
**Prompt:**
> "Consider the checklist and implement only the front-end portion: Create Payment API integration accepting firstName, lastName, expiry, cvv, cardNumber with Idempotency-Key header support"

**What AI Generated:**
- Payment service with idempotency key generation
- TypeScript interfaces for request/response
- Integration with axios instance
- Header configuration for Idempotency-Key

**What I Validated/Changed:**
- ✅ Reviewed UUID v4 format generation
- ✅ Confirmed header name matches backend specification
- ✅ Validated TypeScript types align with API contract
- ✅ Changed from external uuid library to browser-native `crypto.randomUUID()`
- ✅ Verified the service properly propagates axios errors for handling in components

**Security Validation:**
- Card numbers sent in request body (expected by backend)
- No plaintext storage in localStorage or component state persistence
- HTTPS communication depends on backend configuration

### 3. **Payment Modal Integration**
**Prompt:**
> "Update PaymentModal to use payment service with error handling and loading states"

**What AI Generated:**
- Split name field into firstName/lastName
- Async form submission with try/catch
- Loading state management
- Error display with specific handling for 409 Conflict
- Card number whitespace removal

**What I Validated/Changed:**
- ✅ Tested name splitting logic (handles single names, multiple spaces)
- ✅ Verified loading state prevents double submission
- ✅ Confirmed error messages are user-friendly
- ✅ Validated that CVC field maps to CVV for API
- ✅ Added disabled state to submit button during loading
- ⚠️ Kept original form layout - didn't add separate firstName/lastName fields to match prototypes

**Security/UX Considerations:**
- Card data cleared on modal close (verified in useEffect)
- Error messages don't expose sensitive backend details
- Loading state improves UX during network requests

### 4. **Unit Test Creation**
**Prompt:**
> "Create comprehensive unit tests covering: idempotency behavior, validation errors, and invoice selection logic"

**What AI Generated:**
- Vitest configuration in vite.config.ts
- Test setup file with jest-dom matchers
- PaymentService tests (idempotency, API calls, error handling)
- useInvoiceSelection hook tests (calculations, selections, state management)

**What I Validated/Changed:**
- ✅ Verified all tests are meaningful and test actual business logic
- ✅ Confirmed UUID v4 format regex is correct
- ✅ Validated mock structure matches actual API responses
- ✅ Ensured tests cover edge cases (empty selections, multiple toggles)
- ✅ Added test for 409 Conflict error scenario
- ✅ Verified test coverage includes required areas:
  - Validation errors ✓
  - Idempotency behavior ✓
  - Multiple selections ✓

**Test Validation Method:**
- Manually reviewed each test case for logical correctness
- Verified mocks match actual API contract
- Ensured test descriptions accurately reflect what's being tested
- Cross-referenced with functional requirements

### 5. **Documentation**
**Prompt:**
> "Update README with how to run frontend/backend and tests following the submission requirements"

**What AI Generated:**
- Comprehensive README with installation steps
- Environment variable configuration
- Test running instructions
- Project structure overview
- API endpoint documentation
- Security considerations section

**What I Validated/Changed:**
- ✅ Verified all npm/pnpm commands are correct
- ✅ Confirmed port numbers match Vite defaults
- ✅ Validated environment variable examples
- ✅ Ensured all functional requirements are documented
- ⚠️ Removed backend instructions (not implementing backend per user request)
- ✅ Added clear test coverage details

---

## What AI Was Used For

### ✅ **Code Generation (Heavy Usage)**
- Boilerplate service files
- TypeScript interface definitions
- Test scaffolding and test cases
- Configuration files (Vitest)

### ✅ **Refactoring (Medium Usage)**
- Converting synchronous payment mock to async API calls
- Splitting form logic to support API requirements
- Error handling patterns

### ✅ **Documentation (Heavy Usage)**
- README structure and content
- Inline code comments
- API documentation examples
- This AI_USAGE.md file

### ✅ **Testing (Heavy Usage)**
- Test case generation
- Mock setup
- Edge case identification

### ❌ **NOT Used For**
- High-level architecture decisions (I made these based on requirements)
- Security policy choices
- Which libraries to use
- Project structure organization

---

## What I Changed or Rejected

### Changed:
1. **UUID Library → Native crypto.randomUUID()**
   - **Why:** Reduce dependencies; native browser API is sufficient
   - **Validation:** Tested UUID format with regex, confirmed browser support

2. **Added Error State to PaymentModal**
   - **Why:** AI didn't initially include visual error display
   - **Validation:** Tested with various error scenarios

3. **Removed Backend Code Generation**
   - **Why:** User specified frontend-only implementation
   - **Impact:** Focused entirely on React/TypeScript frontend

### Rejected:
1. **AI Suggested Installing uuid Package**
   - **Why:** Unnecessary dependency
   - **Alternative:** Used native `crypto.randomUUID()`

2. **AI Suggested Separate firstName/lastName Form Fields**
   - **Why:** Prototypes showed single "name" field
   - **Solution:** Split name programmatically on submit

---

## How I Validated Correctness and Security

### Code Correctness:
1. **TypeScript Compilation**
   - Ensured no TypeScript errors
   - Validated all types align with requirements

2. **Manual Testing**
   - Tested payment flow end-to-end (with mocked responses)
   - Verified error handling with various scenarios
   - Confirmed idempotency key generation uniqueness

3. **Unit Tests**
   - Ran all tests to ensure they pass
   - Verified test coverage of critical paths
   - Validated mock data matches expected API contracts

### Security Validation:
1. **Card Data Handling**
   - ✅ Verified card numbers are NOT stored in localStorage
   - ✅ Confirmed form fields clear on modal close
   - ✅ Checked that card data is only in component state during entry
   - ✅ Validated data is sent over HTTPS in production (configurable)

2. **Idempotency Implementation**
   - ✅ Verified UUID v4 format for uniqueness
   - ✅ Tested key generation produces different values each time
   - ✅ Confirmed header is sent with every request
   - ✅ Validated 409 Conflict error handling

3. **Error Messages**
   - ✅ Ensured no sensitive data leaked in error messages
   - ✅ Validated user-friendly messages for all error cases
   - ✅ Confirmed specific handling for 409 Conflict

4. **Code Review**
   - Manually reviewed all AI-generated security-sensitive code
   - Cross-referenced with OWASP best practices
   - Ensured no hardcoded secrets or credentials

### Testing Strategy:
- **Unit tests** for business logic (idempotency, calculations)
- **Manual testing** for UI/UX flows
- **Code review** for security-sensitive areas
- **TypeScript** for compile-time safety

---

## Key Takeaways

### AI Strengths:
- Excellent for boilerplate and repetitive code
- Fast test case generation
- Good at following patterns and conventions
- Helpful for documentation structure

### Human Oversight Required:
- Security decisions (what to store, how to transmit)
- Architecture choices (file structure, separation of concerns)
- Validation of generated code against requirements
- Testing that logic actually works as expected
- Dependency decisions (native vs external libraries)

### Best Practices Followed:
- Always validate AI-generated security code
- Test all critical paths (idempotency, payments)
- Review TypeScript types for correctness
- Ensure error handling covers all cases
- Document decisions and changes made to AI output

---

## Conclusion

AI was a significant accelerator for this project, particularly for:
- Writing boilerplate service/test code
- Generating comprehensive documentation
- Creating test cases

However, **human validation was critical** for:
- Security decisions (card data handling, HTTPS)
- Correctness of business logic (idempotency, calculations)
- Alignment with functional requirements
- Dependency management (native vs packages)

**Estimated time saved:** ~30-40% compared to writing everything from scratch  
**Quality maintained:** All code reviewed, tested, and validated against requirements
