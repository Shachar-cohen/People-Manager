using Microsoft.EntityFrameworkCore;
using PeopleApi.Models;

namespace PeopleApi.Data
{
    // represents the database tables
    public class PeopleDbContext : DbContext
    {
        public PeopleDbContext(DbContextOptions<PeopleDbContext> options) : base(options) { }

        // People table mapping
        public DbSet<Person> People => Set<Person>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Primary key (Id is string of 9 digits)
            modelBuilder.Entity<Person>()
                .HasKey(p => p.Id);

            // Unique indexes for Email and Phone
            modelBuilder.Entity<Person>()
                .HasIndex(p => p.Email)
                .IsUnique();

            modelBuilder.Entity<Person>()
                .HasIndex(p => p.Phone)
                .IsUnique();
        }
    }
}
