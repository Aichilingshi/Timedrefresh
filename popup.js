<!--
作者：刘瑜琦
邮箱：1714105365@qq.com
描述：chrome 定时刷新
-->
// 页面加载时获取后台状态
document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
        const { isRunning } = response;
        document.getElementById("start").disabled = isRunning;
        document.getElementById("stop").disabled = !isRunning;
    });
});

// 开始按钮
document.getElementById("start").addEventListener("click", () => {
    const minutes = parseInt(document.getElementById("minutes").value) || 0;
    const seconds = parseInt(document.getElementById("seconds").value) || 0;
    const totalSeconds = minutes * 60 + seconds;

    if (totalSeconds < 1) return alert("时间必须大于0");

    chrome.runtime.sendMessage(
        { action: "startTimer", seconds: totalSeconds },
        (response) => {
            if (response.status === "Timer started") {
                document.getElementById("start").disabled = true;
                document.getElementById("stop").disabled = false;
            }
        }
    );
});

// 停止按钮
document.getElementById("stop").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "stopTimer" }, (response) => {
        if (response.status === "Timer stopped") {
            document.getElementById("start").disabled = false;
            document.getElementById("stop").disabled = true;
        }
    });
});