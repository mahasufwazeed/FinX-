import fs from 'fs';
import path from 'path';

// Points explicitly to the root /db folder as part of the monorepo split
const DB_DIR = path.join(__dirname, '..', '..', 'db');
const DB_FILE = path.join(DB_DIR, 'finx_database.json');

export function getDb() {
    if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], escrows: [] }, null, 2));
    }

    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

export function saveDb(data: any) {
    if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}
