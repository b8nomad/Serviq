import prisma from "./index";

async function main() {
  const baseEmail = "elishasmile.dev@gmail.com";
  const [localPart, domain] = baseEmail.split("@");

  const users = [];

  for (let i = 1; i <= 3; i++) {
    const user = await prisma.user.create({
      data: {
        name: `Test User ${i}`,
        username: `testuser${i}`,
        email: `${localPart}+${i}@${domain}`,
        type: "INTERNAL",
        employee: {
          create: {
            department: "Engineering",
            title: `Software Engineer ${i}`,
            level: i,
            is_online: true,
            is_active: true,
          },
        },
      },
      include: {
        employee: true,
      },
    });

    users.push(user);
    console.log(`Created user: ${user.email} with employee record`);
  }

  console.log("\n✓ Successfully created 3 users with employee records:");
  console.log(users);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
