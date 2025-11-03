const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const voiceBtn = document.getElementById("voice-btn");

// رابط Webhook الخاص بـ n8n
const N8N_WEBHOOK_URL = "https://taha343434.app.n8n.cloud/webhook/02476456-f675-459b-83b1-4e952e7bee39";

// 🧠 تحميل الدردشة من localStorage عند فتح الصفحة
window.addEventListener("DOMContentLoaded", () => {
  const savedChat = JSON.parse(localStorage.getItem("chatHistory")) || [];
  savedChat.forEach(msg => appendMessage(msg.text, msg.sender));
  chatBox.scrollTop = chatBox.scrollHeight; // تمرير للأسفل بعد التحميل
});

// 🧩 دالة لحفظ الدردشة
function saveChat() {
  const messages = Array.from(chatBox.querySelectorAll("div > div")).map(msg => ({
    text: msg.innerText,
    sender: msg.classList.contains("bg-[#5e2821]") ? "user" : "bot"
  }));
  localStorage.setItem("chatHistory", JSON.stringify(messages));
}

// دالة لإضافة الرسائل إلى واجهة الدردشة
function appendMessage(text, sender, isTyping = false) {
  const wrapper = document.createElement("div");
  wrapper.className = sender === "user" ? "flex justify-end" : "flex justify-start";

  const message = document.createElement("div");
  message.className =
    (sender === "user"
      ? "bg-[#5e2821] text-white"
      : "bg-[#5e2821] text-white") +
    " p-3 rounded-lg max-w-xs md:max-w-md text-right fade-in";

  message.innerText = text;

  if (isTyping) {
    message.classList.add("typing");
    message.classList.add("animate-pulse");
  }

  wrapper.appendChild(message);
  chatBox.appendChild(wrapper);

  // تمرير تلقائي للأسفل
  chatBox.scrollTop = chatBox.scrollHeight;

  // حفظ بعد كل رسالة (عدا المؤشر)
  if (!isTyping) saveChat();
}

// دالة لمسح الدردشة
function clearChat() {
  chatBox.innerHTML = "";
  localStorage.removeItem("chatHistory"); // حذف السجل من localStorage
}

// إرسال الرسالة عند الضغط على زر "إرسال"
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(message, "user");
  userInput.value = "";

  // عرض مؤشر "المساعد يكتب..."
  appendMessage("المساعد يكتب...", "bot", true);

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ massegjj: message }),
    });

    const data = await response.json();

    // إزالة مؤشر الكتابة
    const typingIndicator = chatBox.querySelector(".typing");
    if (typingIndicator) typingIndicator.parentElement.remove();

    // عرض الرد الحقيقي
    appendMessage(data.output || "تم الاستلام، جاري المعالجة...", "bot");

    // نطق الرد صوتيًا
    if ("speechSynthesis" in window && data.output) {
      const utterance = new SpeechSynthesisUtterance(data.output);
      utterance.lang = "ar-SA";
      speechSynthesis.speak(utterance);
    }
  } catch (error) {
    const typingIndicator = chatBox.querySelector(".typing");
    if (typingIndicator) typingIndicator.parentElement.remove();

    appendMessage("حدث خطأ أثناء الاتصال بالخادم.", "bot");
    console.error(error);
  }
});

// 🎤 دعم الإدخال الصوتي
let recognition;
voiceBtn.addEventListener("click", () => {
  if (!("webkitSpeechRecognition" in window)) {
    alert("المتصفح لا يدعم التعرف على الصوت.");
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.lang = "ar-SA";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
  };

  recognition.onerror = (event) => {
    console.error("خطأ في التعرف على الصوت:", event.error);
  };

  recognition.start();
});
