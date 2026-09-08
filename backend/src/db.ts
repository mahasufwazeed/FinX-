import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(__dirname, '..', '..', 'db');
const DB_FILE = path.join(DB_DIR, 'finx_database.json');

export function getDb() {
    if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], escrows: [], milestones: [], payments: [] }, null, 2));
    }

    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    if (!data.payments) data.payments = [];
    return data;
}

export function saveDb(data: any) {
    if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}
