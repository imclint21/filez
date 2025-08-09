namespace FileZ.Models;

public class FileRecord
{
    public required string Id { get; init; }
    public required byte[] Data { get; init; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now;
    public string? Extension { get; init; }
    public string ContentType { get; init; } = "application/octet-stream";
}