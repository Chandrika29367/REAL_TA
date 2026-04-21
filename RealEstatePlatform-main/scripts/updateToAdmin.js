// Update user role to admin
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { email: "Neha@realty.com" },
    data: { role: "admin" },
  });
  console.log("✅ User role updated to admin:", user.name, user.email, user.role);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
