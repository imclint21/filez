using Initium.Extensions;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddHealthChecks();
builder.Services.AddMemoryCache();
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy
	.WithOrigins("http://localhost:5173", "https://fil.ez")
	.AllowAnyHeader()
	.AllowAnyMethod()));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseDefaultFiles(new DefaultFilesOptions
{
	FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.WebRootPath)),
	RequestPath = "",
	DefaultFileNames = new List<string> { "index.html" }
});

app.MapControllers();
app.UseStaticFiles();

app.UseStaticFiles(new StaticFileOptions
{
	FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.WebRootPath)),
	RequestPath = ""
});

app.MapFallbackToFile("index.html", Path.Combine(app.Environment.WebRootPath));

app.UseRouting();
app.UseCors();
app.MapHealthChecks("/health");

app.Run();