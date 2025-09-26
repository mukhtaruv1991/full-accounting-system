#!/bin/bash

# ======== إعداد المتغيرات ========
PROJECT_DIR="$HOME/full-accounting-system/frontend"
BACKUP_DIR="$HOME/full-accounting-system/error_backup"
LOG_FILE="$HOME/full-accounting-system/error.log"
BOT_TOKEN="${BOT_TOKEN:-ضع_هنا_TOKEN_البوت}"
CHAT_ID="${CHAT_ID:-ضع_هنا_CHAT_ID}"
GEMINI_API_KEY="${GEMINI_API_KEY:-ضع_هنا_API_KEY}"
VERCEL_PROJECT="full-accounting-system-frontend.vercel.app"

mkdir -p "$BACKUP_DIR"

# ======== دالة إرسال إشعار لتليجرام ========
send_telegram() {
  local MESSAGE="$1"
  curl -s -X POST "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" \
       -d "chat_id=$CHAT_ID" \
       -d "parse_mode=Markdown" \
       -d "text=$MESSAGE"
}

send_telegram "🚀 بدء Deploy تلقائي على Vercel..."

# ======== Build و Deploy على Vercel ========
vercel --prod --confirm > $LOG_FILE 2>&1
send_telegram "✅ تم اكتمال عملية Deploy على Vercel."

# ======== التحقق من وجود خطأ ========
ERROR_LINES=$(grep -i "error" $LOG_FILE | tail -n 10)
if [ -z "$ERROR_LINES" ]; then
  send_telegram "✅ لا توجد أخطاء في آخر Build."
  exit 0
fi

send_telegram "❌ تم العثور على خطأ:\n$ERROR_LINES"

# ======== استخراج الملفات المرتبطة بالخطأ ========
grep -oP "(?<=\./src/).*?\.(js|jsx|ts|tsx)" $LOG_FILE | uniq > related_files.txt
if [ ! -s related_files.txt ]; then
  send_telegram "⚠️ لم يتم العثور على ملفات مرتبطة بالخطأ."
  exit 1
fi

# ======== النسخة الاحتياطية الذكية ========
while read file; do
  if [ -f "$PROJECT_DIR/src/$file" ]; then
    cp --parents "$PROJECT_DIR/src/$file" "$BACKUP_DIR/"
  fi
done < related_files.txt
send_telegram "💾 تم أخذ نسخة احتياطية للملفات المرتبطة بالخطأ."

# ======== إنشاء tree للملفات المرتبطة بالخطأ ========
tree -I "node_modules|.git|.vercel|dist|build" "$BACKUP_DIR" > tree_related.txt

# ======== إرسال الأخطاء والملفات إلى Gemini ========
send_telegram "📤 إرسال بيانات الخطأ وملفات المشروع لـ Gemini..."
GEMINI_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $GEMINI_API_KEY" \
  -d "{ \"model\": \"gemini-1.5-pro\", \"messages\": [ {\"role\": \"system\", \"content\": \"صحح فقط الأخطاء في هذه الملفات مع الحفاظ على بقية المشروع سليمة.\"}, {\"role\": \"user\", \"content\": \"خطأ: $ERROR_LINES\n\nهيكل الملفات:\n$(cat tree_related.txt)\"} ] }" \
  https://api.gemini.com/v1/chat/completions)

# ======== حفظ اقتراح Gemini ========
echo "$GEMINI_RESPONSE" > gemini_fix.json
REPLY=$(jq -r '.choices[0].message.content' gemini_fix.json)
send_telegram "💡 اقتراح Gemini:\n$REPLY"

# ======== تطبيق التصحيح تلقائيًا (اختياري لاحقًا) ========
apply_fix() {
  send_telegram "✅ يمكنك تطبيق التعديلات المقترحة يدويًا أو لاحقًا تلقائيًا."
}
apply_fix

send_telegram "🟢 العملية اكتملت. كل المعلومات، الاقتراحات، النسخ الاحتياطية، وtree تظهر في البوت."
