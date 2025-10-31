# Deployment Guide - Vercel

## Prerequisites
- A Vercel account (sign up at https://vercel.com)
- Git repository (optional but recommended)

## Quick Deploy

### Option 1: Deploy with Vercel CLI (Recommended)

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy the project**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? **movie-stream** (or any name)
   - In which directory is your code located? **.**
   - Want to modify settings? **N**

3. **Add Environment Variable**
   ```bash
   vercel env add TMDB_API_KEY
   ```
   - Select: **Production, Preview, Development**
   - Paste your API key: `10eaebf12c139dadb28a57991cfce1a6`

4. **Redeploy with environment variables**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub** (if not already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your GitHub repository
   - Configure project:
     - Framework Preset: **Next.js**
     - Root Directory: **.**
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Add Environment Variables**
   - In project settings, go to "Environment Variables"
   - Add: `TMDB_API_KEY` = `10eaebf12c139dadb28a57991cfce1a6`
   - Apply to: Production, Preview, Development
   - Click "Save"

4. **Redeploy**
   - Go to "Deployments" tab
   - Click "Redeploy" on the latest deployment

## Important Notes

⚠️ **Security Reminders:**
- Never commit `.env.local` to Git (already in `.gitignore`)
- Always use environment variables on Vercel for API keys
- The TMDB API key is server-side only and won't be exposed to users

✅ **What's Included:**
- Automatic HTTPS
- Global CDN
- Automatic deployments on Git push
- Zero configuration needed
- Free hosting for personal projects

## Post-Deployment

After deployment, your app will be available at:
- Production: `https://your-project-name.vercel.app`
- Each git push creates a new preview deployment

## Troubleshooting

**If the app doesn't work after deployment:**

1. Check if environment variables are set correctly
2. Check the deployment logs in Vercel dashboard
3. Make sure all dependencies are in `package.json`
4. Redeploy after adding environment variables

**Common Issues:**
- "TMDB_API_KEY is undefined" → Add environment variable in Vercel
- "Module not found" → Run `npm install` locally and commit changes
- Build fails → Check build logs in Vercel dashboard
