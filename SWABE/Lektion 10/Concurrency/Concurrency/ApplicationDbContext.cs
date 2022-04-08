using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Concurrency
{
    public class ApplicationDbContext : DbContext
    {

      
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Server=(localdb)\MSSQLLocalDB;Database=testDB");
        }
        public DbSet<Book> books { get; set; }
        public DbSet<Author> authors { get; set; } 

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Book>()
                .Property(p => p.PublishedOn)
                .IsConcurrencyToken();
            builder.Entity<Book>().HasData(
                new Book { PublishedOn = DateTime.UtcNow, BookId = 1, Description = "Test", Theme="TestTheme",Title="TestTitle" });

            builder.Entity<Author>()
                .Property(p => p.ChangeCheck)
                .IsRowVersion();

            builder.Entity<Author>().HasData( new Author { AuthorId = 1, Name = "TestAuthor" });
          
        }
    }
}
