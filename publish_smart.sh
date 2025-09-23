#!/data/data/com.termux/files/usr/bin/bash

# --- Publish Smart Tool (v10.0) ---
BOT_TOKEN="8310914786:AAH8NPaIoGKbXtFS_-vpcZ_hzkVH847JDEI"
CHAT_ID="1254508624"

send_telegram() {
    local msg="$1"
    curl -s -X POST "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" \
    -d chat_id="$CHAT_ID" \
    -d text="$msg" >/dev/null
}

timestamp=$(date "+%Y-%m-%d_%H-%M-%S")
PROJECT_NAME=$(basename "$PWD")
BACKUP_DIR="$PWD/.backups"
mkdir -p "$BACKUP_DIR"
backup_file="$BACKUP_DIR/${PROJECT_NAME}_backup.txt"

send_telegram "🗂️ بدء النسخة الاحتياطية للمشروع $PROJECT_NAME..."

# --- Step 0: حفظ/تحديث نسخة احتياطية ذكية ---
{
    echo "Project: $PROJECT_NAME"
    echo "Timestamp: $timestamp"
    echo "Commit: $(git rev-parse HEAD)"
    echo "---- Project Tree ----"
    tree -a -I "node_modules|.git|dist|Build|.backups"
    echo "---- Files Contents (Important) ----"
    find . -type f ! -path "./node_modules/*" ! -path "./.git/*" ! -path "./dist/*" ! -path "./Build/*" ! -path "./.backups/*" -exec echo "=== {} ===" \; -exec cat {} \;
} >> "$backup_file"
send_telegram "🗂️ النسخة الاحتياطية جاهزة: $backup_file"

# --- Step 1: Git Commit & Push ---
COMMIT_MSG="$1"
FORCE_FLAG="$2"

if [ -z "$COMMIT_MSG" ]; then
    send_telegram "❌ خطأ: يرجى إدخال رسالة commit."
    exit 1
fi

git add .

if [[ "$FORCE_FLAG" == "--force" ]]; then
    git commit --allow-empty -m "$COMMIT_MSG"
else
    if git diff-index --quiet HEAD --; then
        send_telegram "ℹ️ لا توجد تغييرات. استخدم --force إذا أردت فرض commit."
    else
        git commit -m "$COMMIT_MSG"
    fi
fi
send_telegram "✅ Commit جاهز."

git pull --rebase || send_telegram "❌ فشل المزامنة مع remote."
git push || send_telegram "❌ فشل رفع التغييرات."
send_telegram "✅ تم رفع التغييرات."

# --- Step 2: Detect Project Type & Blueprint ---
PROJECT_TYPE="web"
if [ -f "android/app/build.gradle" ]; then
    PROJECT_TYPE="android"
fi
send_telegram "ℹ️ نوع المشروع: $PROJECT_TYPE"

if [ ! -f "render.yaml" ]; then
    send_telegram "ℹ️ إنشاء Blueprint render.yaml..."
    if [ "$PROJECT_TYPE" == "web" ]; then
        cat > render.yaml <<EOL
services:
  - type: web
    name: ${PROJECT_NAME}_backend
    env: node
    plan: free
    buildCommand: "pnpm install && pnpm build"
    startCommand: "pnpm start"
  - type: static
    name: ${PROJECT_NAME}_frontend
    env: static
    plan: free
    buildCommand: "pnpm install && pnpm build"
    startCommand: "serve -s dist"
EOL
    else
        cat > render.yaml <<EOL
services:
  - type: web
    name: ${PROJECT_NAME}_android_backend
    env: node
    plan: free
    buildCommand: "pnpm install && pnpm build"
    startCommand: "pnpm start"
EOL
    fi
    send_telegram "✅ تم إنشاء render.yaml."
fi

# --- Step 3: Build & Deploy with Telegram logs ---
send_telegram "🛠️ بدء البناء والنشر..."

if [ "$PROJECT_TYPE" == "web" ]; then
    pnpm install 2>&1 | grep -v "progress" | while read line; do send_telegram "📦 $line"; done
    pnpm build 2>&1 | grep -v "progress" | while read line; do send_telegram "🏗️ $line"; done
    pnpm start 2>&1 | grep -v "progress" | while read line; do send_telegram "🚀 $line"; done
else
    cd android
    ./gradlew assembleRelease 2>&1 | grep -v "progress" | while read line; do send_telegram "🏗️ $line"; done
    cd ..
    send_telegram "🚀 نشر مشروع Android انتهى."
fi

send_telegram "✅ عملية publish للمشروع $PROJECT_NAME اكتملت بتاريخ $timestamp."

