import Database from '@replit/database';
const db = new Database();

async function clear() {
  await db.delete('plan');
  console.log('✅ Plan deleted from Replit DB');
}

clear();
