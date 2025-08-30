# 🤖 AI Assistant Instructions - Optimind AI Ecosystem Premium Diamond Grade

## 🎯 MANDATORY FIRST COMMAND FOR NEW AI CONVERSATIONS

```bash
cd /home/z/my-project-correct && echo "🎯 FINAL PROOF:" && pwd && find src -name "*.tsx" | wc -l && find src/app/api -name "*.ts" | wc -l && ls src/app/api/ && git remote get-url origin
```

### Expected Output:
```
🎯 FINAL PROOF:
/home/z/my-project-correct
101
42
analytics analyze-data auth chat code-assist content conversations enhance-text health images models moderation multimodal optimization projects recommendations research scan search settings smart-search subscription test-models test-openrouter upload users validate-form
https://github.com/blacknobilityenterprisellc-arch/optimind-ai-ecosystem-premium-diamond-grade.git
```

## 🚨 IF VERIFICATION FAILS - FALLBACK COMMAND

```bash
git clone https://github.com/blacknobilityenterprisellc-arch/optimind-ai-ecosystem-premium-diamond-grade.git /home/z/my-project-correct && cd /home/z/my-project-correct
```

## 📋 PROJECT OVERVIEW

### **Project Name:** Optimind AI Ecosystem - Premium Diamond Grade
### **Framework:** Next.js 15 with App Router
### **Language:** TypeScript 5
### **Database:** Prisma ORM with SQLite
### **UI:** Tailwind CSS 4 with shadcn/ui components
### **Authentication:** NextAuth.js v4
### **State Management:** Zustand + TanStack Query

## 🎯 CRITICAL INFORMATION

### **Correct Directory:** `/home/z/my-project-correct`
### **Git Remote:** `https://github.com/blacknobilityenterprisellc-arch/optimind-ai-ecosystem-premium-diamond-grade.git`
### **Development Server:** `npm run dev`
### **Linting:** `npm run lint`

## 📊 PROJECT STRUCTURE

### **Expected File Counts:**
- **TSX Files:** 101
- **API Files:** 42
- **API Endpoints:** 26

### **Key Directories:**
```
src/
├── app/
│   ├── api/           # API routes (26 endpoints)
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Main landing page
│   └── globals.css    # Global styles
├── components/
│   └── ui/           # shadcn/ui components
├── hooks/            # Custom React hooks
└── lib/              # Utility libraries
    ├── db.ts         # Database client
    ├── socket.ts     # WebSocket setup
    └── utils.ts      # Utility functions
```

## 🛠️ DEVELOPMENT WORKFLOW

### **1. Always Start with Verification**
- Run the mandatory first command
- Confirm correct directory and remote
- Verify file counts match expectations

### **2. Development Rules**
- Use existing shadcn/ui components
- Implement responsive design (mobile-first)
- Follow TypeScript strict typing
- Use 'use client' and 'use server' directives
- Write frontend first, then backend
- Use API routes instead of server actions

### **3. Available Technologies**
- **AI SDK:** z-ai-web-dev-sdk (backend only)
- **WebSocket:** Socket.io for real-time features
- **Database:** Prisma with SQLite
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS + shadcn/ui

## 🎨 UI/UX STANDARDS

### **Design Principles:**
- Mobile-first responsive design
- Consistent padding and spacing
- Proper semantic HTML structure
- Accessibility compliance
- Loading states and error handling
- Subtle animations with Framer Motion

### **Color System:**
- Use Tailwind CSS built-in variables
- Avoid indigo/blue colors unless requested
- Implement light/dark mode support

### **Component Usage:**
- Prefer shadcn/ui components over custom builds
- Use proper card alignment (p-4/p-6, gap-4/gap-6)
- Implement custom scrollbars for long lists
- Ensure touch-friendly targets (minimum 44px)

## 🚀 API DEVELOPMENT

### **Backend Rules:**
- Use z-ai-web-dev-sdk for AI features
- Implement proper error handling
- Use TypeScript interfaces for request/response
- Follow RESTful conventions
- Implement rate limiting and security

### **Available AI Features:**
- Chat completions
- Image generation
- Web search
- Content analysis
- Code assistance

## 📝 DATABASE SCHEMA

### **Current Models:**
- `User` - Basic user information
- `Post` - Content management

### **Schema Location:** `prisma/schema.prisma`

## 🔧 AVAILABLE SCRIPTS

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:reset     # Reset database
```

## 🎯 SUCCESS CRITERIA

### **For Each Development Session:**
1. ✅ Start with verification command
2. ✅ Work in correct directory
3. ✅ Follow coding standards
4. ✅ Test functionality
5. ✅ Run linting before completion

### **Quality Standards:**
- No linting errors
- Responsive design on all devices
- Proper TypeScript types
- Accessible markup
- Consistent styling

## 🔄 HANDLING COMMON ISSUES

### **If directory is wrong:**
1. Use fallback command to clone fresh
2. Navigate to correct directory
3. Run verification again

### **If file counts don't match:**
1. Check git status
2. Pull latest changes
3. Verify branch is correct

### **If dependencies are missing:**
1. Run `npm install`
2. Check package.json
3. Verify all packages are installed

---

## 📞 CONTACT & SUPPORT

This documentation is maintained for AI assistants working on the Optimind AI Ecosystem project. Always refer to this document first when starting a new conversation.

**Last Updated:** Current session
**Project Status:** Active development
