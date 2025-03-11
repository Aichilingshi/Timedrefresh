<!--
作者：刘瑜琦
邮箱：1714105365@qq.com
描述：chrome 定时刷新
-->
// 后台脚本状态
let timer = null;
let remainingSeconds = 0;
let totalSeconds = 0;
let isRunning = false;

// 格式化时间为 MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// 更新倒计时
function updateCountdown() {
    if (!isRunning) return;

    // 更新图标显示
    chrome.action.setBadgeText({ text: formatTime(remainingSeconds) });
    chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });

    if (remainingSeconds > 0) {
        remainingSeconds--;
        timer = setTimeout(updateCountdown, 1000);
    } else {
        // 倒计时结束，刷新页面并重置
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) chrome.tabs.reload(tabs[0].id);
        });
        remainingSeconds = totalSeconds;
        updateCountdown();
    }
}

// 处理消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case "startTimer":
            if (timer) clearTimeout(timer); // 清除旧定时器
            totalSeconds = request.seconds;
            remainingSeconds = totalSeconds;
            isRunning = true;
            updateCountdown(); // 启动新倒计时
            sendResponse({ status: "Timer started" });
            break;

        case "stopTimer":
            if (timer) clearTimeout(timer);
            isRunning = false;
            timer = null;
            chrome.action.setBadgeText({ text: "" }); // 清除图标
            sendResponse({ status: "Timer stopped" });
            break;

        case "getStatus":
            sendResponse({ isRunning }); // 返回当前状态
            break;
    }
    return true; // 保持消息通道开放
});