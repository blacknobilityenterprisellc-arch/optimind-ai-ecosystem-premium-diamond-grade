# Quick Connection Steps

## 1. Create GitHub Repository
- Go to github.com on your phone
- Create a new repository named `nextjs-tailwind-shadcn-ts`
- Make it Public or Private (your choice)

## 2. Connect Your Local Project
Run these commands in your project directory:

```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/nextjs-tailwind-shadcn-ts.git

# Push your code to GitHub
git push -u origin master
```

## 3. Deploy to Vercel
- Go to vercel.com on your phone
- Click "New Project"
- Select "Import Git Repository"
- Choose your `nextjs-tailwind-shadcn-ts` repository
- Add environment variables:
  - `NEXTAUTH_URL`: `https://your-app.vercel.app`
  - `NEXTAUTH_SECRET`: generate a random string
  - `DATABASE_URL`: `file:./dev.db`
- Click "Deploy"

## 4. Done!
Your app will be live at `https://your-app.vercel.app`

## Need Help?
- Check the full `DEPLOYMENT_GUIDE.md` for detailed instructions
- Visit Vercel docs: https://vercel.com/docs
- Visit GitHub docs: https://docs.github.com