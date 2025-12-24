/**
 * Movie Ticket Booking App - Data (Updated)
 * 6 Premium Movies with Placeholders
 */

const movies = [
    {
        id: 1,
        title: "Avatar: The Way of Water",
        poster: "https://placehold.co/300x450/003366/FFF?text=Avatar+2",
        description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
        duration: "3h 12m",
        rating: "★★★★★",
        base_price: 15.00,
        shows: [
            { date: "2025-06-12", times: ["10:00 AM", "06:00 PM"] },
            { date: "2025-06-13", times: ["02:00 PM", "08:00 PM"] }
        ]
    },
    {
        id: 2,
        title: "Oppenheimer",
        poster: "https://placehold.co/300x450/222/ffa500?text=Oppenheimer",
        description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        duration: "3h 00m",
        rating: "★★★★★",
        base_price: 14.00,
        shows: [
            { date: "2025-06-12", times: ["01:00 PM", "07:00 PM"] },
            { date: "2025-06-14", times: ["11:00 AM", "05:00 PM"] }
        ]
    },
    {
        id: 3,
        title: "Spider-Man: Across the Spider-Verse",
        poster: "https://placehold.co/300x450/cc0000/FFF?text=Spider-Verse",
        description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
        duration: "2h 20m",
        rating: "★★★★☆",
        base_price: 12.50,
        shows: [
            { date: "2025-06-12", times: ["03:30 PM", "09:00 PM"] },
            { date: "2025-06-15", times: ["12:00 PM"] }
        ]
    },
    {
        id: 4,
        title: "The Batman",
        poster: "https://placehold.co/300x450/111/aa0000?text=The+Batman",
        description: "When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
        duration: "2h 56m",
        rating: "★★★★☆",
        base_price: 13.50,
        shows: [
            { date: "2025-06-12", times: ["08:00 PM"] },
            { date: "2025-06-13", times: ["04:00 PM", "08:30 PM"] }
        ]
    },
    {
        id: 5,
        title: "Dune: Part Two",
        poster: "https://placehold.co/300x450/c27c2e/FFF?text=Dune+Part+Two",
        description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
        duration: "2h 46m",
        rating: "★★★★★",
        base_price: 16.00,
        shows: [
            { date: "2025-06-12", times: ["05:00 PM", "09:30 PM"] },
            { date: "2025-06-14", times: ["02:00 PM", "07:30 PM"] }
        ]
    },
    {
        id: 6,
        title: "Barbie",
        poster: "https://placehold.co/300x450/ff69b4/fff?text=Barbie",
        description: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",
        duration: "1h 54m",
        rating: "★★★★☆",
        base_price: 12.00,
        shows: [
            { date: "2025-06-12", times: ["12:00 PM", "04:00 PM"] },
            { date: "2025-06-15", times: ["01:30 PM", "06:30 PM"] }
        ]
    }
];

// Seat Layout
// F=Front, R=Regular, P=Premium, _=Aisle
const seatLayout = [
    ['F', 'F', 'F', 'F', '_', '_', 'F', 'F', 'F', 'F'],
    ['R', 'R', 'R', 'R', '_', '_', 'R', 'R', 'R', 'R'],
    ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
    ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
];

const priceMultipliers = {
    'R': 1.0,
    'P': 1.5,
    'F': 1.08
};
