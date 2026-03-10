const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const tasks = [
    { title: "Task in Progress", description: null, icon: "⏰", status: "in-progress", position: 0 },
    { title: "Task Completed", description: null, icon: "🏋️", status: "completed", position: 1 },
    { title: "Task Won't Do", description: null, icon: "☕", status: "wont-do", position: 2 },
    {
      title: "Task To Do",
      description: "Work on a challenge on devChallenges.io, learn TypeScript.",
      icon: "📚",
      status: "todo",
      position: 3
    }
  ];

  const existingBoard = await prisma.board.findFirst({
    orderBy: { id: "asc" },
    select: { id: true }
  });

  const board = existingBoard
    ? await prisma.board.update({
        where: { id: existingBoard.id },
        data: {
          title: "My Task Board",
          description: "Tasks to keep organised"
        }
      })
    : await prisma.board.create({
        data: {
          title: "My Task Board",
          description: "Tasks to keep organised"
        }
      });

  await prisma.task.deleteMany({ where: { boardId: board.id } });
  await prisma.task.createMany({
    data: tasks.map((task) => ({ ...task, boardId: board.id }))
  });

  const result = await prisma.board.findUnique({
    where: { id: board.id },
    include: { tasks: { orderBy: { position: "asc" } } }
  });

  console.log("Seed completed:");
  console.log(JSON.stringify(result, null, 2));
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
