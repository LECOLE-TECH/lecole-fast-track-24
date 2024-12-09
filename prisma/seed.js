import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      id: 1,
      image:
        "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/96df9357-1ca3-4c1d-b809-5cecfd619bf3/AIR+JORDAN+5+RETRO.png",
      name: "Product A",
      description: "Description of Product A",
      price: 19.99,
      stock: 100,
    },
    {
      id: 2,
      image:
        "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/b14aba9a-f828-45d3-9607-b687b884aa7d/NIKE+REVOLUTION+7+EASYON.png",
      name: "Product B",
      description: "Description of Product B",
      price: 29.99,
      stock: 150,
    },
    {
      id: 3,
      image:
        "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/4f37fca8-6bce-43e7-ad07-f57ae3c13142/AIR+FORCE+1+%2707.png",
      name: "Product C",
      description: "Description of Product C",
      price: 9.99,
      stock: 200,
    },
    {
      id: 4,
      image:
        "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/dc702cb7-ae0c-4c5a-b132-21c8f4ec93f8/AIR+JORDAN+1+LOW.png",
      name: "Product D",
      description: "Description of Product D",
      price: 49.99,
      stock: 80,
    },
    {
      id: 5,
      image:
        "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/4a077d00-5d6b-47c9-a25c-72d9b20b8584/NIKE+DUNK+LOW+RETRO.png",
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
