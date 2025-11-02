import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = Array.from({ length: 10 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    bio: faker.lorem.sentence(),
    avatar: faker.image.avatar(),
  }));

  await prisma.user.createMany({
    data: users,
  });

  const lps = Array.from({ length: 400 }).map(() => ({
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    thumbnail: faker.image.urlLoremFlickr(),
    authorId: faker.number.int({ min: 1, max: 10 }),
    published: true,
  }));

  // SQLite는 동시에 많은 쓰기 작업을 처리할 때 잠금이 걸릴 수 있어 타임아웃이 발생할 수 있습니다.
  // 동시성 대신 순차적으로 생성하여 잠금 문제를 회피합니다.
  for (const lp of lps) {
    try {
      await prisma.lp.create({
        data: {
          ...lp,
          comments: {
            createMany: {
              data: Array.from({ length: 20 }).map(() => ({
                content: faker.lorem.sentence(),
                authorId: faker.number.int({ min: 1, max: 10 }),
              })),
            },
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  console.log('Seed completed');
}

main()
  .then(() => {
    prisma.$disconnect();
    process.exit(0);
  })
  .catch((e) => {
    prisma.$disconnect();
    console.error(e);
    process.exit(1);
  });
