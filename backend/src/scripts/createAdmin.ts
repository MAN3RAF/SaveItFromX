import readline from 'readline';
import { pool } from '../services/db/client.js';
import { hashPassword } from '../services/auth/tokenService.js';
import { config } from '../config/index.js';

function askQuestion(queryText: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(queryText, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

async function createAdmin() {
  console.log('============================================');
  console.log(' SaveItFromX - Secure Admin Account Creator');
  console.log('============================================\n');

  if (!pool) {
    console.error('❌ Error: DATABASE_URL is not set or invalid.');
    console.error('Please configure DATABASE_URL in backend/.env before creating an admin account.');
    process.exit(1);
  }

  // 1. Determine Email & Password
  let email = process.env.INITIAL_ADMIN_EMAIL || config.initialAdminEmail || '';
  let password = process.env.INITIAL_ADMIN_PASSWORD || '';
  let username = 'SuperAdmin';

  const args = process.argv.slice(2);
  for (const arg of args) {
    if (arg.startsWith('--email=')) email = arg.split('=')[1];
    if (arg.startsWith('--password=')) password = arg.split('=')[1];
    if (arg.startsWith('--username=')) username = arg.split('=')[1];
  }

  // If running interactively and not provided via env/args, prompt securely
  if (!email && process.stdin.isTTY) {
    email = await askQuestion('Enter Admin Email (e.g. admin@saveitfromx.com): ');
  }
  if (!password && process.stdin.isTTY) {
    password = await askQuestion('Enter Admin Password (min 8 chars): ');
  }

  if (!email || !email.includes('@')) {
    console.error('❌ Error: A valid admin email address is required.');
    process.exit(1);
  }

  if (!password || password.length < 8) {
    console.error('❌ Error: Password must be at least 8 characters long.');
    process.exit(1);
  }

  console.log(`\n⏳ Hashing password with bcrypt (12 rounds) for ${email}...`);
  const passwordHash = await hashPassword(password);

  const client = await pool.connect();
  try {
    // Check if admin already exists
    const existing = await client.query('SELECT id, email, username FROM admins WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log(`ℹ️ Admin account for ${email} already exists.`);
      console.log('Updating password hash with new bcrypt credentials...');
      await client.query(
        'UPDATE admins SET password_hash = $1, updated_at = NOW() WHERE email = $2',
        [passwordHash, email]
      );
      console.log(`✅ Success: Password for admin [${email}] has been securely updated!`);
    } else {
      const res = await client.query(
        `INSERT INTO admins (email, username, password_hash, role)
         VALUES ($1, $2, $3, 'superadmin')
         RETURNING id, email, username, role, created_at`,
        [email, username, passwordHash]
      );
      const newAdmin = res.rows[0];
      console.log(`✅ Success: Admin account created successfully!`);
      console.log(`   - ID: ${newAdmin.id}`);
      console.log(`   - Email: ${newAdmin.email}`);
      console.log(`   - Role: ${newAdmin.role}`);
      console.log(`   - Created: ${newAdmin.created_at}`);
    }
  } catch (err: any) {
    console.error('❌ Failed to create admin in database:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

createAdmin().catch((err) => {
  console.error('Fatal error during admin creation:', err);
  process.exit(1);
});
