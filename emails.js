const faker = require('@faker-js/faker').faker;
const nano = require('nano')('http://admin:admin@localhost:5984');
const db = nano.db.use('nouveau-email-test');

// Function to generate a email
function generateEmail() {
	return {
		from: faker.internet.exampleEmail(),
		to: faker.internet.exampleEmail(),
		subject: faker.lorem.sentence(),
		body: faker.lorem.paragraphs({ min: 1, max: 5 })
	};
}

// Utility function to generate and insert a chunk of emails
async function generateAndInsertChunk(chunkSize) {
	const emails = [];

	for (let i = 0; i < chunkSize; i++) {
		const email = generateEmail();
		emails.push({ ...email, _id: faker.string.uuid() }); // Ensure each email has a unique ID
	}

	try {
		// Bulk insert the current chunk into CouchDB
		const response = await db.bulk({ docs: emails });
		console.log(`Successfully added ${emails.length} emails to CouchDB`, response);
	} catch (error) {
		console.error('Error adding emails to CouchDB:', error);
	}
}

// Main function to handle email generation and bulk insert in chunks
async function addEmailsToCouchDB(totalEmails) {
	const chunkSize = 10000;
	let remainingEmails = totalEmails;

	while (remainingEmails > 0) {
		// Determine the size of the next chunk (could be smaller than chunkSize if we're near the end)
		const currentChunkSize = Math.min(chunkSize, remainingEmails);

		// Generate and insert the current chunk
		await generateAndInsertChunk(currentChunkSize);

		// Reduce the remaining emails count
		remainingEmails -= currentChunkSize;

		console.log(`${remainingEmails} emails remaining...`);
	}
}

// Specify the number of emails to generate and add to CouchDB
const emailCount = parseInt(process.argv[2], 10) || 10;  // Takes command-line input or defaults to 10 emails
addEmailsToCouchDB(emailCount);
