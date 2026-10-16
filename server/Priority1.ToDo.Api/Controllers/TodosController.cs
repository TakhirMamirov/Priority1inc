using Microsoft.AspNetCore.Mvc;
using Priority1.ToDo.Api.Models;
using Priority1.ToDo.Api.Models.Requests;
using Priority1.ToDo.Core.Services.Interfaces;

namespace Priority1.ToDo.Api.Controllers;

/// <summary>
/// Create, update, delete and browse todo items. Items are listed and created
/// within a todo list; once created, an item is addressed by its own id.
/// </summary>
[ApiController]
[Route("todos")]
[Produces("application/json")]
public class TodosController : ControllerBase
{
    private readonly ITodoService _todoService;

    public TodosController(ITodoService todoService)
    {
        _todoService = todoService;
    }

    /// <summary>
    /// Lists the todo items in a todo list.
    /// </summary>
    /// <remarks>Items are returned oldest first.</remarks>
    /// <param name="listId">The id of the todo list.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">The list's todo items; an empty array if it has none.</response>
    /// <response code="404">No todo list exists with this id.</response>
    [HttpGet("~/lists/{listId:int}/todos")]
    [ProducesResponseType(typeof(List<TodoItem>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<List<TodoItem>>> GetByList(int listId, CancellationToken ct)
    {
        var todos = await _todoService.GetByListIdAsync(listId, ct);
        return todos is null ? NotFound() : Ok(todos.Select(TodoItem.From));
    }

    /// <summary>
    /// Gets a single todo item.
    /// </summary>
    /// <param name="id">The todo item id.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">The requested todo item.</response>
    /// <response code="404">No todo item exists with this id.</response>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(TodoItem), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TodoItem>> GetById(int id, CancellationToken ct)
    {
        var todo = await _todoService.GetByIdAsync(id, ct);
        return todo is null ? NotFound() : Ok(TodoItem.From(todo));
    }

    /// <summary>
    /// Creates a todo item in a todo list.
    /// </summary>
    /// <param name="listId">The id of the todo list to add the item to.</param>
    /// <param name="request">The todo item to create.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="201">The todo item was created; its URL is in the <c>Location</c> header.</response>
    /// <response code="400">The title is missing, blank or longer than 200 characters.</response>
    /// <response code="404">No todo list exists with this id.</response>
    [HttpPost("~/lists/{listId:int}/todos")]
    [Consumes("application/json")]
    [ProducesResponseType(typeof(TodoItem), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TodoItem>> Create(int listId, [FromBody] CreateTodoRequest request, CancellationToken ct)
    {
        var created = await _todoService.CreateAsync(request.ToModel(listId), ct);
        if (created is null)
        {
            return NotFound();
        }

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, TodoItem.From(created));
    }

    /// <summary>
    /// Updates a todo item's title and completion state.
    /// </summary>
    /// <param name="id">The todo item id.</param>
    /// <param name="request">The new values.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">The todo item was updated.</response>
    /// <response code="400">The title is missing, blank or longer than 200 characters.</response>
    /// <response code="404">No todo item exists with this id.</response>
    [HttpPut("{id:int}")]
    [Consumes("application/json")]
    [ProducesResponseType(typeof(TodoItem), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TodoItem>> Update(int id, [FromBody] UpdateTodoRequest request, CancellationToken ct)
    {
        var updated = await _todoService.UpdateAsync(request.ToModel(id), ct);
        return updated is null ? NotFound() : Ok(TodoItem.From(updated));
    }

    /// <summary>
    /// Deletes a todo item.
    /// </summary>
    /// <param name="id">The todo item id.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="204">The todo item was deleted.</response>
    /// <response code="404">No todo item exists with this id.</response>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var deleted = await _todoService.DeleteAsync(id, ct);
        return deleted ? NoContent() : NotFound();
    }
}
