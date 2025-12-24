# Movie Ticket Booking App (Vanilla JS)

A complete, responsive, multi-page movie ticket booking application built using only HTML, CSS, and JavaScript. No frameworks or external libraries are required.

## 📂 Project Structure
* `index.html`: Home page displaying movie posters.
* `movie.html`: Movie details and showtime selection.
* `seats.html`: Interactive seat map and pricing.
* `checkout.html`: User details form and simulated payment.
* `ticket.html`: Confirmation page with printable ticket.
* `styles.css`: Global styles, themes, and responsiveness.
* `app.js`: Main logic (navigation, formulas, localStorage).
* `data.js`: Configuration for movies and seat layout.

## 🛠 Parsing & Data
* **Movies**: Edit `const movies` in `data.js` to add/remove movies.
* **Seat Layout**: Edit `seatLayout` array in `data.js`.
    * `R` = Regular
    * `P` = Premium
    * `F` = Front
    * `_` = Empty Aisle

## 💳 Payment Gateway Info
Currently, the app uses a **simulated payment modal** for demonstration (`app.js` -> `initCheckoutPage`).

**To integrate a real gateway (e.g., Stripe/PayPal):**
1. **Frontend**: Replace the `payment-modal` HTML with the provider's official UI components (e.g., Stripe Elements).
2. **Backend**: You will need a simple server (Node.js/Python/PHP) to keep your secret API keys safe.
3. **Flow**:
    * Button click -> Call your server -> Server calls Stripe -> Returns a Session ID.
    * Frontend redirects user to Stripe checkout page.
    * Stripe redirects back to `ticket.html` (success) or `checkout.html` (cancel).
4. **Validation**: Use Webhooks on your server to confirm payment before marking seats as booked in a real database (MySQL/MongoDB).

## ⚠️ Limitations
* **Storage**: Bookings are saved in the browser's `localStorage`. Clearing cache will remove bookings.
* **Concurrency**: Since there is no backend, two users on different computers won't see each other's bookings in real-time.

## 👨‍🏫 Teacher/Demo Checklist
1. Click a poster on Home Page.
2. Select a Date and Time on Movie Details.
3. Select > 2 seats to show the **10% discount** logic.
4. Try clicking a "Booked" (red) seat to see validation.
5. Enter user details and click "Proceed".
6. In the modal, click "Simulate Success".
7. View the generated ticket.
8. Go back Home, select the same show, and verify the seats are now **red (Booked)**.


