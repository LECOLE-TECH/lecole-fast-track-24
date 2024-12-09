import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      id: 1,
      name: "Product A",
      description: "Description of Product A",
      price: 19.99,
      stock: 100,
    },
    {
      id: 2,
      name: "Product B",
      description: "Description of Product B",
      price: 29.99,
      stock: 150,
    },
    {
      id: 3,
      name: "Product C",
      description: "Description of Product C",
      price: 9.99,
      stock: 200,
    },
    {
      id: 4,
      name: "Product D",
      description: "Description of Product D",
      price: 49.99,
      stock: 80,
    },
    {
      id: 5,
      name: "Product E",
      description: "Description of Product E",
      price: 24.99,
      stock: 50,
    },
  ];

  for (const product of products) {
    // Check if the product already exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });

    if (!existingProduct) {
      // Create the product if it does not exist
      await prisma.product.create({ data: product });
      console.log(`Created product: ${product.name}`);
    } else {
      console.log(`Product already exists: ${product.name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
