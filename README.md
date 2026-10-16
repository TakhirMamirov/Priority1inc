# Priority1.ToDo

A deliberately minimal full-stack TODO application. It is the starting point for a take-home skills exercise: the CRUD basics work end to end, leaving obvious room to add functionality.

- **Backend:** .NET 8 Web API, Entity Framework Core (Code First), SQL Server
- **Frontend:** React (Vite, plain JavaScript)
- **Database:** SQL Server 2022 running in Docker

---

## Prerequisites

| Tool | Notes |
| --- | --- |
| [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) | `dotnet --version` should report 8.x |
| [Node.js](https://nodejs.org/) (18+) | Ships with `npm` |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Runs the SQL Server container |
| `dotnet-ef` CLI tool | Install once: `dotnet tool install --global dotnet-ef` |

Only SQL Server runs in Docker. The API and the React app run **natively** on your machine (`dotnet run` / `npm run dev`).

---

## Getting started

### 1. Start SQL Server

From the repo root:

```bash
docker-compose up -d
```

This starts SQL Server 2022 on `localhost:1433` with the SA credentials that the API is already configured to use (see `server/Priority1.ToDo.Api/appsettings.Development.json`). Data is kept in a named Docker volume, so it survives container restarts.

### 2. Apply the database migration

The database schema is created by the checked-in EF migration. It is **not** applied automatically on startup — run it yourself:

```bash
cd server/Priority1.ToDo.Api
dotnet ef database update
```

**Note**: To add and apply new migrations to your local database during development run the below commands from `server/Priority1.ToDo.Api`:

```bash
dotnet ef migrations add < MigrationName > --project ../Priority1.ToDo.Core --startup-project .
dotnet ef database update
```

This creates the `Priority1ToDo` database and the `Todos` table.

### 3. Run the API

From `server/Priority1.ToDo.Api`:

```bash
dotnet run
```

The API listens on **http://localhost:5000**. In Development, **Swagger UI is served at the root**: open http://localhost:5000/ to explore and try the endpoints.

> **macOS note:** port 5000 is sometimes taken by the AirPlay Receiver. If so, run `dotnet run --urls http://localhost:5001` and update the client's API base URL (see below) to match.

### 4. Run the React app

In a second terminal, from `client/`:

```bash
npm i
npm run dev
```

Vite serves the app at **http://localhost:5173**. It talks to the API at `http://localhost:5000` by default.

**Changing the API URL:** it lives in one place — `client/src/api.js` (the `API_BASE_URL` constant). You can also override it without editing code by copying `client/.env.example` to `client/.env` and setting `VITE_API_BASE_URL`.

---

## Application structure

```
Priority1.ToDo/
├── docker-compose.yml            # SQL Server only (API + client run natively)
├── global.json                   # Pins the build to the .NET 8 SDK
├── server/
│   ├── Priority1.ToDo.sln
│   ├── Priority1.ToDo.Api/       # ASP.NET Core Web API (startup application)
│   │   ├── Controllers/          # TodosController — thin, calls into services
│   │   ├── Models/               # Request/response DTOs
│   │   ├── Program.cs            # DI, EF, CORS, Swagger wiring
│   │   └── appsettings*.json     # Connection string (Development matches Docker)
│   └── Priority1.ToDo.Core/      # Class library (referenced by the Api)
│       ├── Domain/               # EF entities (Todo)
│       ├── Data/                 # AppDbContext
│       ├── Migrations/           # EF Code First migrations
│       └── Services/             # Business logic (ITodoService / TodoService)
└── client/                       # Vite + React app
    └── src/
        ├── api.js                # API base URL + fetch helpers
        ├── App.jsx               # Loads todos, owns state, wires handlers
        └── components/           # AddTodoForm, TodoList, TodoItem
```

### API endpoints

| Method | Route | Description |
| --- | --- | --- |
| GET | `/todos` | List all todos |
| GET | `/todos/{id}` | Get one todo |
| POST | `/todos` | Create a todo |
| PUT | `/todos/{id}` | Update a todo |
| DELETE | `/todos/{id}` | Delete a todo |

The `Todo` entity: `Id`, `Title` (required), `IsComplete` (default `false`), `CreateDate` (set on insert), `UpdateDate` (set on insert and every update).

### Notes / intentional simplifications

- No authentication or authorization of any kind.
- CORS is wide open for localhost in Development to keep local dev frictionless.
- Migrations are applied manually (step 2), never on startup.

