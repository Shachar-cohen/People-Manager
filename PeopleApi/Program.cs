// Sets up the web application,Entry point for the People API application

using Microsoft.EntityFrameworkCore;
using PeopleApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// SQLite (create in people.db file)
builder.Services.AddDbContext<PeopleDbContext>(opt =>
    opt.UseSqlite("Data Source=people.db"));

var app = builder.Build();

app.UseCors("AllowAll");

app.MapControllers();


app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

// create/update database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PeopleDbContext>();
    db.Database.Migrate();
}

app.Run();
