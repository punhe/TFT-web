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

2. Configure environment variables (create `.env.local`):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Email Open Tracking
When an email is sent, a 1x1 transparent pixel is embedded in the email. When the recipient opens the email, their email client requests this pixel, which triggers the tracking.

### Link Click Tracking
All links in the email are automatically replaced with tracking URLs that redirect to the original destination while logging the click event.

### Database
The application uses SQLite for data storage. The database file (`email_tracker.db`) is automatically created on first run.

## Usage

1. **Create a Campaign**: Go to "Create New Campaign" and fill in the campaign details
2. **Send Emails**: Use the send email form on the campaign detail page to send tracked emails
3. **View Analytics**: Check the Analytics page to see detailed tracking statistics

## Important Notes

- Make sure to configure your SMTP settings correctly for sending emails
- The tracking pixel and links require the application to be accessible from the internet for production use
- This tool is intended for legitimate marketing purposes with proper consent from recipients
