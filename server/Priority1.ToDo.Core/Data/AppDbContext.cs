using Microsoft.EntityFrameworkCore;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Core.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Todo> Todos => Set<Todo>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        BeforeSaveChanges();
        return await base.SaveChangesAsync(ct);
    }

    public override int SaveChanges()
    {
        BeforeSaveChanges();
        return base.SaveChanges();
    }

    public void BeforeSaveChanges()
    {
        var entries = ChangeTracker.Entries().ToList();

        foreach(var entry in entries)
        {
            if (entry.Entity is EntityBase entity)
            {
                var now = DateTime.UtcNow;

                entity.UpdateDate = now;

                if (entry.State == EntityState.Added)
                {
                    entity.CreateDate = now;
                }
            }
        }
    }
}
