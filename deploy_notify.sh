#!/bin/bash

# =============================================
# سكريبت ذكي: Deploy Backend + Frontend مع إشعارات Telegram لحظية
# =============================================

# التأكد من تثبيت jq
if ! command -v jq &> /dev/null
then
    echo "Installing jq..."
    sudo apt-get update && sudo apt-get install -y jq
fi

send_message() {
    local text="$1"
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d chat_id="${TELEGRAM_CHAT_ID}" \
        -d parse_mode="Markdown" \
        -d text="$text" >/dev/null
}

# =============================================
# نشر Backend
# =============================================
SERVICE_NAME="Backend"
send_message "🚀 *${SERVICE_NAME} deployment started*"

deploy_response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Authorization: Bearer ${RENDER_API_KEY}" \
    -H "Accept: application/json" \
    "https://api.render.com/v1/services/${RENDER_BACKEND_SERVICE_ID}/deploys")

http_code=$(echo "$deploy_response" | tail -n1)
body=$(echo "$deploy_response" | sed '$d')

if [ "$http_code" -ne 201 ]; then
    send_message "❌ *${SERVICE_NAME} deploy failed to trigger*.\nCheck API Key/Service ID.\n$body"
    exit 1
fi

deploy_id=$(echo "$body" | jq -r '.id')
send_message "• Deploy ID: $deploy_id"

final_status="unknown"
for i in {1..60}; do
    poll_response=$(curl -s -H "Authorization: Bearer ${RENDER_API_KEY}" \
        "https://api.render.com/v1/services/${RENDER_BACKEND_SERVICE_ID}/deploys/$deploy_id")
    status=$(echo "$poll_response" | jq -r '.status')
    send_message "• [$SERVICE_NAME] Build status: $status"
    if [[ "$status" == "live" || "$status" == "build_failed" || "$status" == "deploy_failed" || "$status" == "canceled" ]]; then
        final_status=$status
        break
    fi
    sleep 10
done

if [ "$final_status" == "live" ]; then
    send_message "✅ *${SERVICE_NAME} deploy succeeded*"
else
    send_message "❌ *${SERVICE_NAME} deploy failed* with status: $final_status\nDetails: $poll_response"
    exit 1
fi

# =============================================
# نشر Frontend
# =============================================
SERVICE_NAME="Frontend"
send_message "🚀 *${SERVICE_NAME} deployment started*"

deploy_response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Authorization: Bearer ${RENDER_API_KEY}" \
    -H "Accept: application/json" \
    "https://api.render.com/v1/services/${RENDER_FRONTEND_SERVICE_ID}/deploys")

http_code=$(echo "$deploy_response" | tail -n1)
body=$(echo "$deploy_response" | sed '$d')

if [ "$http_code" -ne 201 ]; then
    send_message "❌ *${SERVICE_NAME} deploy failed to trigger*.\nCheck API Key/Service ID.\n$body"
    exit 1
fi

deploy_id=$(echo "$body" | jq -r '.id')
send_message "• Deploy ID: $deploy_id"

final_status="unknown"
for i in {1..60}; do
    poll_response=$(curl -s -H "Authorization: Bearer ${RENDER_API_KEY}" \
        "https://api.render.com/v1/services/${RENDER_FRONTEND_SERVICE_ID}/deploys/$deploy_id")
    status=$(echo "$poll_response" | jq -r '.status')
    send_message "• [$SERVICE_NAME] Build status: $status"
    if [[ "$status" == "live" || "$status" == "build_failed" || "$status" == "deploy_failed" || "$status" == "canceled" ]]; then
        final_status=$status
        break
    fi
    sleep 10
done

if [ "$final_status" == "live" ]; then
    send_message "✅ *${SERVICE_NAME} deploy succeeded*"
else
    send_message "❌ *${SERVICE_NAME} deploy failed* with status: $final_status\nDetails: $poll_response"
    exit 1
fi

send_message "🎉 All Deployments Completed!"
