// Update user role to agent
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { email: "nehabr.2302@gmail.com" },
    data: { role: "agent" },
  });
  console.log("✅ User role updated to agent:", user.name, user.email, user.role);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
