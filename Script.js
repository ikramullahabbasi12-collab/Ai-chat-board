document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chatForm");
    const promptInput = document.getElementById("prompt");
    const messagesContainer = document.getElementById("messages");
    const sendButton = document.getElementById("sendButton");
    const newChatButton = document.getElementById("newChat");
    const clearButton = document.getElementById("clearButton");
    const historyContainer = document.getElementById("history");
    const welcomeScreen = document.getElementById("welcome");
    const errorNote = document.getElementById("errorNote");

    let conversations = [];
    let currentConversationId = null;
    let isWaiting = false;
    let requestController = null;

    function createConversation() {
        if (requestController) {
            requestController.abort();
            requestController = null;
        }

        isWaiting = false;
        sendButton.disabled = false;

        const conversation = {
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            title: "New conversation",
            messages: []
        };

        conversations.unshift(conversation);
        currentConversationId = conversation.id;

        renderHistory();
        renderMessages();
        hideError();
        promptInput.focus();
    }

    function getCurrentConversation() {
        return conversations.find(
            conversation => conversation.id === currentConversationId
        );
    }

    function renderHistory() {
        if (!historyContainer) return;

        historyContainer.replaceChildren();

        conversations.forEach(conversation => {
            const button = document.createElement("button");
            button.className =
                "history-item" +
                (conversation.id === currentConversationId ? " active" : "");

            const title = document.createElement("span");
            title.textContent = conversation.title;

            button.appendChild(title);

            button.addEventListener("click", () => {
                if (isWaiting) return;

                currentConversationId = conversation.id;
                renderHistory();
                renderMessages();
                hideError();
            });

            historyContainer.appendChild(button);
        });
    }

    function renderMessages() {
        const conversation = getCurrentConversation();

        messagesContainer.replaceChildren();

        if (welcomeScreen) {
            welcomeScreen.classList.toggle(
                "hidden",
                Boolean(conversation && conversation.messages.length)
            );

            if (!welcomeScreen.classList.contains("hidden")) {
                welcomeScreen.style.display = "block";
            } else {
                welcomeScreen.style.display = "none";
            }
        }

        if (!conversation) return;

        conversation.messages.forEach(message => {
            addMessageElement(message.role, message.content);
        });

        scrollToBottom();
    }

    function addMessageElement(role, content, typing = false) {
        const message = document.createElement("article");
        message.className = "message " + role;

        const avatar = document.createElement("div");
        avatar.className = "message-avatar";
        avatar.textContent = role === "user" ? "U" : "✦";

        const body = document.createElement("div");
        body.className = "message-body";

        const name = document.createElement("div");
        name.className = "message-name";
        name.textContent = role === "user" ? "You" : "Nova AI";

        const text = document.createElement("div");
        text.className = "message-text";

        if (typing) {
            text.textContent = "Nova AI is thinking...";
            text.classList.add("typing");
        } else {
            text.textContent = content;
        }

        body.append(name, text);
        message.append(avatar, body);
        messagesContainer.appendChild(message);

        return message;
    }

    function scrollToBottom() {
        requestAnimationFrame(() => {
            const chat = document.getElementById("chat");

            if (chat) {
                chat.scrollTop = chat.scrollHeight;
            }
        });
    }

    function showError(message) {
        if (!errorNote) return;

        errorNote.textContent = message;
        errorNote.classList.remove("hidden");
    }

    function hideError() {
        if (!errorNote) return;

        errorNote.textContent = "";
        errorNote.classList.add("hidden");
    }

    function getDummyAIResponse(userMessage) {
        const message = userMessage.toLowerCase().trim();

        if (/^(hi|hello|hey|salam|assalamualaikum)\b/.test(message)) {
            return "Hello! Welcome to Nova AI. How can I help you today?";
        }

        if (message.includes("your name") || message.includes("who are you")) {
            return "I am Nova AI, your virtual assistant. I can help with writing, coding, learning, brainstorming, and more.";
        }

        if (message.includes("how are you")) {
            return "I'm doing great! I'm ready to help you. What would you like to work on today?";
        }

        if (message.includes("story")) {
            return "Here is an original story idea:\n\nA young inventor discovers a mysterious device that can reveal forgotten memories. One night, it reveals a secret that could change his entire village. He must decide whether to reveal the truth or protect the people he loves.\n\nWould you like me to turn this idea into a complete story?";
        }

        if (
            message.includes("youtube") ||
            message.includes("shorts") ||
            message.includes("video")
        ) {
            return "Here are three creative video ideas:\n\n1. A mysterious visitor arrives in a quiet village.\n2. A funny robot tries to live like a human.\n3. Two rivals discover they have a surprising connection.\n\nStart with a strong hook, keep the story engaging, and end with a memorable moment.";
        }

        if (
            message.includes("html") ||
            message.includes("javascript") ||
            message.includes("coding") ||
            message.includes("code") ||
            message.includes("programming")
        ) {
            return "I can help you learn programming and build websites, applications, and chatbot interfaces.\n\nThis version uses a dummy response system. Connect a real AI model through a secure backend to generate answers dynamically.";
        }

        if (
            message.includes("business") ||
            message.includes("money") ||
            message.includes("earning")
        ) {
            return "A good starting point is to identify a useful service, understand your audience, and test your idea with minimal investment. Create a simple plan, calculate your costs, and avoid promises of guaranteed income.\n\nTell me more about your goal so I can help you plan the next steps.";
        }

        if (
            message.includes("thank you") ||
            message.includes("thanks")
        ) {
            return "You're welcome! I'm happy to help. Feel free to ask me anything else.";
        }

        if (
            message.includes("help") ||
            message.includes("what can you do")
        ) {
            return "I can assist you with:\n\n• Writing and storytelling\n• Programming and debugging\n• Education and explanations\n• Content creation ideas\n• Planning and brainstorming\n• General questions\n\nPlease note that this is a demonstration chatbot. Its responses are predefined rather than generated by a real AI model.";
        }

        return "Thank you for your question!\n\nI'm Nova AI, a chatbot demonstration. I received your message:\n\n\"" +
            userMessage +
            "\"\n\nMy current responses are predefined. To answer a wider range of questions intelligently, connect this interface to a real AI model through a secure backend.";
    }

    async function getAIResponse(userMessage, signal) {
        // Replace this dummy response with a request to your backend when ready.
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(resolve, 700);

            signal.addEventListener("abort", () => {
                clearTimeout(timeout);
                reject(new DOMException("Request cancelled", "AbortError"));
            }, { once: true });
        });

        if (signal.aborted) {
            throw new DOMException("Request cancelled", "AbortError");
        }

        return getDummyAIResponse(userMessage);
    }

    async function sendMessage(text) {
        const userMessage = text.trim();

        if (!userMessage || isWaiting) return;

        let conversation = getCurrentConversation();

        if (!conversation) {
            createConversation();
            conversation = getCurrentConversation();
        }

        hideError();

        conversation.messages.push({
            role: "user",
            content: userMessage
        });

        if (conversation.messages.length === 1) {
            conversation.title =
                userMessage.length > 30
                    ? userMessage.slice(0, 30) + "..."
                    : userMessage;
        }

        promptInput.value = "";
        resizeInput();

        isWaiting = true;
        sendButton.disabled = true;

        renderHistory();
        renderMessages();

        const typingMessage = addMessageElement("assistant", "", true);
        scrollToBottom();

        const controller = new AbortController();
        requestController = controller;

        try {
            const response = await getAIResponse(
                userMessage,
                controller.signal
            );

            if (requestController !== controller) return;

            typingMessage.remove();

            conversation.messages.push({
                role: "assistant",
                content: response
            });

            addMessageElement("assistant", response);
            renderHistory();
            scrollToBottom();

        } catch (error) {
            typingMessage.remove();

            if (error.name !== "AbortError") {
                showError("Something went wrong. Please try again.");
            }

        } finally {
            if (requestController === controller) {
                requestController = null;
                isWaiting = false;
                sendButton.disabled = false;
                promptInput.focus();
            }
        }
    }

    function resizeInput() {
        promptInput.style.height = "auto";
        promptInput.style.height =
            Math.min(promptInput.scrollHeight, 180) + "px";
    }

    chatForm.addEventListener("submit", event => {
        event.preventDefault();
        sendMessage(promptInput.value);
    });

    promptInput.addEventListener("input", resizeInput);

    promptInput.addEventListener("keydown", event => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            chatForm.requestSubmit();
        }
    });

    if (newChatButton) {
        newChatButton.addEventListener("click", createConversation);
    }

    if (clearButton) {
        clearButton.addEventListener("click", () => {
            if (isWaiting) return;

            const conversation = getCurrentConversation();

            if (!conversation) return;

            conversation.messages = [];
            conversation.title = "New conversation";

            renderHistory();
            renderMessages();
            hideError();
        });
    }

    document.querySelectorAll(".suggestion").forEach(button => {
        button.addEventListener("click", () => {
            sendMessage(button.dataset.prompt || button.textContent.trim());
        });
    });

    createConversation();
});
  
