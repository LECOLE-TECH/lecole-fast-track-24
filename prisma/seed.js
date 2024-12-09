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
    {
      id: 6,
      name: "Product F",
      description: "Description of Product F",
      price: 39.99,
      stock: 120,
    },
    {
      id: 7,
      name: "Product G",
      description: "Description of Product G",
      price: 14.99,
      stock: 90,
    },
    {
      id: 8,
      name: "Product H",
      description: "Description of Product H",
      price: 59.99,
      stock: 70,
    },
    {
      id: 9,
      name: "Product I",
      description: "Description of Product I",
      price: 34.99,
      stock: 110,
    },
    {
      id: 10,
      name: "Product J",
      description: "Description of Product J",
      price: 19.49,
      stock: 95,
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
