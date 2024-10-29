# Simple CouchDB Doc Generators

A set of simple scripts to generate and insert many documents into a CouchDB. There are currently two scripts, one for products, one for emails.

The scripts will generate and `bulk_docs` insert batches of 10000 documents at a time and are useful up to about a million documents in terms of execution time. If you regularly require several millions of documents _quickly_, additional optimisations are probably in order.

## Usage

- `$ npm i`
- Edit the first few lines in `products.js` or `emails.js` to add your target CouchDB instance and the name of an _existing_ database.
- Run the script and specify the number of docs you want added, for example `$ node products.js 100000` to add 100000 products.

## Document Types

### 1. `products.js`

Generates documents in the following shape:

```json
{
  "_id": "00129778-b92b-4f1e-86bc-182eedca6470",
  "name": "Recycled Rubber Computer",
  "description": "The Football Is Good For Training And Recreational Purposes",
  "department": "Baby",
  "price": 843.89,
  "material": "Concrete",
  "colors": [
    "lime",
    "lavender"
  ],
  "rating": 0.24,
  "numberOfRatings": 790
}
```

### 2. `emails.js`

Generates documents in the following shape:

```json
{
  "_id": "000004f6-63af-4f36-ab16-075b5e8e0ec0",
  "from": "Kira57@example.org",
  "to": "Chanelle86@example.net",
  "subject": "Solitudo atrocitas voluptates cotidie auctor.",
  "body": "Numquam quasi copia theca demoror. Stillicidium possimus vorago atrocitas carpo. Cursus solitudo tepidus adflicto demo velum."
}
```

