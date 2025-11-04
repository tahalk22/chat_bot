// 🪄 اختفاء شاشة التحميل بعد تحميل DOM
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.add("hidden");
    setTimeout(() => loader.remove(), 500);
  }
});


// تأكيد أن الجسم ثابت بعد أي Refresh
window.addEventListener('load', () => {
  document.body.style.height = '100vh';
  document.body.style.overflow = 'hidden';
});



// العناصر الأساسية
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const voiceBtn = document.getElementById("voice-btn");

const downloadBtn = document.getElementById("download-btn");

// Webhook
const N8N_WEBHOOK_URL = "https://taha343434.app.n8n.cloud/webhook/02476456-f675-459b-83b1-4e952e7bee39";

// تحميل الدردشة من localStorage
const savedChat = JSON.parse(localStorage.getItem("chatHistory")) || [];
savedChat.forEach(msg => appendMessage(msg.text, msg.sender));
chatBox.scrollTop = chatBox.scrollHeight;

// حفظ الدردشة
function saveChat() {
  const messages = Array.from(chatBox.querySelectorAll("div > div")).map(msg => ({
    text: msg.innerText,
    sender: msg.classList.contains("bg-[#5e2821]") ? "user" : "bot"
  }));
  localStorage.setItem("chatHistory", JSON.stringify(messages));
}

// إضافة رسالة
function appendMessage(text, sender, isTyping = false) {
  const wrapper = document.createElement("div");
  wrapper.className = sender === "user" ? "flex justify-end" : "flex justify-start";

  const message = document.createElement("div");
  message.className =
    (sender === "user" ? "bg-[#5e2821] text-white" : "bg-[#5e2821] text-white") +
    " p-3 rounded-lg max-w-xs md:max-w-md text-right fade-in";

  message.innerText = text;

  if (isTyping) message.classList.add("typing", "animate-pulse");

  wrapper.appendChild(message);
  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (!isTyping) saveChat();
}

// مسح الدردشة
function clearChat() {
  chatBox.innerHTML = "";
  localStorage.removeItem("chatHistory");
}
chatForm.addEventListener("submit", async e => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  // عرض رسالة المستخدم وتشغيل صوت الإرسال
  appendMessage(message, "user");
  playSound("send"); // 🔊 صوت الإرسال
  userInput.value = "";

  // عرض مؤشر الكتابة من البوت
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

    // عرض رسالة البوت وتشغيل صوت الاستقبال
    appendMessage(data.output || "تم الاستلام، جاري المعالجة...", "bot");
    playSound("receive"); // 🔊 صوت الاستقبال

  } catch (error) {
    const typingIndicator = chatBox.querySelector(".typing");
    if (typingIndicator) typingIndicator.parentElement.remove();
    appendMessage("حدث خطأ أثناء الاتصال بالخادم.", "bot");
    console.error(error);
  }
});

// إدخال صوتي
let recognition;
voiceBtn.addEventListener("click", () => {
  if (!("webkitSpeechRecognition" in window)) return alert("المتصفح لا يدعم التعرف على الصوت.");
  recognition = new webkitSpeechRecognition();
  recognition.lang = "ar-SA"; recognition.continuous = false; recognition.interimResults = false;
  recognition.onresult = e => userInput.value = e.results[0][0].transcript;
  recognition.onerror = e => console.error("خطأ في التعرف على الصوت:", e.error);
  recognition.start();
});

// تطبيق الوضع المحفوظ من localStorage عند فتح الصفحة
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
}
// زر تبديل الوضع
const modeToggle = document.getElementById('mode-toggle');
modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  // تغيير لون الشريط العلوي تلقائيًا
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (document.body.classList.contains('dark')) {
    metaThemeColor.setAttribute('content', '#111111');
  } else {
    metaThemeColor.setAttribute('content', '#7f1d1d');
  }
});

// تنزيل المحادثة
if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    const text = chatBox.innerText;
  const blob = new Blob(["\uFEFF" + text], { type: "text/plain;charset=utf-8" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "TheCastle_Chat.txt";
    a.click();
  });
}
// أصوات الدردشة
const sendSound = new Audio("mixkit-select-click-1109.wav"); // صوت الإرسال
const receiveSound = new Audio("mixkit-message-pop-alert-2354.mp3"); // صوت الاستقبال

// دالة لتشغيل الصوت حسب نوع الحدث
function playSound(type) {
  if (type === "send") sendSound.play().catch(() => {});
  else if (type === "receive") receiveSound.play().catch(() => {});
}


// تسجيل Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}



  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  menuToggle.addEventListener("click", () => {
    if(menu.classList.contains("hidden")) {
      menu.classList.remove("hidden");
      setTimeout(() => {
        menu.classList.remove("opacity-0", "scale-95");
      }, 10); // يعطي الوقت لتفعيل التحول
    } else {
      menu.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        menu.classList.add("hidden");
      }, 200); // مدة التحول
    }
  });


  
