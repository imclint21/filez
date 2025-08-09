using Initium.Extensions;

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

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors();
app.UseStaticFiles();
app.MapStaticAssets();
app.MapHealthChecks("/health");
app.MapControllers();
app.MapStaticFrontend(Path.Combine(app.Environment.WebRootPath));

app.Run();