import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'email_tracker.db');
const db = new Database(dbPath);

// Initialize database schema
export function initDatabase() {
  // Campaigns table
  db.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      subject TEXT NOT NULL,
      from_email TEXT NOT NULL,
      from_name TEXT NOT NULL,
      html_content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'draft'
    )
  `);

  // Recipients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS recipients (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL,
      email TEXT NOT NULL,
      name TEXT,
      sent_at DATETIME,
      opened_at DATETIME,
      opened_count INTEGER DEFAULT 0,
      clicked_at DATETIME,
      clicked_count INTEGER DEFAULT 0,
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
    )
  `);

  // Tracking events table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tracking_events (
      id TEXT PRIMARY KEY,
      recipient_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      link_url TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (recipient_id) REFERENCES recipients(id)
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_recipients_campaign ON recipients(campaign_id);
    CREATE INDEX IF NOT EXISTS idx_tracking_recipient ON tracking_events(recipient_id);
    CREATE INDEX IF NOT EXISTS idx_tracking_type ON tracking_events(event_type);
  `);
}

// Initialize on import
initDatabase();

export default db;

