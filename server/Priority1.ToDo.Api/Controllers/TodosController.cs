using Microsoft.AspNetCore.Mvc;
using Priority1.ToDo.Api.Models;
using Priority1.ToDo.Api.Models.Requests;
using Priority1.ToDo.Core.Services.Interfaces;

namespace Priority1.ToDo.Api.Controllers;

[ApiController]
[Route("todos")]
public class TodosController : ControllerBase
{
    private readonly ITodoService _todoService;

    public TodosController(ITodoService todoService)
    {
        _todoService = todoService;
    }

    [HttpGet]
    public async Task<ActionResult<List<TodoItem>>> GetAll(CancellationToken ct)
    {
        var todos = await _todoService.GetAllAsync(ct);
        return Ok(todos.Select(TodoItem.From));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TodoItem>> GetById(int id, CancellationToken ct)
    {
        var todo = await _todoService.GetByIdAsync(id, ct);
        return todo is null ? NotFound() : Ok(TodoItem.From(todo));
    }

    [HttpPost]
    public async Task<ActionResult<TodoItem>> Create([FromBody] CreateTodoRequest request, CancellationToken ct)
    {
        var created = await _todoService.CreateAsync(request.ToModel(), ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, TodoItem.From(created));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TodoItem>> Update(int id, [FromBody] UpdateTodoRequest request, CancellationToken ct)
    {
        var updated = await _todoService.UpdateAsync(request.ToModel(id), ct);
        return updated is null ? NotFound() : Ok(TodoItem.From(updated));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var deleted = await _todoService.DeleteAsync(id, ct);
        return deleted ? NoContent() : NotFound();
    }
}
