# TaxAI.pk launch setup

## Connect the Google Sheet

1. Open the supplied Google Sheet, then choose **Extensions → Apps Script**.
2. Replace the editor contents with `google-apps-script.gs` and save.
3. Choose **Deploy → New deployment → Web app**.
4. Set **Execute as: Me** and **Who has access: Anyone**, then deploy.
5. Copy the `/exec` URL and paste it between the quotes in `config.js`.

The script creates a **Waitlist** worksheet automatically. It stores both homepage and calculator CTA leads and records their source separately.

## Deploy to Vercel

Upload this entire folder to a Git repository and import that repository into Vercel, or use Vercel's project upload flow. No build command is required; the output directory is the project root.

Add `taxai.pk` and `www.taxai.pk` in **Vercel → Project Settings → Domains**, then apply the DNS records Vercel shows. The homepage will be the waitlist and `/yta/` will be the calculator.

If `taxai.com` is also owned by you, add `taxai.com` and `www.taxai.com` to the same Vercel project and configure its DNS records too.
