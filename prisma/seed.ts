import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedAdmin() {
    const hashedPassword = await bcrypt.hash(
        process.env.DEFAULT_ADMIN_PASS,
        Number(process.env.PASSWORD_HASH),
      );
    const admin = {name: "BOHA", email: "gs.hostel@iitrpr.ac.in", password: hashedPassword, isAdmin: true}
    await prisma.user.upsert({
        where: {email: "gs.hostel@iitrpr.ac.in"},
        update: {},
        create: admin,
    })
}

seedAdmin()
  .then(() => {
    console.log('Admin seeded successfully.');
  })
  .catch((error) => {
    console.error('Error seeding roles:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });