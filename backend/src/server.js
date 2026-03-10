const express = require("express");
const morgan = require("morgan");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
const PORT = Number(process.env.PORT) || 3001;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", FRONTEND_ORIGIN);
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

app.get("/api/boards", async (req, res, next) => {
  try {
    const boards = await prisma.board.findMany({
      orderBy: { id: "asc" },
      include: {
        tasks: {
          orderBy: [{ position: "asc" }, { id: "asc" }]
        }
      }
    });

    return res.json(boards);
  } catch (error) {
    return next(error);
  }
});

function parseId(value, name) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return { error: `${name} must be a positive integer.` };
  }
  return { value: parsed };
}

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

function normalizeTaskInput(task, index) {
  if (!task || typeof task !== "object") {
    return { error: "Each task must be an object." };
  }

  if (typeof task.title !== "string" || !task.title.trim()) {
    return { error: "Each task must include a non-empty title." };
  }

  if (
    task.description !== undefined &&
    task.description !== null &&
    typeof task.description !== "string"
  ) {
    return { error: "Task description must be a string or null." };
  }

  if (task.status !== undefined && task.status !== null && typeof task.status !== "string") {
    return { error: "Task status must be a string or null." };
  }

  if (task.icon !== undefined && task.icon !== null && typeof task.icon !== "string") {
    return { error: "Task icon must be a string or null." };
  }

  if (task.position !== undefined && !Number.isInteger(task.position)) {
    return { error: "Task position must be an integer." };
  }

  return {
    value: {
      title: task.title.trim(),
      description: task.description ?? null,
      icon: task.icon ?? null,
      status: task.status ?? null,
      position: task.position ?? index
    }
  };
}

function normalizeBoardFields(body) {
  const updates = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return { error: "title must be a non-empty string." };
    }
    updates.title = body.title.trim();
  }

  if (body.description !== undefined) {
    if (body.description !== null && typeof body.description !== "string") {
      return { error: "description must be a string or null." };
    }
    updates.description = body.description;
  }

  return { value: updates };
}

app.get("/api/boards/:boardId", async (req, res, next) => {
  try {
    const id = parseId(req.params.boardId, "boardId");
    if (id.error) return badRequest(res, id.error);

    const board = await prisma.board.findUnique({
      where: { id: id.value },
      include: {
        tasks: {
          orderBy: [{ position: "asc" }, { id: "asc" }]
        }
      }
    });

    if (!board) {
      return res.status(404).json({ error: "Board not found." });
    }

    return res.json(board);
  } catch (error) {
    return next(error);
  }
});

app.post("/api/boards", async (req, res, next) => {
  try {
    const boardFields = normalizeBoardFields(req.body);
    if (boardFields.error) return badRequest(res, boardFields.error);
    if (!boardFields.value.title) {
      return badRequest(res, "title is required.");
    }

    let taskRows = [];
    if (req.body.tasks !== undefined) {
      if (!Array.isArray(req.body.tasks)) {
        return badRequest(res, "tasks must be an array.");
      }

      taskRows = [];
      for (let i = 0; i < req.body.tasks.length; i += 1) {
        const task = normalizeTaskInput(req.body.tasks[i], i);
        if (task.error) return badRequest(res, task.error);
        taskRows.push(task.value);
      }
    }

    const board = await prisma.board.create({
      data: {
        title: boardFields.value.title,
        description: boardFields.value.description ?? null,
        tasks: taskRows.length ? { create: taskRows } : undefined
      },
      select: { id: true }
    });

    return res.status(201).json({ id: board.id });
  } catch (error) {
    return next(error);
  }
});

app.put("/api/boards/:boardId", async (req, res, next) => {
  try {
    const id = parseId(req.params.boardId, "boardId");
    if (id.error) return badRequest(res, id.error);

    const existingBoard = await prisma.board.findUnique({
      where: { id: id.value },
      select: { id: true }
    });

    if (!existingBoard) {
      return res.status(404).json({ error: "Board not found." });
    }

    const boardFields = normalizeBoardFields(req.body);
    if (boardFields.error) return badRequest(res, boardFields.error);

    let taskRows = null;
    if (req.body.tasks !== undefined) {
      if (!Array.isArray(req.body.tasks)) {
        return badRequest(res, "tasks must be an array.");
      }

      taskRows = [];
      for (let i = 0; i < req.body.tasks.length; i += 1) {
        const task = normalizeTaskInput(req.body.tasks[i], i);
        if (task.error) return badRequest(res, task.error);
        taskRows.push(task.value);
      }
    }

    if (Object.keys(boardFields.value).length === 0 && taskRows === null) {
      return badRequest(res, "Provide at least one field to update.");
    }

    const result = await prisma.$transaction(async (tx) => {
      if (Object.keys(boardFields.value).length > 0) {
        await tx.board.update({
          where: { id: id.value },
          data: boardFields.value
        });
      }

      if (taskRows !== null) {
        await tx.task.deleteMany({ where: { boardId: id.value } });
        if (taskRows.length > 0) {
          await tx.task.createMany({
            data: taskRows.map((task) => ({ ...task, boardId: id.value }))
          });
        }
      }

      return tx.board.findUnique({
        where: { id: id.value },
        include: {
          tasks: {
            orderBy: [{ position: "asc" }, { id: "asc" }]
          }
        }
      });
    });

    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/boards/:boardId", async (req, res, next) => {
  try {
    const id = parseId(req.params.boardId, "boardId");
    if (id.error) return badRequest(res, id.error);

    const existingBoard = await prisma.board.findUnique({
      where: { id: id.value },
      select: { id: true }
    });

    if (!existingBoard) {
      return res.status(404).json({ error: "Board not found." });
    }

    await prisma.board.delete({ where: { id: id.value } });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

app.put("/api/tasks/:taskId", async (req, res, next) => {
  try {
    const id = parseId(req.params.taskId, "taskId");
    if (id.error) return badRequest(res, id.error);

    const updates = {};

    if (req.body.title !== undefined) {
      if (typeof req.body.title !== "string" || !req.body.title.trim()) {
        return badRequest(res, "title must be a non-empty string.");
      }
      updates.title = req.body.title.trim();
    }

    if (req.body.description !== undefined) {
      if (req.body.description !== null && typeof req.body.description !== "string") {
        return badRequest(res, "description must be a string or null.");
      }
      updates.description = req.body.description;
    }

    if (req.body.status !== undefined) {
      if (req.body.status !== null && typeof req.body.status !== "string") {
        return badRequest(res, "status must be a string or null.");
      }
      updates.status = req.body.status;
    }

    if (req.body.icon !== undefined) {
      if (req.body.icon !== null && typeof req.body.icon !== "string") {
        return badRequest(res, "icon must be a string or null.");
      }
      updates.icon = req.body.icon;
    }

    if (req.body.position !== undefined) {
      if (!Number.isInteger(req.body.position)) {
        return badRequest(res, "position must be an integer.");
      }
      updates.position = req.body.position;
    }

    if (req.body.boardId !== undefined) {
      if (!Number.isInteger(req.body.boardId) || req.body.boardId <= 0) {
        return badRequest(res, "boardId must be a positive integer.");
      }

      const board = await prisma.board.findUnique({
        where: { id: req.body.boardId },
        select: { id: true }
      });

      if (!board) {
        return res.status(404).json({ error: "Target board not found." });
      }

      updates.boardId = req.body.boardId;
    }

    if (Object.keys(updates).length === 0) {
      return badRequest(res, "Provide at least one field to update.");
    }

    const existingTask = await prisma.task.findUnique({
      where: { id: id.value },
      select: { id: true }
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found." });
    }

    const task = await prisma.task.update({
      where: { id: id.value },
      data: updates
    });

    return res.json(task);
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/tasks/:taskId", async (req, res, next) => {
  try {
    const id = parseId(req.params.taskId, "taskId");
    if (id.error) return badRequest(res, id.error);

    const existingTask = await prisma.task.findUnique({
      where: { id: id.value },
      select: { id: true }
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found." });
    }

    await prisma.task.delete({ where: { id: id.value } });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);
  return res.status(500).json({ error: "Internal server error." });
});

async function gracefulShutdown() {
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
