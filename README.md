# Javascript-Library
The library simulation only with pure  javascript


This is Online library with Mocking books and users. Just pure javascript logic ;

List of The Functions:


//Book Management
addBook({ title, author, genre, year, rating })
Adds a new book to the library collection.
Returns the newly added book object or an error message if invalid.

removeBook(bookId)
Removes a book by its ID, only if it is not currently borrowed.
Returns a confirmation message or an error.

// User & Borrowing System
borrowBook(userName, bookId)
Allows a user to borrow a book if it is available.
Automatically creates a new user record if the user doesn’t exist.
Returns a message with the due date or an error.

returnBook(userName, bookId)
Handles the return of a borrowed book.
Adds penalty points if returned after the due date.
Returns a thank-you message or an overdue warning.

printUserSummary(userName)
Generates a summary of the user's current borrowings, overdue status, and penalty points.
Returns an object with detailed information.

// Search & Analytics
searchBooksBy(param, value)
Searches the book collection by one of the following parameters:

author

genre

rating (minimum)

year-before

year-after
Returns a list of matching books or an error message if the parameter is invalid.

getTopRatedBooks(limit)
Returns the top-rated books sorted by rating (and title as a tiebreaker).
limit determines how many results to return.

getMostPopularBooks(limit)
Returns the most borrowed books sorted by borrow count (and title as a tiebreaker).
limit determines how many results to return.

checkOverdueUsers()
Checks all users for overdue books.
Returns a list of users and details about the overdue books, including how many days they are overdue.

recommendBooks(userName)
Generates up to 5 book recommendations for a given user based on their borrowing history and favorite genres.
Returns an array of book objects or an error if the user doesn’t exist or has no history.


Testing:
// Borrow and return
console.log(library.borrowBook("Julie", 6));       // Dune
console.log(library.returnBook("Julie", 5));       // Harry Potter

// Search
console.log(library.searchBooksBy('author', 'orwell'));
console.log(library.searchBooksBy('genre', 'sci-fi'));
console.log(library.searchBooksBy('rating', 4.5));
console.log(library.searchBooksBy('year-before', 1950));
console.log(library.searchBooksBy('year-after', 2000));

// Top/popular
console.log(library.getTopRatedBooks(3));
console.log(library.getMostPopularBooks(3));

// Overdue & recommendations
console.log(library.checkOverdueUsers());
console.log(library.recommendBooks("Julie"));
console.log(library.recommendBooks("Sandro"));

// Remove book
console.log(library.removeBook(11));  // Available book
console.log(library.removeBook(1));   // Borrowed book (should fail)

// User summary
console.log(library.printUserSummary("Julie"));
console.log(library.printUserSummary("Sandro"));

Edge Cases Testing:

// Simulate overdue return
console.log(library.borrowBook("Nina", 9));
const nina = library.users.find(u => u.name === "Nina");
const ninaBorrow = nina.currentBorrowed.find(b => b.bookId === 9);
const book = library.books.find(b => b.id === 9);
const pastDueDate = new Date();
pastDueDate.setDate(pastDueDate.getDate() - 5);
ninaBorrow.dueDate = pastDueDate;
book.dueDate = pastDueDate;
console.log(library.returnBook("Nina", 9));
console.log(library.printUserSummary("Nina"));

// Invalid book data
console.log(library.addBook({ title: "Title Only" }));
console.log(library.addBook({ title: "Fake", author: "X", genre: "Y", year: "year", rating: "high" }));
console.log(library.removeBook(13));
console.log(library.removeBook(14));

// Invalid borrow/return
console.log(library.borrowBook("Julie", 999));     // Non-existent book
console.log(library.returnBook("Julie", 999));     // Non-existent book
console.log(library.returnBook("Sandro", 5));      // Wrong user
console.log(library.borrowBook("Mathilda", 5));    // Book not available

// Invalid search and recommendations
console.log(library.searchBooksBy("publisher", "Penguin"));     // Invalid param
console.log(library.searchBooksBy("author", ""));               // Empty value
console.log(library.recommendBooks("NonExistentUser"));         // Invalid user
console.log(library.removeBook(999));                           // Non-existent book
console.log(library.printUserSummary("NonExistentUser"));       // Invalid user


Have Fun ! 