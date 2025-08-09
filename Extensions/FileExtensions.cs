using FileZ.Models;
using NanoidDotNet;

namespace FileZ.Extensions;

public static class FileExtensions
{
    /// <summary>
    /// Create a FileZ.Models.File from an uploaded IFormFile.
    /// </summary>
    /// <param name="formFile">The uploaded file.</param>
    /// <returns>A populated File model.</returns>
    public static FileRecord Create(this IFormFile formFile)
    {
        ArgumentNullException.ThrowIfNull(formFile);

        using var ms = new MemoryStream();
        formFile.CopyTo(ms);
        var data = ms.ToArray();

        var contentType = string.IsNullOrWhiteSpace(formFile.ContentType)
            ? "application/octet-stream"
            : formFile.ContentType;

        return new FileRecord
        {
            Id = Nanoid.Generate(size : 8),
            Data = data,
            Extension = Path.GetExtension(formFile.FileName).TrimStart('.'),
            ContentType = contentType
        };
    }
}