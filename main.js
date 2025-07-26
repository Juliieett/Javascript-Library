class VirtualLibrary {
    constructor() {
        this.books = [];
        this.users = [];
        this.nextBookId = 1;
    }

    // Add a new book to the library
    addBook({ title, author, genre, year, rating }) {
        const book = {
            id: this.nextBookId++,
            title,
            author,
            genre,
            year,
            rating,
            borrowCount: 0,
            available: true,
            borrowedBy: null,
            dueDate: null
        };
        this.books.push(book);
        return book;
    }

    // Borrow a book for a user
    borrowBook(userName, bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) return `Book ${bookId} not found`;
        if (!book.available) return `Book "${book.title}" is not available`;

        let user = this.users.find(u => u.name === userName);
        if (!user) {
            user = {
                name: userName,
                currentBorrowed: [],
                borrowHistory: [],
                penaltyPoints: 0
            };
            this.users.push(user);
        }

        const borrowDate = new Date();
        const dueDate = new Date(borrowDate);
        dueDate.setDate(dueDate.getDate() + 14);

        book.available = false;
        book.borrowedBy = userName;
        book.dueDate = dueDate;
        book.borrowCount++;

        user.currentBorrowed.push({
            bookId,
            borrowDate,
            dueDate
        });

        return `"${book.title}" borrowed by ${userName}. Due: ${dueDate.toDateString()}`;
    }

    // Return a borrowed book
    returnBook(userName, bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) return `Book ${bookId} not found`;
        if (book.available) return `Book "${book.title}" is not borrowed`;
        if (book.borrowedBy !== userName) return `"${book.title}" not borrowed by ${userName}`;

        const user = this.users.find(u => u.name === userName);
        const borrowIndex = user.currentBorrowed.findIndex(b => b.bookId === bookId);
        if (borrowIndex === -1) return `Borrow record not found`;

        const borrowEntry = user.currentBorrowed[borrowIndex];
        const returnDate = new Date();
        const daysLate = Math.max(0, Math.ceil((returnDate - borrowEntry.dueDate) / (1000 * 60 * 60 * 24)));

        // Update book status
        book.available = true;
        book.borrowedBy = null;
        book.dueDate = null;

        // Update user records
        user.currentBorrowed.splice(borrowIndex, 1);
        user.borrowHistory.push({ ...borrowEntry, returnDate });

        // Apply penalties if late
        if (daysLate > 0) {
            user.penaltyPoints += daysLate;
            return `"${book.title}" returned ${daysLate} days late. ${daysLate} penalty points added. Total: ${user.penaltyPoints}`;
        }
        return `Thank you for returning "${book.title}" on time`;
    }

    // Search books by various criteria
    searchBooksBy(param, value) {
        switch(param) {
            case 'author':
                return this.books.filter(book => 
                    book.author.toLowerCase().includes(value.toLowerCase()));
            case 'genre':
                return this.books.filter(book => 
                    book.genre.toLowerCase().includes(value.toLowerCase()));
            case 'rating':
                return this.books.filter(book => book.rating >= Number(value));
            case 'year-before':
                return this.books.filter(book => book.year <= Number(value));
            case 'year-after':
                return this.books.filter(book => book.year >= Number(value));
            default:
                return 'Invalid search parameter';
        }
    }

    // Get top-rated books
    getTopRatedBooks(limit) {
        return [...this.books]
            .sort((a, b) => b.rating - a.rating || a.title.localeCompare(b.title))
            .slice(0, limit);
    }

    // Get most borrowed books
    getMostPopularBooks(limit) {
        return [...this.books]
            .sort((a, b) => b.borrowCount - a.borrowCount || a.title.localeCompare(b.title))
            .slice(0, limit);
    }

    // Check for overdue users
    checkOverdueUsers() {
        const now = new Date();
        return this.users.flatMap(user => 
            user.currentBorrowed
                .filter(book => now > book.dueDate)
                .map(book => {
                    const daysOverdue = Math.ceil((now - book.dueDate) / (1000 * 60 * 60 * 24));
                    return {
                        userName: user.name,
                        bookId: book.bookId,
                        daysOverdue,
                        bookTitle: this.books.find(b => b.id === book.bookId)?.title
                    };
                })
        );
    }

    // Recommend books for a user
    recommendBooks(userName) {
        const user = this.users.find(u => u.name === userName);
        if (!user) return 'User not found';

        // Get all borrowed book IDs
        const borrowedIds = new Set([
            ...user.currentBorrowed.map(b => b.bookId),
            ...user.borrowHistory.map(b => b.bookId)
        ]);

        // Get favorite genres
        const genreCounts = {};
        [...user.currentBorrowed, ...user.borrowHistory].forEach(book => {
            const genre = this.books.find(b => b.id === book.bookId)?.genre;
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });

        const favoriteGenres = Object.entries(genreCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([genre]) => genre);

        // Generate recommendations
        return this.books
            .filter(book => 
                !borrowedIds.has(book.id) && 
                favoriteGenres.includes(book.genre))
            .sort((a, b) => 
                b.rating - a.rating || 
                favoriteGenres.indexOf(a.genre) - favoriteGenres.indexOf(b.genre))
            .slice(0, 5);
    }

    // Remove a book from the system
    removeBook(bookId) {
        const index = this.books.findIndex(b => b.id === bookId);
        if (index === -1) return 'Book not found';
        if (!this.books[index].available) return 'Cannot remove borrowed book';
        
        const [removed] = this.books.splice(index, 1);
        return `Removed: "${removed.title}" by ${removed.author}`;
    }

    // Print user summary
    printUserSummary(userName) {
        const user = this.users.find(u => u.name === userName);
        if (!user) return 'User not found';

        const now = new Date();
        const summary = {
            user: userName,
            currentlyBorrowed: user.currentBorrowed.map(book => {
                const libraryBook = this.books.find(b => b.id === book.bookId);
                const overdue = now > book.dueDate;
                return {
                    title: libraryBook?.title,
                    dueDate: book.dueDate.toDateString(),
                    overdue,
                    daysOverdue: overdue ? 
                        Math.ceil((now - book.dueDate) / (1000 * 60 * 60 * 24)) : 0
                };
            }),
            penaltyPoints: user.penaltyPoints
        };

        return summary;
    }
}

// Initialize library with sample data
function initializeLibrary() {
    const library = new VirtualLibrary();
    
    // sample books
    library.addBook({ title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", year: 1937, rating: 4.8 });
    library.addBook({ title: "1984", author: "George Orwell", genre: "Dystopian", year: 1949, rating: 4.7 });
    library.addBook({ title: "Pride and Prejudice", author: "Jane Austen", genre: "Classic", year: 1813, rating: 4.5 });
    library.addBook({ title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", year: 1925, rating: 4.3 });
    library.addBook({ title: "Harry Potter", author: "J.K. Rowling", genre: "Fantasy", year: 1997, rating: 4.9 });
    library.addBook({ title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", year: 1965, rating: 4.6 });
    library.addBook({ title: "The Catcher in the Rye", author: "J.D. Salinger", genre: "Classic", year: 1951, rating: 4.0 });
    library.addBook({ title: "The Martian", author: "Andy Weir", genre: "Sci-Fi", year: 2011, rating: 4.8 });
    library.addBook({ title: "The Alchemist", author: "Paulo Coelho", genre: "Adventure", year: 1988, rating: 4.4 });
    library.addBook({ title: "The Da Vinci Code", author: "Dan Brown", genre: "Mystery", year: 2003, rating: 4.2 });
    library.addBook({ title: "The Silent Patient", author: "Alex Michaelides", genre: "Thriller", year: 2019, rating: 4.1 });
    
    // Simulate borrowing activity
    library.borrowBook("Julie", 5);
    library.borrowBook("Sandro", 3);
    library.borrowBook("Mathilda", 1);
    library.borrowBook("Tako", 2);
    
    // Simulate late return
    const lateReturn = new Date();
    lateReturn.setDate(lateReturn.getDate() - 15); // 15 days ago
    library.books[0].dueDate = lateReturn;
    
    return library;
}


const library = initializeLibrary();

console.log(library.addBook({
    title: "Brave New World",
    author: "Aldous Huxley",
    genre: "Dystopian",
    year: 1932,
    rating: 4.4
}));

