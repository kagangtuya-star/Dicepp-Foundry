// 全局功能开关
let dicepp_enable = false;
// 定义一个独立的函数来处理掷骰逻辑
async function handleDiceRoll(formula, username) {
    // 构造请求数据
    let requestData = {
        type: "message",
        message_type: "group_message",
        group_id: "77777777",
        user_id: "66666666",
        message: formula,
        sender: {
            user_id: "66666666",
            nickname: username
        }
    };

    try {
        let response = await fetch('https://aivu-api.aivu.top', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        let data = await response.json();
        let result = data.reply.replace(/\n/g, "<br>");

        ChatMessage.create({
            content: result,
            speaker: { alias: "爱乌" }
        });

    } catch (error) {
        console.error('Error:', error);
    }
}
Hooks.once('ready', async function () {
    dicepp_enable = true;
});
// 注册监听聊天信息的 Hook
Hooks.on("renderChatMessage", async (message, html, data) => {
    // console.log(message.content);
    // 如果功能未开启，直接返回
    if (!dicepp_enable) return;
    let speakername = message.speaker.alias;
    let username = speakername ? speakername : game.user.name;

    // 如果消息内容以 "。" 或 “.” 开头，视为掷骰指令
    if (message.content.startsWith("。") || message.content.startsWith(".")) {
        let formula = message.content.trim();
        await handleDiceRoll(formula, username);
    }
});
