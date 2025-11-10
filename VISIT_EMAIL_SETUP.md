# Visit Confirmation Email Setup

## Overview
The university website now includes automatic email notifications for approved visit requests. When an admin approves a visit request through the admin panel, a confirmation email is automatically sent to the visitor.

## Email Service Configuration

### 1. Set up Resend Account
1. Go to [resend.com](https://resend.com) and create an account
2. Verify your email address
3. Get your API key from the dashboard

### 2. Configure Environment Variables

#### For Local Development (.env)
Add these variables to your `.env` file:
```
RESEND_API_KEY=your_actual_resend_api_key_here
FROM_EMAIL=noreply@university.edu
```

#### For Production (.env.production)
Copy `.env.production.template` to `.env.production` and update:
```
RESEND_API_KEY=your_actual_resend_api_key_here
FROM_EMAIL=noreply@university.edu
```

### 3. Domain Verification (Production)
For production emails to work properly:
1. Add your domain to Resend (e.g., university.edu)
2. Verify domain ownership
3. Set up SPF/DKIM records as instructed by Resend

#### Domain Verification Options:

**If using Name Servers (most common):**
- **Contact your hosting provider** - Ask them to add the DNS records Resend provides
- **Use a subdomain** - Create `mail.yourdomain.com` and point it to Resend
- **Switch to custom DNS** - Change to custom name servers to add records directly

**If using Custom DNS:**
- Add the TXT, CNAME, and MX records directly in your DNS settings

#### Common Hosting Providers:
- **GoDaddy**: DNS settings in domain manager
- **Namecheap**: Advanced DNS section
- **Hostinger**: DNS Zone Editor
- **Bluehost**: Zone Editor
- **SiteGround**: DNS Editor

## How It Works

1. **Admin Approval**: When an admin clicks "Approve" on a visit request in `/admin/visit-requests`
2. **Database Update**: The visit request status is updated to 'approved'
3. **Email Trigger**: The system automatically sends a confirmation email to the visitor
4. **Email Content**: Includes visit details, what to expect, and contact information

## Email Template Features

- Professional HTML design with university branding
- Visit details (date, time, type)
- What to expect during the visit
- Contact information for questions
- Mobile-responsive design

## Testing

To test the email functionality:

1. Submit a visit request through the website
2. Go to `/admin/visit-requests`
3. Click "Approve" on the pending request
4. Check that the email was sent (logs will show success/failure)

## Troubleshooting

- **Emails not sending**: Check that `RESEND_API_KEY` is set correctly
- **"From" address issues**: Ensure the domain is verified in Resend
- **Email going to spam**: Check SPF/DKIM setup and domain reputation

## Security Notes

- API keys are stored as environment variables (not in code)
- Email sending is handled server-side only
- No sensitive visitor data is logged in email service