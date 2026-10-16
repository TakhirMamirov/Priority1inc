using Microsoft.AspNetCore.Mvc;
using Priority1.ToDo.Api.Models;
using Priority1.ToDo.Api.Models.Requests;
using Priority1.ToDo.Core.Services.Interfaces;

namespace Priority1.ToDo.Api.Controllers;

/// <summary>
/// Create, rename, delete and browse todo lists.
/// </summary>
[ApiController]
[Route("lists")]
[Produces("application/json")]
public class TodoListsController : ControllerBase
{
    private readonly ITodoListService _todoListService;

    public TodoListsController(ITodoListService todoListService)
    {
        _todoListService = todoListService;
    }

    /// <summary>
    /// Lists all todo lists.
    /// </summary>
    /// <remarks>Lists are returned oldest first.</remarks>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">All todo lists; an empty array if there are none.</response>
    [HttpGet]
    [ProducesResponseType(typeof(List<TodoListItem>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<TodoListItem>>> GetAll(CancellationToken ct)
    {
        var lists = await _todoListService.GetAllAsync(ct);
        return Ok(lists.Select(TodoListItem.From));
    }

    /// <summary>
    /// Gets a single todo list.
    /// </summary>
    /// <param name="id">The list id.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">The requested list.</response>
    /// <response code="404">No list exists with this id.</response>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(TodoListItem), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TodoListItem>> GetById(int id, CancellationToken ct)
    {
        var list = await _todoListService.GetByIdAsync(id, ct);
        return list is null ? NotFound() : Ok(TodoListItem.From(list));
    }

    /// <summary>
    /// Creates a new todo list.
    /// </summary>
    /// <param name="request">The list to create.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="201">The list was created; its URL is in the <c>Location</c> header.</response>
    /// <response code="400">The name is missing, blank or longer than 100 characters.</response>
    [HttpPost]
    [Consumes("application/json")]
    [ProducesResponseType(typeof(TodoListItem), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TodoListItem>> Create([FromBody] CreateTodoListRequest request, CancellationToken ct)
    {
        var created = await _todoListService.CreateAsync(request.ToModel(), ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, TodoListItem.From(created));
    }

    /// <summary>
    /// Renames a todo list.
    /// </summary>
    /// <param name="id">The list id.</param>
    /// <param name="request">The new name.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">The list was renamed.</response>
    /// <response code="400">The name is missing, blank or longer than 100 characters.</response>
    /// <response code="404">No list exists with this id.</response>
    [HttpPut("{id:int}")]
    [Consumes("application/json")]
    [ProducesResponseType(typeof(TodoListItem), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TodoListItem>> Update(int id, [FromBody] UpdateTodoListRequest request, CancellationToken ct)
    {
        var updated = await _todoListService.UpdateAsync(request.ToModel(id), ct);
        return updated is null ? NotFound() : Ok(TodoListItem.From(updated));
    }

    /// <summary>
    /// Deletes a todo list and all of its todo items.
    /// </summary>
    /// <remarks>This cannot be undone: every todo item in the list is deleted too.</remarks>
    /// <param name="id">The list id.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="204">The list and its todo items were deleted.</response>
    /// <response code="404">No list exists with this id.</response>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var deleted = await _todoListService.DeleteAsync(id, ct);
        return deleted ? NoContent() : NotFound();
    }
}
