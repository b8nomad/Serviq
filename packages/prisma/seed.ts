import prisma from "./index";
import bcrypt from "bcrypt";
async function main() {
  // const baseEmail = "elishasmile.dev@gmail.com";
  // const [localPart, domain] = baseEmail.split("@");

  // const users = [];

  // for (let i = 1; i <= 3; i++) {
  //   const user = await prisma.user.create({
  //     data: {
  //       name: `Test User ${i}`,
  //       username: `testuser${i}`,
  //       email: `${localPart}+${i}@${domain}`,
  //       type: "INTERNAL",
  //       employee: {
  //         create: {
  //           department: "Engineering",
  //           title: `Software Engineer ${i}`,
  //           level: i,
  //           is_online: true,
  //           is_active: true,
  //         },
  //       },
  //     },
  //     include: {
  //       employee: true,
  //     },
  //   });

  //   users.push(user);
  //   console.log(`Created user: ${user.email} with employee record`);
  // }

  // console.log("\n✓ Successfully created 3 users with employee records:");
  // console.log(users);

  // await prisma.permission.createMany({
  //   data: [
  //     { key: "ticket.view" },
  //     { key: "ticket.view.all" },
  //     { key: "ticket.comment" },
  //     { key: "ticket.comment.all" },
  //     { key: "ticket.assign" },
  //     { key: "ticket.assign.all" },
  //   ],
  // });
  const permissions = [
    "d6ec40b0-48b6-4085-ac28-81f25d13e7a5",
    // ticket.view
    "d1018402-2116-4c73-99fd-9b55630e4eca",
    // ticket.view.all
    "2c5b765a-2f5e-4893-8a24-4ebbc1edcccb",
    // ticket.comment
    "64211a2b-9ed1-4210-b384-d33bdb222389",
    // ticket.comment.all
    "8340266d-247e-4457-b37e-bd9a48db9e9e",
    // ticket.assign
    "e4d13efe-074d-4431-a1c4-f318d43b9f7a",
    // ticket.assign.all
  ];
  const users = [
    "4486232a-91cb-41c5-af9e-b11789cf8025",
    "40d3d2f5-9c85-4c94-b223-fadb029322b0",
    "ddd74eff-b4e2-48d9-a99d-a5ab33c9c094",
  ];
  // await prisma.userPermission.createMany({
  //   data: [
  //     { user_id: users[0]!, permission_id: permissions[1]! },
  //     { user_id: users[0]!, permission_id: permissions[3]! },
  //     { user_id: users[0]!, permission_id: permissions[5]! },
  //     { user_id: users[1]!, permission_id: permissions[0]! },
  //     { user_id: users[1]!, permission_id: permissions[2]! },
  //     { user_id: users[1]!, permission_id: permissions[3]! },
  //     { user_id: users[2]!, permission_id: permissions[0]! },
  //   ],
  // });

  const password = "123456789";
  const salt = await bcrypt.genSalt(11);

  const hash = await bcrypt.hash(password, salt);

  await prisma.user.updateMany({
    where: {
      id: {
        in: [users[0]!, users[1]!, users[2]!],
      },
    },
    data: {
      password: hash,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
