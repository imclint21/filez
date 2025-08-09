using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using FileZ.Extensions;
using FileZ.Models;

namespace FileZ.Controllers;

[ApiController]
[Route("/")]
public class FilesController(IMemoryCache cache) : ControllerBase
{
	[HttpPost]
	public IActionResult Upload([Required][FromForm] IFormFile file)
	{
		var fileRecord = file.Create();
		cache.Set(fileRecord.Id, fileRecord, TimeSpan.FromMinutes(120));
		return Ok($"{Request.Scheme}://{Request.Host}/{fileRecord.Id}\n");
	}

	[HttpGet("{fileId}")]
	public IActionResult Download([FromRoute] string fileId)
	{
		if (!cache.TryGetValue(fileId, out FileRecord? fileRecord) || fileRecord == null)
			return NotFound("File not found");

		var filename = fileId;
		if (!string.IsNullOrEmpty(fileRecord.Extension)) 
			filename = $"{filename}.{fileRecord.Extension}";
		
		Response.Headers.ContentDisposition = $"inline; filename=\"{filename}\"";
		return File(fileRecord.Data, fileRecord.ContentType);
	}
}