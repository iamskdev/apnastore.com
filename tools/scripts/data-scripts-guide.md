# Firebase Data Management Scripts

This document provides instructions on how to use the data management scripts.

## Prerequisites

Before running these scripts, ensure you have the following file in place:

-   `src/firebase/serviceAccountKey.json`

This file contains the necessary credentials to connect to your Firebase project.

## How to Use

The scripts should be run from the root directory of the project.

### 1. Uploading Mock Data to Firestore
This script reads all `.json` files from `/localstore/jsons/` and uploads them to your live Firestore database. This is essential for populating your database for testing.

To upload all mock data:
```bash
node tools/scripts/upload-mock-data.js
```

### 2. Downloading Live Data from Firestore
This script downloads data from your live Firestore database and saves it as JSON files in the `localstore` directory. This is useful for backups or for verifying what data is currently on the server.

#### Downloading a Specific Document

To download a single document, provide the collection ID and the document ID as command-line arguments.

```bash
node tools/scripts/download-firestore-data.js <collection_id> <document_id>
```

**Example:**

To export the document with ID `USR00000001` from the `users` collection, run:

```bash
node tools/scripts/backup-data.js users USR00000001
node tools/scripts/backup-data.js categories CAT000000000001
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
