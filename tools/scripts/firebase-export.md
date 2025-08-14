# Firebase Firestore Data Export

This document provides instructions on how to use the `backup-data.js` script to export data from your Firestore database.

## Prerequisites

Before running the script, ensure you have the following file in place:

-   `src/firebase/serviceAccountKey.json`

This file contains the necessary credentials to connect to your Firebase project.

## How to Use

The script can be run from the root directory of the project.

### Exporting a Specific Document

To export a single document, provide the collection ID and the document ID as command-line arguments.

```bash
node tools/scripts/backup-data.js <collection_id> <document_id>
```

**Example:**

To export the document with ID `USR00000001` from the `users` collection, run:

```bash
node tools/scripts/backup-data.js users USR00000001
node tools/scripts/backup-data.js categories CAT000000000001
node tools/scripts/backup-data.js campaigns CMP000000000001
```

### Exporting a Specific Collection

To export a single collection, provide the collection ID as a command-line argument.

```bash
node tools/scripts/backup-data.js <collection_id>
```

**Example:**

To export only the `users` collection, run:

```bash
node tools/scripts/backup-data.js users
```

### Exporting All Collections

To export all collections from your Firestore database, run the script without any arguments.

```bash
node tools/scripts/backup-data.js
```

## Output

The script will create a `firestore-export` directory in the root of the project. Inside this directory, it will create a folder for each collection, containing JSON files for each document.
