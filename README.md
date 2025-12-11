# Email Marketing Tracker

A fullstack Next.js application for tracking email marketing campaigns. Track email opens and link clicks for your CRM marketing purposes.

## Features

- 📧 **Campaign Management**: Create and manage email marketing campaigns
- 👁️ **Open Tracking**: Track when recipients open your emails using pixel tracking
- 🔗 **Click Tracking**: Track when recipients click links in your emails
- 📊 **Analytics Dashboard**: View detailed statistics and performance metrics
- 📈 **Real-time Tracking**: Monitor email engagement in real-time

## Setup

1. Install dependencies:
```bash
npm install
```

2. **Set up Supabase Database** (Required):
   - Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   - Create a Supabase project
   - Run the SQL schema from `supabase-schema.sql` in Supabase SQL Editor
   - Get your API keys from Supabase dashboard

3. Configure environment variables (create `.env.local` in the root directory):
```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Email Configuration (Optional, for sending emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Base URL for tracking links
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

   📖 **Setup Guides**:
   - **Supabase Setup**: See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for database configuration
   - **Gmail SMTP Setup**: See [GMAIL_SMTP_SETUP.md](./GMAIL_SMTP_SETUP.md) for email sending configuration

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Email Open Tracking
When an email is sent, a 1x1 transparent pixel is embedded in the email. When the recipient opens the email, their email client requests this pixel, which triggers the tracking.

### Link Click Tracking
All links in the email are automatically replaced with tracking URLs that redirect to the original destination while logging the click event.

### Database
The application uses **Supabase** (PostgreSQL) for data storage. You need to:
1. Create a Supabase project
2. Run the SQL schema from `supabase-schema.sql` 
3. Configure your Supabase credentials in `.env.local`

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

## Usage

1. **Create a Campaign**: Go to "Create New Campaign" and fill in the campaign details
2. **Send Emails**: Use the send email form on the campaign detail page to send tracked emails
3. **View Analytics**: Check the Analytics page to see detailed tracking statistics

## Important Notes

- Make sure to configure your SMTP settings correctly for sending emails
- The tracking pixel and links require the application to be accessible from the internet for production use
- This tool is intended for legitimate marketing purposes with proper consent from recipients
