const faker = require('@faker-js/faker').faker;
const nano = require('nano')('http://admin:admin@localhost:5984');
const db = nano.db.use('nouveau-shop-test');

function generateColors() {
  const numberOfColors = Math.floor(Math.random() * 3) + 1; // Random number between 1 and 3
  const colors = [];

  for (let i = 0; i < numberOfColors; i++) {
    colors.push(faker.color.human());
  }

  return colors;
}

// Function to generate a product
function generateProduct() {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    department: faker.commerce.department(),
    price: parseFloat(faker.commerce.price()),  // Convert price to float
    material: faker.commerce.productMaterial(),
    colors: generateColors(),  // Array of between 1 and 3 colors
	  rating: parseFloat((Math.random() * 5).toFixed(2)),  // Random rating between 0 and 5 with 2 decimals
    numberOfRatings: Math.floor(Math.random() * 1000) + 1  // Random integer above 0
  };
}

// Utility function to generate and insert a chunk of products
async function generateAndInsertChunk(chunkSize) {
  const products = [];

  for (let i = 0; i < chunkSize; i++) {
    const product = generateProduct();
    products.push({ ...product, _id: faker.string.uuid() }); // Ensure each product has a unique ID
  }

  try {
    // Bulk insert the current chunk into CouchDB
    const response = await db.bulk({ docs: products });
    console.log(`Successfully added ${products.length} products to CouchDB`, response);
  } catch (error) {
    console.error('Error adding products to CouchDB:', error);
  }
}

// Main function to handle product generation and bulk insert in chunks
async function addProductsToCouchDB(totalProducts) {
  const chunkSize = 10000;
  let remainingProducts = totalProducts;

  while (remainingProducts > 0) {
    // Determine the size of the next chunk (could be smaller than chunkSize if we're near the end)
    const currentChunkSize = Math.min(chunkSize, remainingProducts);

    // Generate and insert the current chunk
    await generateAndInsertChunk(currentChunkSize);

    // Reduce the remaining products count
    remainingProducts -= currentChunkSize;

    console.log(`${remainingProducts} products remaining...`);
  }
}

// Specify the number of products to generate and add to CouchDB
const productCount = parseInt(process.argv[2], 10) || 10;  // Takes command-line input or defaults to 10 products
addProductsToCouchDB(productCount);
