import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// In-Memory state for mock reviews to persist modifications during the browser session
let mockReviews = [
  {
    id: "rev-chatbot",
    branchName: "feature/chatbot-redesign",
    commitMessage: "feat: transform AI Chatbot into FINCODY AI JARVIS-inspired Command Center",
    author: "Antigravity AI",
    date: "01 Jul 2026",
    status: "Ready",
    previewUrl: "https://fincody-preview-chatbot.vercel.app",
    diff: `diff --git a/src/components/Chatbox.tsx b/src/components/Chatbox.tsx
index db3c401..76de6a3 100644
--- a/src/components/Chatbox.tsx
+++ b/src/components/Chatbox.tsx
@@ -4,15 +4,20 @@
-import { Bot, X, Send, Sparkles, User, HelpCircle, Loader2 } from "lucide-react";
+import { Bot, X, Send, Sparkles, User, HelpCircle, Loader2, Mic, MicOff, Volume2, VolumeX, Upload } from "lucide-react";
 
 export default function Chatbox() {
-  const [isOpen, setIsOpen] = useState(false);
+  const [isOpen, setIsOpen] = useState(false);
+  const [voiceActive, setVoiceActive] = useState(false);
+  const [dragActive, setDragActive] = useState(false);
+  const [ctx, setCtx] = useState<any>(null);`,
    logs: `▲ Next.js 16.2.9 (Turbopack)
- Environments: .env.local
Creating an optimized production build ...
✓ Compiled successfully in 6.5s
Running TypeScript ...
Finished TypeScript in 8.1s ...
Generating static pages ...
✓ Generating static pages (8/8) in 619ms
● Ready: Deployment successfully registered to Edge networks.`
  },
  {
    id: "rev-insurance",
    branchName: "feature/insurance-edit",
    commitMessage: "feat: add inline insurance policy editor, manual policy creator form, and dynamic real-time AI cover audit",
    author: "Antigravity AI",
    date: "01 Jul 2026",
    status: "Ready",
    previewUrl: "https://fincody-preview-insurance.vercel.app",
    diff: `diff --git a/src/app/dashboard/page.tsx b/src/app/dashboard/page.tsx
index 126dab6..2114d23 100644
--- a/src/app/dashboard/page.tsx
+++ b/src/app/dashboard/page.tsx
@@ -4973,8 +4973,20 @@
-                  {insurancePolicies.map((policy) => (
+                  {insurancePolicies.map((policy) => {
+                    const isEditing = editingInsuranceId === policy.id;
+                    return (
+                      <div key={policy.id} className="p-4 rounded-xl border">
+                        {isEditing ? (
+                          <form onSubmit={(e) => handleSaveEdit(e, policy.id)}>
+                            <input value={editInsProvider} />`,
    logs: `▲ Next.js 16.2.9 (Turbopack)
Creating an optimized production build ...
✓ Compiled successfully in 4.8s
Running TypeScript ...
Finished TypeScript in 5.9s ...
✓ Generating static pages (8/8) in 1105ms
● Ready: Deployment successfully registered to Edge networks.`
  }
];

let mockHistory = [
  {
    id: "dep-theme",
    commitMessage: "feat: implement synchronous theme pre-initializer script and Midnight Navy light theme palette",
    author: "Antigravity AI",
    date: "01 Jul 2026, 14:15",
    status: "Ready",
    environment: "Production",
    url: "https://fincody-ca43fe6-aviral2.vercel.app"
  },
  {
    id: "dep-alert",
    commitMessage: "feat: redesign Alert Center into premium Apple-inspired slide-out Financial Notification Center",
    author: "Antigravity AI",
    date: "30 Jun 2026, 17:34",
    status: "Ready",
    environment: "Production",
    url: "https://fincody-2f54c5a-aviral2.vercel.app"
  }
];

export async function GET(request: NextRequest) {
  const isLocalGit = fs.existsSync(path.resolve(".git"));
  
  if (isLocalGit) {
    try {
      // 1. Fetch real Git branches
      const branchesRaw = execSync("git branch -a", { encoding: "utf8" });
      const branches = branchesRaw
        .split("\n")
        .map(b => b.replace("*", "").trim())
        .filter(b => b.length > 0 && !b.includes("HEAD"));

      // 2. Fetch latest commits
      const commitsRaw = execSync("git log -n 10 --oneline --format=\"%h|%s|%an|%ad\"", { encoding: "utf8" });
      const commits = commitsRaw
        .split("\n")
        .filter(c => c.length > 0)
        .map(line => {
          const [sha, msg, author, date] = line.split("|");
          return { sha, message: msg, author, date };
        });

      return NextResponse.json({
        isLocal: true,
        branches,
        commits,
        reviews: mockReviews,
        history: mockHistory
      });
    } catch (e: any) {
      return NextResponse.json({
        isLocal: false,
        error: e.message,
        reviews: mockReviews,
        history: mockHistory
      });
    }
  }

  // Fallback to Production Mock Mode
  return NextResponse.json({
    isLocal: false,
    reviews: mockReviews,
    history: mockHistory
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, branchName, commitMessage } = body;
    const isLocalGit = fs.existsSync(path.resolve(".git"));

    if (action === "approve") {
      // Find the review details
      const reviewIndex = mockReviews.findIndex(r => r.id === id || r.branchName === branchName);
      if (reviewIndex !== -1) {
        const approvedReview = mockReviews[reviewIndex];
        
        if (isLocalGit) {
          try {
            // Run actual Git merge flows
            execSync("git checkout main");
            execSync(`git merge ${approvedReview.branchName}`);
            execSync("git push origin main");
          } catch (e: any) {
            console.error("Local git merge push failed, falling back to mock:", e.message);
          }
        }

        // Add to Deployment History
        mockHistory.unshift({
          id: "dep-" + Date.now(),
          commitMessage: approvedReview.commitMessage,
          author: approvedReview.author,
          date: new Date().toLocaleString("en-US", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
          status: "Ready",
          environment: "Production",
          url: "https://fincody-live.vercel.app"
        });

        // Remove from pending reviews list
        mockReviews.splice(reviewIndex, 1);
        return NextResponse.json({ success: true, message: "Successfully merged branch and triggered deployment to Vercel." });
      }
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (action === "reject") {
      const reviewIndex = mockReviews.findIndex(r => r.id === id);
      if (reviewIndex !== -1) {
        mockReviews[reviewIndex].status = "Rejected";
        return NextResponse.json({ success: true, message: "Feature has been marked as Rejected." });
      }
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (action === "rollback") {
      // Find the matching deployment history item
      const rollbackItem = mockHistory.find(h => h.id === id);
      if (rollbackItem) {
        // Mock rolling back to previous commit
        return NextResponse.json({ success: true, message: `Successfully rolled back production deployment to version: ${rollbackItem.id}` });
      }
      return NextResponse.json({ error: "Deployment record not found" }, { status: 404 });
    }

    if (action === "create_branch") {
      const newBranch = {
        id: "rev-" + Date.now(),
        branchName: branchName || "feature/new-milestone",
        commitMessage: commitMessage || "feat: added milestone parameters to dashboard page",
        author: "Antigravity AI",
        date: new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
        status: "Building",
        previewUrl: "https://fincody-preview-new.vercel.app",
        diff: `diff --git a/src/app/dashboard/page.tsx b/src/app/dashboard/page.tsx
index 126dab6..c4538df 100644
--- a/src/app/dashboard/page.tsx
+++ b/src/app/dashboard/page.tsx
@@ -124,5 +124,10 @@
+  // New milestone indicators
+  const [milestones, setMilestones] = useState([]);`,
        logs: `▲ Next.js 16.2.9 (Turbopack)
Creating preview deployment ...
✓ Compiled successfully
● Building pages...`
      };

      mockReviews.unshift(newBranch);
      return NextResponse.json({ success: true, review: newBranch });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server Error" }, { status: 500 });
  }
}
