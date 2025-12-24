/**
 * Movie Ticket Booking App - Main Logic
 * Handles routing, rendering, state management, and booking flow.
 */

// Loop variable conventions: i (outer/rows), j (inner/cols), s (spaces)

const STRIP_KEY_BOOKINGS = 'mtba_bookings';
const STRIP_KEY_SEATS = 'mtba_seats'; // Stores booked seats per show

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    const pageId = document.body.id;

    // Load initial data check
    if (!localStorage.getItem(STRIP_KEY_SEATS)) {
        // Seed some booked seats for demo purposes
        const demoBookings = {
            '1_2025-06-12_10:00 AM_0_0': true, // Interstellar, first show, seat 0,0
            '1_2025-06-12_10:00 AM_0_1': true,
            '2_2025-06-12_01:00 PM_4_4': true  // Cyber Chronicles, Premium seat
        };
        localStorage.setItem(STRIP_KEY_SEATS, JSON.stringify(demoBookings));
    }

    // Router
    switch (pageId) {
        case 'home-page':
            renderHomePage();
            break;
        case 'movie-page':
            renderMoviePage();
            break;
        case 'seats-page':
            renderSeatsPage();
            break;
        case 'checkout-page':
            initCheckoutPage();
            break;
        case 'ticket-page':
            renderTicketPage();
            break;
    }
}

// --- UTILS ---

function formatCurrency(amount) {
    return '$' + parseFloat(amount).toFixed(2);
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// --- HOME PAGE ---

function renderHomePage() {
    const grid = document.querySelector('.movie-grid');
    if (!grid) return;

    // i is index in movies array
    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.onclick = () => window.location.href = `movie.html?id=${movie.id}`;

        card.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}">
            <div class="movie-overlay">
                <h3>${movie.title}</h3>
                <p>${movie.rating}</p>
                <p>${movie.duration}</p>
                <button class="btn btn-secondary" style="margin-top:10px; color:white; border-color:white;">View Details</button>
            </div>
            <div class="movie-info">
                <h4>${movie.title}</h4>
            </div>
        `;
        grid.appendChild(card);
    }
}

// --- MOVIE PAGE ---

function renderMoviePage() {
    const movieId = getQueryParam('id');
    const movie = movies.find(m => m.id == movieId);

    if (!movie) {
        document.querySelector('main').innerHTML = '<p>Movie not found.</p>';
        return;
    }

    // Populate Details
    document.getElementById('movie-poster').src = movie.poster;
    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-desc').textContent = movie.description;
    document.getElementById('movie-duration').textContent = `Duration: ${movie.duration}`;
    document.getElementById('movie-rating').textContent = `Rating: ${movie.rating}`;
    document.getElementById('base-price').textContent = `Base Price: ${formatCurrency(movie.base_price)}`;

    // Populate Showtimes
    const showtimeContainer = document.getElementById('showtime-container');
    let selectedDate = null;
    let selectedTime = null;

    // Create Date Selectors
    // i: index for shows
    const dateDiv = document.createElement('div');
    dateDiv.className = 'date-selector';

    // Time container
    const timeDiv = document.createElement('div');
    timeDiv.className = 'time-selector';

    // We only show times when date is picked

    for (let i = 0; i < movie.shows.length; i++) {
        const show = movie.shows[i];
        const dateChip = document.createElement('div');
        dateChip.className = 'chip';
        // Date formatting could be better but keeping simple
        dateChip.textContent = new Date(show.date).toDateString();

        dateChip.onclick = () => {
            // Deselect others
            document.querySelectorAll('.date-selector .chip').forEach(c => c.classList.remove('selected'));
            dateChip.classList.add('selected');
            selectedDate = show.date;

            // Render Times
            timeDiv.innerHTML = ''; // clear prev times
            selectedTime = null;
            updateBookBtn();

            // j: index for times
            for (let j = 0; j < show.times.length; j++) {
                const timeStr = show.times[j];
                const timeChip = document.createElement('div');
                timeChip.className = 'chip';
                timeChip.textContent = timeStr;
                timeChip.onclick = () => {
                    document.querySelectorAll('.time-selector .chip').forEach(c => c.classList.remove('selected'));
                    timeChip.classList.add('selected');
                    selectedTime = timeStr;
                    updateBookBtn();
                };
                timeDiv.appendChild(timeChip);
            }
        };
        dateDiv.appendChild(dateChip);
    }

    showtimeContainer.appendChild(document.createTextNode('Select Date:'));
    showtimeContainer.appendChild(dateDiv);
    showtimeContainer.appendChild(document.createTextNode('Select Time:'));
    showtimeContainer.appendChild(timeDiv);

    const bookBtn = document.getElementById('select-seats-btn');

    // Ensure button is enabled so user can click and get feedback
    bookBtn.disabled = false;

    // Remove the old updateBookBtn logic that disabled it
    function updateBookBtn() {
        // Optional: Visual feedback like changing opacity could go here, 
        // but for now we just keep it enabled.
        if (selectedDate && selectedTime) {
            bookBtn.style.opacity = '1';
        }
    }

    bookBtn.onclick = () => {
        if (!selectedDate || !selectedTime) {
            alert('Please select a Date and Time first!');
            return;
        }

        if (selectedDate && selectedTime) {
            // ShowId format: MovieID_Date_Time
            const showId = `${movieId}_${selectedDate}_${selectedTime}`;
            // Encode properly
            window.location.href = `seats.html?showId=${encodeURIComponent(showId)}&movieId=${movieId}`;
        }
    };
}

// --- SEATS PAGE ---

function renderSeatsPage() {
    const showId = getQueryParam('showId'); // Decoded automatically by browser or URLSearchParams? Actually searchParams decodes.
    const movieId = getQueryParam('movieId');
    const movie = movies.find(m => m.id == movieId);

    if (!movie || !showId) {
        alert('Invalid selection');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('movie-title').textContent = movie.title;

    // Parse showId to display legible info
    const [_, date, time] = decodeURIComponent(showId).split('_'); // ignore first part (movieId) logic redone
    // Correct split: showId is "1_2025-06-12_10:00 AM". Split by first underscore?
    // Actually I constructed it as `${movieId}_${selectedDate}_${selectedTime}`
    // But data can contain underscores? Date checks out. Time usually OK.

    document.getElementById('show-info').textContent = `${date} at ${time}`;

    const seatMap = document.getElementById('seat-map');
    const bookedSeats = JSON.parse(localStorage.getItem(STRIP_KEY_SEATS) || '{}');
    let selectedSeats = [];

    // Render Seat Map
    // i: row index
    for (let i = 0; i < seatLayout.length; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';

        // j: col index
        for (let j = 0; j < seatLayout[i].length; j++) {
            const seatType = seatLayout[i][j];

            if (seatType === '_') {
                // Spacer
                const spacer = document.createElement('div');
                spacer.style.width = '30px'; // same as seat
                rowDiv.appendChild(spacer);
                continue;
            }

            const seat = document.createElement('div');
            // Key to check if booked: showId_row_col
            const uniqueSeatId = `${showId}_${i}_${j}`;
            const isBooked = bookedSeats[uniqueSeatId];

            seat.className = `seat ${isBooked ? 'booked' : ''}`;

            // Add specific classes for coloring
            if (seatType === 'P') seat.classList.add('premium');
            if (seatType === 'F') seat.classList.add('front');

            seat.dataset.row = i;
            seat.dataset.col = j;
            seat.dataset.type = seatType;
            seat.dataset.price = (movie.base_price * priceMultipliers[seatType]).toFixed(2);
            seat.dataset.id = uniqueSeatId;

            if (!isBooked) {
                seat.onclick = () => {
                    // Toggle selection
                    if (seat.classList.contains('selected')) {
                        seat.classList.remove('selected');
                        // Remove from array
                        selectedSeats = selectedSeats.filter(s => s.id !== uniqueSeatId);
                    } else {
                        seat.classList.add('selected');
                        selectedSeats.push({
                            id: uniqueSeatId,
                            row: i,
                            col: j,
                            type: seatType,
                            price: parseFloat(seat.dataset.price)
                        });
                    }
                    updatePriceSummary();
                };
            } else {
                seat.onclick = () => {
                    showToast("This seat is already booked!");
                };
            }

            rowDiv.appendChild(seat);
        }
        seatMap.appendChild(rowDiv);
    }

    function updatePriceSummary() {
        const qty = selectedSeats.length;
        document.getElementById('count').textContent = qty;

        let subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
        let discount = 0;

        // Discount Rule: > 2 seats -> 10% off
        const discountMsg = document.getElementById('discount-msg');
        const totalPriceEl = document.getElementById('total-price');

        if (qty > 2) {
            discount = subtotal * 0.10;
            discountMsg.classList.remove('hidden');
            totalPriceEl.classList.add('final-price'); // Animation style
        } else {
            discountMsg.classList.add('hidden');
            totalPriceEl.classList.remove('final-price');
        }

        const total = subtotal - discount;

        document.getElementById('subtotal').textContent = formatCurrency(subtotal);
        document.getElementById('discount').textContent = `-${formatCurrency(discount)}`;
        totalPriceEl.textContent = formatCurrency(total);

        document.getElementById('proceed-btn').disabled = qty === 0;
    }

    // Proceed to Checkout
    document.getElementById('proceed-btn').onclick = () => {
        // Save temp selection to localStorage to pass to checkout
        const bookingDraft = {
            movieId: movie.id,
            showId: showId,
            seats: selectedSeats,
            total: document.getElementById('total-price').textContent
        };
        localStorage.setItem('mtba_temp_booking', JSON.stringify(bookingDraft));
        window.location.href = 'checkout.html';
    };
}

function showToast(msg) {
    // Simple alert replacement or create a dynamic element
    // Using alert for simplicity as per beginner requirement, OR simple div overlay
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.position = 'fixed';
    t.style.bottom = '20px';
    t.style.left = '50%';
    t.style.transform = 'translateX(-50%)';
    t.style.background = '#d63031';
    t.style.color = 'white';
    t.style.padding = '10px 20px';
    t.style.borderRadius = '5px';
    t.style.zIndex = '1000';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
}

// --- CHECKOUT PAGE ---

function initCheckoutPage() {
    const draft = JSON.parse(localStorage.getItem('mtba_temp_booking'));
    if (!draft) {
        window.location.href = 'index.html';
        return;
    }

    const movie = movies.find(m => m.id == draft.movieId);
    document.getElementById('summary-movie').textContent = movie.title;
    document.getElementById('summary-seats').textContent = draft.seats.map(s => `R${s.row + 1}:C${s.col + 1}`).join(', ');
    document.getElementById('summary-total').textContent = draft.total;

    const form = document.getElementById('checkout-form');
    const paymentModal = document.getElementById('payment-modal');

    form.onsubmit = (e) => {
        e.preventDefault();

        // Client-side validation
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;

        // Basic Regex checks
        if (!/^\d{9,15}$/.test(phone)) {
            alert('Please enter a valid phone number (9-15 digits).');
            return;
        }

        // Open Payment Modal
        paymentModal.style.display = 'flex';
    };

    // Close modal if clicked outside
    window.onclick = (e) => {
        if (e.target == paymentModal) {
            paymentModal.style.display = 'none';
        }
    };

    // Simulate Payment
    document.getElementById('sim-success-btn').onclick = () => {
        // 1. Process Booking
        const bookingId = 'BK' + Date.now() + Math.floor(Math.random() * 1000);

        // 2. Mark Seats as Booked
        const allBookedFn = JSON.parse(localStorage.getItem(STRIP_KEY_SEATS) || '{}');
        draft.seats.forEach(s => {
            allBookedFn[s.id] = true; // Mark as booked
        });
        localStorage.setItem(STRIP_KEY_SEATS, JSON.stringify(allBookedFn));

        // 3. Save Booking Record
        const newBooking = {
            id: bookingId,
            ...draft,
            user: {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value
            },
            date: new Date().toISOString()
        };

        const myBookings = JSON.parse(localStorage.getItem(STRIP_KEY_BOOKINGS) || '[]');
        myBookings.push(newBooking);
        localStorage.setItem(STRIP_KEY_BOOKINGS, JSON.stringify(myBookings));

        // 4. Redirect to Ticket
        // Pass booking ID to ticket page
        window.location.href = `ticket.html?bookingId=${bookingId}`;
    };

    document.getElementById('sim-fail-btn').onclick = () => {
        alert('Payment Failed! Please try again.');
        paymentModal.style.display = 'none';
    };
}

// --- TICKET PAGE ---

function renderTicketPage() {
    const bId = getQueryParam('bookingId');
    const myBookings = JSON.parse(localStorage.getItem(STRIP_KEY_BOOKINGS) || '[]');
    const booking = myBookings.find(b => b.id === bId);

    if (!booking) {
        document.body.innerHTML = '<h1>Booking Not Found</h1><a href="index.html">Home</a>';
        return;
    }

    // Recover movie details again or store them in booking? We stored movieId.
    const movie = movies.find(m => m.id == booking.movieId);

    document.getElementById('t-id').textContent = booking.id;
    document.getElementById('t-movie').textContent = movie ? movie.title : 'Unknown Movie';
    document.getElementById('t-name').textContent = booking.user.name;
    document.getElementById('t-seat-count').textContent = booking.seats.length;
    document.getElementById('t-seats').textContent = booking.seats.map(s => `R${s.row + 1}:C${s.col + 1}`).join(', '); // 1-based index for logic display
    document.getElementById('t-total').textContent = booking.total;

    // Decoding show time again
    const parts = decodeURIComponent(booking.showId).split('_');
    document.getElementById('t-date').textContent = `${parts[1]} ${parts[2]}`;
}
