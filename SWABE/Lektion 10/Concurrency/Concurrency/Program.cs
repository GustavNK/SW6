// See https://aka.ms/new-console-template for more information
using Concurrency;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

string HandleBookConcurrency( ApplicationDbContext context, EntityEntry entry)
{
    var book = entry.Entity as Book;
    if (book == null)
        throw new NotSupportedException("Don't know how to handle concurrency conflicts for " + entry.Metadata.Name);
    var whatTheDatabaseHasNow = context.Set<Book>().AsNoTracking()
        .SingleOrDefault(p => p.BookId == book.BookId); 
    if (whatTheDatabaseHasNow == null) return "Unable to save changes.The book was deleted by another user.";
    var otherUserData = context.Entry(whatTheDatabaseHasNow);
    foreach (var property in entry.Metadata.GetProperties())
    {
        var theOriginalValue = entry.Property(property.Name).OriginalValue;
        var otherUserValue = otherUserData.Property(property.Name).CurrentValue;
        var whatIWantedItToBe = entry.Property(property.Name).CurrentValue;
        //TODO: Logic to decide which value should be written to database
        if(property.Name == nameof(Book.PublishedOn))
        {
            if(otherUserValue != null && whatIWantedItToBe != null)
            {
                DateTime before = (DateTime)otherUserValue;
                DateTime after = (DateTime)whatIWantedItToBe;
                entry.Property(property.Name).CurrentValue = DateTime.UtcNow.AddDays(-2200);
            }
        }
        entry.Property(property.Name).OriginalValue = otherUserData.Property(property.Name).CurrentValue;
    };
    return null;
}

string BookSaveChangesWithChecks(ApplicationDbContext context)
{
    string error = null;
    try
    {
        var firstBook = context.books.First();
        context.Database.ExecuteSqlRaw(@"UPDATE dbo.Books SET PublishedOn = GETDATE()
        WHERE BookId = @p0", firstBook.BookId);
        firstBook.PublishedOn = DateTime.UtcNow.AddDays(1);
        context.SaveChanges();
    }
    catch (DbUpdateConcurrencyException ex)
    {
        var entry = ex.Entries.Single();
        error = HandleBookConcurrency(context, entry);
        if (error == null)
            context.SaveChanges();
    }
    return error;
}

var dbContext = new ApplicationDbContext();

BookSaveChangesWithChecks(dbContext);

