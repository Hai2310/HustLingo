/* HustLingo clickable prototype. All content and actions below are local demo data. */
const TOPICS = [
  {
    id: "family", title: "Gia đình & con người", icon: "👨‍👩‍👧", color: "peach", level: "Cơ bản", description: "Gọi tên người thân và giới thiệu những người quanh bạn.", objective: "Giới thiệu gia đình bằng những câu tiếng Anh ngắn.",
    words: [
      { word: "mother", ipa: "/ˈmʌðər/", meaning: "mẹ", example: "My mother is kind.", emoji: "👩" },
      { word: "father", ipa: "/ˈfɑːðər/", meaning: "bố", example: "My father is at home.", emoji: "👨" },
      { word: "sister", ipa: "/ˈsɪstər/", meaning: "chị/em gái", example: "My sister is ten.", emoji: "👧" },
      { word: "brother", ipa: "/ˈbrʌðər/", meaning: "anh/em trai", example: "My brother can swim.", emoji: "👦" },
    ],
  },
  {
    id: "home", title: "Nhà ở & đồ vật", icon: "🏠", color: "mint", level: "Cơ bản", description: "Nói về căn phòng, đồ vật và vị trí của chúng.", objective: "Mô tả căn phòng và đồ vật quen thuộc.",
    words: [
      { word: "house", ipa: "/haʊs/", meaning: "ngôi nhà", example: "This is my house.", emoji: "🏠" },
      { word: "table", ipa: "/ˈteɪbəl/", meaning: "cái bàn", example: "The book is on the table.", emoji: "🪑" },
      { word: "kitchen", ipa: "/ˈkɪtʃən/", meaning: "nhà bếp", example: "I am in the kitchen.", emoji: "🍳" },
      { word: "door", ipa: "/dɔːr/", meaning: "cánh cửa", example: "Please open the door.", emoji: "🚪" },
    ],
  },
  {
    id: "food", title: "Đồ ăn & đồ uống", icon: "🍜", color: "blue", level: "Cơ bản", description: "Học cách gọi tên món ăn và nói về sở thích.", objective: "Gọi tên món ăn quen thuộc và nói mình thích gì.",
    words: [
      { word: "rice", ipa: "/raɪs/", meaning: "cơm", example: "I eat rice for lunch.", emoji: "🍚" },
      { word: "water", ipa: "/ˈwɔːtər/", meaning: "nước", example: "I drink water every day.", emoji: "💧" },
      { word: "bread", ipa: "/bred/", meaning: "bánh mì", example: "This bread is fresh.", emoji: "🍞" },
      { word: "apple", ipa: "/ˈæpəl/", meaning: "quả táo", example: "I like apples.", emoji: "🍎" },
    ],
  },
  {
    id: "routine", title: "Hoạt động hằng ngày", icon: "☀️", color: "lavender", level: "Cơ bản", description: "Kể về một ngày bình thường của bạn.", objective: "Kể ngắn gọn lịch sinh hoạt hằng ngày.",
    words: [
      { word: "study", ipa: "/ˈstʌdi/", meaning: "học", example: "I study English at night.", emoji: "📚" },
      { word: "sleep", ipa: "/sliːp/", meaning: "ngủ", example: "I sleep at ten.", emoji: "😴" },
      { word: "morning", ipa: "/ˈmɔːrnɪŋ/", meaning: "buổi sáng", example: "I run in the morning.", emoji: "🌅" },
      { word: "evening", ipa: "/ˈiːvnɪŋ/", meaning: "buổi tối", example: "We eat in the evening.", emoji: "🌙" },
    ],
  },
];

const DEFAULT_USERS = [
  { id: "u1", name: "Nguyễn Minh Anh", email: "admin@hustlingo.demo", role: "admin", status: "active" },
  { id: "u2", name: "Trần Gia Huy", email: "huy@example.demo", role: "learner", status: "active" },
  { id: "u3", name: "Lê Hà Lan", email: "lan@example.demo", role: "learner", status: "active" },
  { id: "u4", name: "Phạm Quang", email: "quang@example.demo", role: "learner", status: "disabled" },
];

const STORAGE_KEY = "hustlingo-prototype-v1";
const initial = {
  role: "learner", flashIndex: 0, flipped: false, quizIndex: 0, selected: null,
  answers: [], lastTopic: "food", completedTopics: [], reviewWords: ["mother", "rice", "table"],
  speechResult: false, writingFeedback: null, reviewDone: false,
  draft: null, users: DEFAULT_USERS, quizSearch: "", userSearch: "",
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && typeof saved === "object") return { ...initial, ...saved, selected: null };
  } catch (_) { /* file:// may not allow storage */ }
  return structuredClone(initial);
}
let state = loadState();
let toastTimer;

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* demo still works */ }
}
function esc(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
function topicById(id) { return TOPICS.find(topic => topic.id === id) || TOPICS[2]; }
function route() {
  const parts = (location.hash || "#learner/home").slice(1).split("/");
  const role = parts[0] === "admin" ? "admin" : "learner";
  return { role, page: parts[1] || (role === "admin" ? "overview" : "home"), topicId: parts[2] || state.lastTopic };
}
function go(page, topicId) {
  const hash = `#${state.role}/${page}${topicId ? `/${topicId}` : ""}`;
  if (location.hash === hash) render(); else location.hash = hash;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function toast(message) {
  const node = document.getElementById("toast");
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove("show"), 3600);
}
function navLink(page, label, symbol, active, topicId) {
  return `<button class="nav-link ${active ? "active" : ""}" data-action="go" data-page="${page}" ${topicId ? `data-topic="${topicId}"` : ""}><span class="nav-icon" aria-hidden="true">${symbol}</span>${label}</button>`;
}
function sidebar(current) {
  const learner = state.role === "learner";
  return `<aside class="sidebar">
    <div class="brand"><span class="brand-mark">✦</span> HustLingo</div>
    <div class="nav-group-label">${learner ? "Không gian học" : "Quản trị"}</div>
    ${learner ? `
      ${navLink("home", "Tổng quan", "⌂", current === "home")}
      ${navLink("topics", "Chủ đề học", "▦", ["topics", "lesson", "flashcards", "quiz", "result", "speaking", "writing"].includes(current))}
      ${navLink("review", "Ôn tập", "↻", current === "review")}
      ${navLink("progress", "Tiến độ", "▥", current === "progress")}
    ` : `
      ${navLink("overview", "Tổng quan", "▦", current === "overview")}
      ${navLink("content", "Nội dung học", "▤", ["content", "editor", "quiz-builder"].includes(current))}
      ${navLink("users", "Người dùng", "♙", current === "users")}
    `}
    <div class="sidebar-bottom">
      <div class="helper-card"><div class="small-icon">${learner ? "💡" : "✦"}</div><strong>${learner ? "Mỗi ngày một chút" : "Kiểm duyệt trước khi xuất bản"}</strong><p>${learner ? "10 phút học đều đặn sẽ giúp bạn ghi nhớ tự nhiên hơn." : "Bản nháp chỉ xuất hiện với admin. Mọi thay đổi trong prototype được lưu cục bộ."}</p></div>
      <div class="profile-mini"><div class="avatar ${learner ? "" : "admin"}">${learner ? "H" : "A"}</div><div><b>${learner ? "Gia Huy" : "Minh Anh"}</b><span>${learner ? "Learner demo" : "Admin demo"}</span></div></div>
    </div>
  </aside>`;
}
function mobileNav(page) {
  const items = state.role === "learner"
    ? [["home", "⌂", "Trang chủ"], ["topics", "▦", "Chủ đề"], ["review", "↻", "Ôn tập"], ["progress", "▥", "Tiến độ"]]
    : [["overview", "▦", "Tổng quan"], ["content", "▤", "Nội dung"], ["users", "♙", "Tài khoản"]];
  return `<nav class="mobile-nav" aria-label="Điều hướng chính">${items.map(([target, icon, label]) => `<button class="${target === page ? "active" : ""}" data-action="go" data-page="${target}"><span aria-hidden="true">${icon}</span>${label}</button>`).join("")}</nav>`;
}
function layout(content, page, crumb) {
  const roleLabel = state.role === "learner" ? "Learner" : "Admin";
  return `<div class="app-shell">${sidebar(page)}<main class="main">
    <header class="topbar"><div class="breadcrumb">HustLingo / ${roleLabel} / <strong>${esc(crumb)}</strong></div><div class="top-spacer"></div><span class="demo-chip">✦ PROTOTYPE • DỮ LIỆU MẪU</span><button class="role-switch" data-action="switch-role">⇄ Đổi sang ${state.role === "learner" ? "Admin" : "Learner"}</button></header>
    <div class="content">${content}</div></main>${mobileNav(page)}</div>`;
}
function heading(eyebrow, title, desc, action = "") {
  return `<div class="page-heading"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p class="subtle">${desc}</p></div>${action}</div>`;
}
function topicCard(topic) {
  const done = state.completedTopics.includes(topic.id);
  return `<article class="card topic-card">
    <div class="row space-between"><div class="topic-icon ${topic.color}" aria-hidden="true">${topic.icon}</div><span class="pill ${done ? "green" : "purple"}">${done ? "Đã học" : "A0 – A1"}</span></div>
    <div><h3>${esc(topic.title)}</h3><p>${esc(topic.description)}</p></div>
    <div class="topic-foot"><span>25 từ dự kiến · 4 từ mẫu</span><button class="text-button" data-action="go" data-page="lesson" data-topic="${topic.id}">Khám phá →</button></div>
  </article>`;
}
function learnerHome() {
  const recent = topicById(state.lastTopic);
  return layout(`${heading("Hôm nay học gì?", "Chào Gia Huy 👋", "Sẵn sàng thêm một vài từ tiếng Anh vào ngày hôm nay?")}
    <div class="dashboard-grid">
      <section class="hero"><div class="hero-copy"><span class="eyebrow">✦ HỌC THEO CHỦ ĐỀ</span><h1>Học ít một.<br>Nhớ lâu hơn.</h1><p>Thẻ từ, câu hỏi và luyện tập ngắn giúp bạn dùng từ ngay sau khi học.</p><button class="btn" data-action="go" data-page="lesson" data-topic="${recent.id}">Tiếp tục chủ đề ${esc(recent.title)} →</button></div><div class="hero-art" aria-hidden="true"><div class="book">📚</div><span class="spark one">✦</span><span class="spark two">✧</span></div></section>
      <aside class="card daily-card"><div class="row space-between"><span class="label">Mục tiêu hôm nay</span><span style="font-size:22px">🎯</span></div><div class="day-number">10 <span style="font-size:15px;font-weight:700;color:var(--muted)">phút</span></div><p class="tiny">Một phiên học ngắn để duy trì thói quen.</p><div class="progress-track"><span style="width:45%"></span></div><p class="tiny mt-8">Bạn đã đi được 45% mục tiêu mẫu</p><button class="btn soft" data-action="go" data-page="review">Ôn lại từ đã học →</button></aside>
    </div>
    <div class="stats"><div class="card stat"><span class="stat-icon lavender">📖</span><div><b>${state.completedTopics.length}</b><span>Chủ đề đã học thử</span></div></div><div class="card stat"><span class="stat-icon mint">✦</span><div><b>${state.completedTopics.length * 4}</b><span>Từ đã xem trong demo</span></div></div><div class="card stat"><span class="stat-icon peach">↻</span><div><b>${state.reviewWords.length}</b><span>Từ trong hàng ôn mẫu</span></div></div></div>
    <div class="section-head"><h2>Khám phá chủ đề</h2><button class="text-button" data-action="go" data-page="topics">Xem tất cả →</button></div><div class="grid four">${TOPICS.map(topicCard).join("")}</div>`, "home", "Tổng quan");
}
function topicsPage() {
  return layout(`${heading("Tủ từ vựng", "Chọn một chủ đề", "Mỗi chủ đề trong MVP sẽ có 25 từ. Prototype hiển thị 4 từ mẫu để thử luồng.")}
    <div class="grid two">${TOPICS.map(topicCard).join("")}</div>
    <div class="callout mt-24"><span>ℹ️</span><div><b>Dữ liệu mẫu.</b> Kết quả học trong prototype chỉ lưu trên trình duyệt này; chưa đồng bộ với Supabase.</div></div>`, "topics", "Chủ đề học");
}
function lessonPage(topic) {
  return layout(`${heading("Bài học · " + esc(topic.title), esc(topic.title), "Một vòng học ngắn: tìm hiểu, xem thẻ, tự kiểm tra và dùng từ.", `<button class="btn secondary" data-action="go" data-page="topics">← Tất cả chủ đề</button>`)}
    <section class="card lesson-hero"><div class="lesson-icon" aria-hidden="true">${topic.icon}</div><div><span class="pill purple">Bài giảng ngắn</span><h2 class="mt-8">Mục tiêu của chủ đề</h2><p class="subtle">${esc(topic.objective)}</p></div></section>
    <div class="section-head"><h2>Lộ trình học</h2><span class="tiny">4 từ mẫu · quiz 3 câu mẫu</span></div>
    <div class="lesson-steps">
      <div class="card lesson-step"><span class="step-num">BƯỚC 01</span><div class="step-icon">🎴</div><b>Flashcard</b><p>Nhìn từ, nghe mẫu và lật thẻ xem nghĩa.</p></div>
      <div class="card lesson-step"><span class="step-num">BƯỚC 02</span><div class="step-icon">🧩</div><b>Quiz</b><p>Chọn đáp án, gồm câu hỏi hình ảnh khi phù hợp.</p></div>
      <div class="card lesson-step"><span class="step-num">BƯỚC 03</span><div class="step-icon">🎙️</div><b>Luyện nói</b><p>Xem phản hồi nhận dạng lời nói mô phỏng.</p></div>
      <div class="card lesson-step"><span class="step-num">BƯỚC 04</span><div class="step-icon">✍️</div><b>Đặt câu</b><p>Tập dùng từ trong một câu của riêng bạn.</p></div>
    </div>
    <div class="row wrap mt-24"><button class="btn primary" data-action="start-flash" data-topic="${topic.id}">Bắt đầu với flashcard →</button><button class="btn secondary" data-action="start-quiz" data-topic="${topic.id}">Làm quiz mẫu</button><button class="btn secondary" data-action="go" data-page="speaking" data-topic="${topic.id}">Luyện nói</button><button class="btn secondary" data-action="go" data-page="writing" data-topic="${topic.id}">Đặt câu</button></div>`, "lesson", topic.title);
}
function flashcardsPage(topic) {
  const index = Math.max(0, Math.min(state.flashIndex, topic.words.length - 1));
  const item = topic.words[index];
  return layout(`${heading("Flashcard · " + esc(topic.title), "Nhìn, nghe, ghi nhớ", "Chạm vào thẻ để lật và xem nghĩa.", `<span class="pill purple">Thẻ ${index + 1}/${topic.words.length}</span>`)}
    <div class="center-column"><div class="progress-track" style="margin-bottom:16px"><span style="width:${((index + 1) / topic.words.length) * 100}%"></span></div>
    <div class="card flash-card" data-action="flip" role="button" tabindex="0" aria-label="Lật thẻ từ ${esc(item.word)}">
      <span class="flash-emoji" aria-hidden="true">${item.emoji}</span>
      ${state.flipped ? `<div class="flash-meaning">${esc(item.meaning)}</div><div class="flash-word" style="font-size:35px">${esc(item.word)}</div><div class="flash-example">${esc(item.example)}</div>` : `<div class="flash-word">${esc(item.word)}</div><div class="flash-pronunciation">${esc(item.ipa)}</div>`}
      <span class="flash-hint">${state.flipped ? "CHẠM ĐỂ XEM MẶT TRƯỚC" : "CHẠM ĐỂ XEM NGHĨA VÀ VÍ DỤ"}</span>
    </div>
    <div class="flash-controls"><button class="btn secondary" data-action="flash-prev" ${index === 0 ? "disabled" : ""}>← Thẻ trước</button><button class="btn soft" data-action="speak" data-word="${esc(item.word)}" aria-label="Nghe phát âm ${esc(item.word)}">🔊 Nghe từ</button><button class="btn primary" data-action="flash-next">${index === topic.words.length - 1 ? "Làm quiz →" : "Thẻ tiếp →"}</button></div>
    <p class="tiny right mt-16">Âm thanh dùng TTS của trình duyệt nếu được hỗ trợ.</p></div>`, "flashcards", "Flashcard");
}
function questionsFor(topic) {
  const [one, two, three, four] = topic.words;
  const first = topic.id === "food"
    ? { prompt: "Trong hình là gì?", image: "assets/rice.svg", alt: "Một bát cơm trắng", options: ["rice", "water", "bread"], correct: "rice", explanation: "Rice nghĩa là cơm." }
    : { prompt: `“${one.word}” nghĩa là gì?`, options: [one.meaning, two.meaning, three.meaning], correct: one.meaning, explanation: `${one.word} nghĩa là ${one.meaning}.` };
  return [first,
    { prompt: `Từ tiếng Anh của “${two.meaning}” là gì?`, options: [three.word, two.word, four.word], correct: two.word, explanation: `${two.meaning} là ${two.word}.` },
    { prompt: `“${three.word}” nghĩa là gì?`, options: [four.meaning, three.meaning, one.meaning], correct: three.meaning, explanation: `${three.word} nghĩa là ${three.meaning}.` },
  ];
}
function quizPage(topic) {
  const questions = questionsFor(topic);
  const q = questions[state.quizIndex] || questions[0];
  return layout(`${heading("Quiz · " + esc(topic.title), "Kiểm tra nhanh", "3 câu mẫu để bạn hình dung luồng quiz 10 câu trong MVP.", `<span class="pill purple">Câu ${state.quizIndex + 1}/${questions.length}</span>`)}
    <div class="center-column"><div class="progress-track" style="margin-bottom:16px"><span style="width:${((state.quizIndex + 1) / questions.length) * 100}%"></span></div>
    <section class="card quiz-card">${q.image ? `<img class="quiz-media" src="${q.image}" alt="${esc(q.alt)}" onerror="this.style.display='none';this.nextElementSibling.hidden=false"><p class="callout" hidden>Ảnh chưa tải được. Gợi ý thay thế: “cơm” trong tiếng Anh là gì?</p>` : ""}
      <h2 class="quiz-prompt">${esc(q.prompt)}</h2><div class="option-list">${q.options.map((option, index) => `<button class="option ${state.selected === option ? "selected" : ""}" data-action="select-answer" data-value="${esc(option)}"><span class="option-letter">${"ABC"[index]}</span>${esc(option)}</button>`).join("")}</div>
      <div class="quiz-footer"><span class="tiny">Chọn một đáp án để tiếp tục</span><button class="btn primary" data-action="next-question" ${state.selected === null ? "disabled" : ""}>${state.quizIndex === questions.length - 1 ? "Xem kết quả →" : "Câu tiếp →"}</button></div>
    </section></div>`, "quiz", "Quiz");
}
function resultPage(topic) {
  const questions = questionsFor(topic);
  const score = state.answers.filter((answer, index) => answer === questions[index].correct).length;
  return layout(`<div class="center-column"><div class="card pad right" style="text-align:center;padding:32px"><div class="result-badge">✦</div><span class="eyebrow">HOÀN THÀNH QUIZ MẪU</span><h1 class="result-score">${score}/${questions.length}</h1><p class="subtle">${score === questions.length ? "Xuất sắc! Bạn đã nhớ rất tốt." : "Tốt lắm! Xem lại những từ chưa đúng và thử tiếp nhé."}</p><div class="row wrap" style="justify-content:center;margin-top:22px"><button class="btn primary" data-action="go" data-page="review">Ôn từ cần nhớ →</button><button class="btn secondary" data-action="go" data-page="lesson" data-topic="${topic.id}">Về chủ đề</button></div></div>
    <div class="section-head"><h2>Đáp án của bạn</h2><span class="tiny">Điểm chỉ lưu cục bộ trong prototype</span></div><div class="card pad">${questions.map((q, index) => `<div class="result-answer"><span><b>Câu ${index + 1}.</b> ${esc(q.prompt)}<br><small class="tiny">${esc(q.explanation)}</small></span><span class="pill ${state.answers[index] === q.correct ? "green" : "orange"}">${state.answers[index] === q.correct ? "✓ Đúng" : `✕ ${esc(q.correct)}`}</span></div>`).join("")}</div></div>`, "result", "Kết quả quiz");
}
function speakingPage(topic) {
  const item = topic.words[0];
  return layout(`${heading("Luyện nói · " + esc(topic.title), "Thử nói một từ", "Bản sản phẩm sẽ dùng STT để so nội dung lời nói với từ mẫu.")}
    <div class="center-column"><section class="card practice-panel" style="text-align:center"><span class="pill purple">TỪ MỤC TIÊU</span><div class="practice-word">${esc(item.word)}</div><div class="subtle">${esc(item.ipa)} · ${esc(item.meaning)}</div><button class="text-button mt-16" data-action="speak" data-word="${esc(item.word)}">🔊 Nghe từ mẫu</button>
    <button class="mic-button" data-action="mock-speech" aria-label="Mô phỏng ghi âm">🎙️</button><p class="subtle">Nhấn micro để xem phản hồi mẫu</p>
    ${state.speechResult ? `<div class="feedback-box success" style="text-align:left"><b>✓ Văn bản nhận diện: “${esc(item.word)}”</b><p class="tiny mb-0 mt-8">Khớp với từ mẫu. Đây là kết quả STT mô phỏng, không phải điểm phát âm.</p></div>` : ""}
    </section><div class="callout warn mt-16"><span>ℹ️</span><div>Prototype không truy cập micro và không gửi âm thanh. Bản triển khai thật sẽ cần quyền micro và dịch vụ STT phía máy chủ.</div></div></div>`, "speaking", "Luyện nói");
}
function writingPage(topic) {
  const item = topic.words[0];
  return layout(`${heading("Đặt câu · " + esc(topic.title), "Dùng từ trong câu", `Viết một câu tiếng Anh có từ “${esc(item.word)}”.`)}
    <div class="center-column"><section class="card practice-panel"><div class="row space-between"><span class="pill purple">TỪ MỤC TIÊU</span><button class="text-button" data-action="speak" data-word="${esc(item.word)}">🔊 ${esc(item.word)}</button></div><h2 class="mt-16">${esc(item.word)} <span class="subtle" style="font-size:15px">· ${esc(item.meaning)}</span></h2><p class="tiny">Ví dụ: ${esc(item.example)}</p>
    <label class="field mt-24">Câu của bạn<textarea id="sentence" maxlength="200" placeholder="Viết câu tiếng Anh của bạn ở đây..."></textarea></label><div class="row space-between mt-16"><span class="tiny">5–200 ký tự trong sản phẩm thật</span><button class="btn primary" data-action="mock-feedback" data-word="${esc(item.word)}">Xem nhận xét mẫu →</button></div>
    ${state.writingFeedback ? `<div class="feedback-box ${state.writingFeedback.ok ? "success" : "warn"}"><b>${state.writingFeedback.ok ? "✦ Bạn đã dùng đúng từ mục tiêu" : "Hãy thử dùng từ mục tiêu"}</b><p class="tiny mt-8 mb-0">${esc(state.writingFeedback.message)}</p></div>` : ""}</section><div class="callout warn mt-16"><span>ℹ️</span><div>Nhận xét trên là quy tắc mô phỏng. Prototype chưa gọi AI và không chấm ngữ pháp thực.</div></div></div>`, "writing", "Đặt câu");
}
function reviewPage() {
  const list = state.reviewWords;
  return layout(`${heading("Ôn tập", "Nhớ lại những từ quan trọng", "Trong bản thật, từ sai và từ đến hạn sẽ được máy chủ đưa vào hàng ôn.")}
    <div class="grid two"><div class="card pad"><span class="label">Hàng ôn mẫu</span><h2 class="mt-8">${list.length} từ cần xem lại</h2><p class="tiny">Nhấn “Đã nhớ” để thử thay đổi trạng thái trong trình duyệt.</p>${list.length ? list.map(word => {
      const found = TOPICS.flatMap(topic => topic.words).find(item => item.word === word);
      return `<div class="result-answer"><div><strong>${esc(word)}</strong><small class="tiny">${esc(found?.meaning || "Từ cần ôn")}</small></div><button class="btn soft small" data-action="review-word" data-word="${esc(word)}">✓ Đã nhớ</button></div>`;
    }).join("") : `<div class="empty"><div class="empty-icon">🎉</div>Hàng ôn đã trống. Hãy thử làm quiz để thêm từ mới.</div>`}</div>
    <div class="card pad"><span class="topic-icon lavender" aria-hidden="true">↻</span><h2 class="mt-16">Ôn theo nhịp của bạn</h2><p class="subtle">Bản MVP sẽ hẹn ôn lại sau 1, 3 và 7 ngày tùy kết quả. Prototype chỉ minh họa danh sách và thao tác.</p><button class="btn primary mt-24" data-action="go" data-page="topics">Chọn chủ đề để luyện →</button></div></div>`, "review", "Ôn tập");
}
function progressPage() {
  return layout(`${heading("Tiến độ", "Nhìn lại hành trình", "Các chỉ số dưới đây được tạo từ thao tác thử trong prototype.")}
    <div class="stats" style="margin:0 0 20px"><div class="card stat"><span class="stat-icon lavender">📚</span><div><b>${state.completedTopics.length}/4</b><span>Chủ đề đã làm quiz mẫu</span></div></div><div class="card stat"><span class="stat-icon mint">✦</span><div><b>${state.completedTopics.length * 4}</b><span>Từ đã học thử</span></div></div><div class="card stat"><span class="stat-icon peach">↻</span><div><b>${state.reviewWords.length}</b><span>Từ cần ôn mẫu</span></div></div></div>
    <div class="card pad"><div class="section-head" style="margin:0 0 16px"><h2>Chủ đề của bạn</h2></div>${TOPICS.map(topic => `<div class="result-answer"><span class="row"><span class="topic-icon ${topic.color}" style="width:40px;height:40px;font-size:21px" aria-hidden="true">${topic.icon}</span><span><b>${esc(topic.title)}</b><br><small class="tiny">${state.completedTopics.includes(topic.id) ? "Đã hoàn thành quiz mẫu" : "Chưa làm quiz mẫu"}</small></span></span><button class="btn secondary small" data-action="go" data-page="lesson" data-topic="${topic.id}">Mở bài học</button></div>`).join("")}</div>
    <div class="row wrap mt-24"><button class="btn soft" data-action="go" data-page="review">Xem hàng ôn →</button><button class="btn secondary" data-action="reset-demo">Đặt lại dữ liệu prototype</button></div>`, "progress", "Tiến độ");
}
function adminOverview() {
  const locked = state.users.filter(user => user.status === "disabled").length;
  return layout(`${heading("Bảng điều khiển", "Chào Minh Anh 👋", "Theo dõi nội dung và tài khoản trong không gian quản trị mẫu.")}
    <section class="card admin-hero"><span class="eyebrow" style="color:#cfcfff">✦ KHÔNG GIAN ADMIN</span><h1>Quản lý bài học<br>trong một nơi.</h1><p>Soạn bản nháp, xem trước, phát hành và theo dõi trạng thái tài khoản người học.</p><button class="btn" data-action="go" data-page="content">Đi đến nội dung →</button></section>
    <div class="stats"><div class="card stat"><span class="stat-icon lavender">▤</span><div><b>4</b><span>Chủ đề đã phát hành mẫu</span></div></div><div class="card stat"><span class="stat-icon mint">♙</span><div><b>${state.users.filter(user => user.role === "learner").length}</b><span>Tài khoản learner mẫu</span></div></div><div class="card stat"><span class="stat-icon peach">⦸</span><div><b>${locked}</b><span>Tài khoản bị khóa mẫu</span></div></div></div>
    <div class="section-head"><h2>Việc cần làm</h2></div><div class="grid two"><div class="card pad"><span class="topic-icon blue">📝</span><h3 class="mt-16">Kiểm tra nội dung</h3><p class="subtle">Xem câu hỏi ảnh, chỉnh bài giảng và thử quy trình phát hành.</p><button class="text-button mt-16" data-action="go" data-page="content">Mở quản lý nội dung →</button></div><div class="card pad"><span class="topic-icon peach">👥</span><h3 class="mt-16">Quản lý tài khoản</h3><p class="subtle">Tìm kiếm người dùng và thử khóa/mở tài khoản.</p><button class="text-button mt-16" data-action="go" data-page="users">Mở danh sách người dùng →</button></div></div>
    <div class="callout warn mt-24"><span>ℹ️</span><div>Chế độ admin này là bản mô phỏng giao diện. Nút phân quyền và phát hành chỉ đổi dữ liệu cục bộ; không có tài khoản thật hoặc kiểm tra bảo mật thật.</div></div>`, "overview", "Tổng quan");
}
function adminContent() {
  const draftText = state.draft ? `Có bản nháp v${state.draft.version} đang chỉnh` : "Chưa có bản nháp";
  return layout(`${heading("Quản lý nội dung", "Chủ đề & bài giảng", "Kiểm soát bản nháp và nội dung đã phát hành.", `<button class="btn primary" data-action="edit-topic" data-topic="food">+ Tạo bản nháp mẫu</button>`)}
    <div class="callout mb-0"><span>✦</span><div><b>${esc(draftText)}.</b> Chọn “Sửa bản nháp” để thử chỉnh mục tiêu bài học. Dữ liệu demo lưu trên trình duyệt.</div></div>
    <div class="section-head"><h2>Danh sách chủ đề</h2><span class="pill green">4 đã phát hành</span></div>
    <div class="card table-card"><div class="table-head"><span>Chủ đề</span><span>Phiên bản</span><span>Trạng thái</span><span>Thao tác</span></div>
    ${TOPICS.map(topic => `<div class="table-row"><div class="row"><span class="topic-icon ${topic.color}" style="width:39px;height:39px;font-size:20px" aria-hidden="true">${topic.icon}</span><div><strong>${esc(topic.id === state.draft?.topicId && state.draft?.published ? state.draft.title : topic.title)}</strong><small>25 từ dự kiến · ${topic.words.length} từ mẫu</small></div></div><span>v${topic.id === state.draft?.topicId && state.draft?.published ? state.draft.version : 1}</span><span class="pill green" style="justify-self:start">Đã phát hành</span><button class="btn secondary small" data-action="edit-topic" data-topic="${topic.id}">Sửa bản nháp</button></div>`).join("")}</div>
    <div class="section-head"><h2>Ngân hàng câu hỏi</h2><button class="text-button" data-action="go" data-page="quiz-builder">Xem câu hỏi ảnh →</button></div>
    <div class="grid two"><div class="card pad"><span class="pill purple">Chọn từ theo hình</span><h3 class="mt-16">Ảnh bát cơm → rice</h3><p class="subtle">Mẫu câu đã xuất bản trong chủ đề Đồ ăn & đồ uống.</p><button class="btn soft small mt-16" data-action="go" data-page="quiz-builder">Xem cấu trúc câu hỏi</button></div><div class="card pad"><span class="pill orange">Ví dụ tài sản</span><h3 class="mt-16">Ảnh con hổ → tiger</h3><p class="subtle">Minh họa cách bổ sung câu hỏi hình ảnh cho chủ đề có từ phù hợp.</p><button class="btn soft small mt-16" data-action="go" data-page="quiz-builder">Xem mẫu minh họa</button></div></div>`, "content", "Nội dung học");
}
function adminEditor() {
  const draft = state.draft || { topicId: "food", title: "Đồ ăn & đồ uống", objective: "Gọi tên món ăn quen thuộc và nói mình thích gì.", intro: "Quan sát hình, nghe từ và tập nói về món ăn bạn dùng mỗi ngày.", version: 2, published: false };
  return layout(`${heading("Bản nháp nội dung", "Chỉnh bài giảng", "Một form đơn giản để hình dung luồng admin sửa và phát hành.", `<button class="btn secondary" data-action="go" data-page="content">← Danh sách</button>`)}
    <div class="grid two" style="grid-template-columns:minmax(0,1.35fr) minmax(260px,.65fr)"><section class="card pad"><div class="row space-between"><h2>Bài giảng ngắn</h2><span class="pill orange">Bản nháp v${draft.version}</span></div>
      <label class="field">Tên chủ đề<input type="text" id="draft-title" value="${esc(draft.title)}" maxlength="80"></label>
      <label class="field">Mục tiêu học<input type="text" id="draft-objective" value="${esc(draft.objective)}" maxlength="180"></label>
      <label class="field">Giới thiệu bài giảng<textarea id="draft-intro" maxlength="500">${esc(draft.intro)}</textarea></label>
      <div class="row wrap mt-24"><button class="btn secondary" data-action="save-draft">Lưu bản nháp</button><button class="btn soft" data-action="preview-draft">Xem trước</button><button class="btn primary" data-action="publish-draft">Phát hành bản mẫu →</button></div>
    </section><aside class="card pad"><span class="topic-icon lavender">📋</span><h3 class="mt-16">Kiểm tra trước khi phát hành</h3><p class="subtle">Bản thật sẽ kiểm tra 20–30 từ, ít nhất 40 câu hỏi, đáp án duy nhất, ảnh hợp lệ và quyền tài sản.</p><div class="result-answer"><span>Thông tin bài giảng</span><span class="pill green">✓ Mẫu</span></div><div class="result-answer"><span>Từ vựng mẫu</span><span class="pill orange">4/25</span></div><div class="result-answer"><span>Câu hỏi mẫu</span><span class="pill orange">3/40</span></div><div class="callout warn mt-16"><span>ℹ️</span><div>Nút “Phát hành bản mẫu” chỉ minh họa trạng thái. Dữ liệu này chưa đủ chuẩn để phát hành trong sản phẩm thật.</div></div></aside></div>`, "editor", "Chỉnh nội dung");
}
function adminQuizBuilder() {
  return layout(`${heading("Ngân hàng câu hỏi", "Câu hỏi có hình ảnh", "Admin chọn ảnh, từ mục tiêu, phương án nhiễu và câu thay thế.", `<button class="btn secondary" data-action="go" data-page="content">← Nội dung</button>`)}
    <div class="grid two"><section class="card pad"><span class="pill green">Mẫu thuộc chủ đề Đồ ăn</span><h2 class="mt-16">Xem hình, chọn từ</h2><img src="assets/rice.svg" alt="Một bát cơm trắng" class="quiz-media" style="height:215px;margin:15px 0"><p><strong>Trong hình là gì?</strong></p><div class="option-list"><div class="option selected"><span class="option-letter">A</span>rice <span style="margin-left:auto">✓ đáp án</span></div><div class="option"><span class="option-letter">B</span>water</div><div class="option"><span class="option-letter">C</span>bread</div></div><p class="tiny mt-16">Alt text: “Một bát cơm trắng” · Câu thay thế: “Cơm trong tiếng Anh là gì?”</p></section>
    <aside class="card pad"><span class="pill orange">Ví dụ bổ sung</span><h3 class="mt-16">Ảnh con hổ → tiger</h3><img src="assets/tiger.svg" alt="Minh họa đầu hổ màu cam có vằn đen" class="quiz-media" style="height:190px;margin:14px 0"><p class="tiny">Dạng này chỉ nên dùng khi từ <b>tiger</b> thực sự nằm trong chủ đề được học. Ảnh cần một đáp án rõ ràng và có quyền sử dụng.</p><button class="btn soft small" data-action="quiz-info">+ Thêm câu hỏi hình ảnh</button></aside></div>`, "quiz-builder", "Câu hỏi ảnh");
}
function adminUsers() {
  const query = state.userSearch.trim().toLocaleLowerCase("vi");
  const users = state.users.filter(user => `${user.name} ${user.email} ${user.role} ${user.status}`.toLocaleLowerCase("vi").includes(query));
  return layout(`${heading("Quản trị tài khoản", "Người dùng", "Xem trạng thái, thử khóa/mở và đổi role trong dữ liệu mẫu.")}
    <div class="toolbar"><label class="search"><span>⌕</span><input id="user-search" type="text" value="${esc(state.userSearch)}" placeholder="Tìm tên hoặc email..." aria-label="Tìm tài khoản"></label><span class="pill purple">${state.users.length} tài khoản mẫu</span></div>
    <div class="card table-card"><div class="table-head"><span>Tài khoản</span><span>Role</span><span>Trạng thái</span><span>Thao tác</span></div>${users.length ? users.map(user => `<div class="table-row"><div class="row"><div class="avatar ${user.role === "admin" ? "admin" : ""}">${esc(user.name.slice(0, 1))}</div><div><strong>${esc(user.name)}</strong><small>${esc(user.email)}</small></div></div><span class="pill ${user.role === "admin" ? "purple" : ""}" style="justify-self:start">${user.role}</span><span class="pill ${user.status === "active" ? "green" : "orange"}" style="justify-self:start">${user.status === "active" ? "Hoạt động" : "Đã khóa"}</span><div class="row wrap"><button class="btn ${user.status === "active" ? "danger" : "soft"} small" data-action="toggle-user" data-user="${user.id}" ${user.role === "admin" ? "disabled title='Admin cuối cùng không thể khóa'" : ""}>${user.status === "active" ? "Khóa" : "Mở"}</button><button class="btn secondary small" data-action="toggle-role" data-user="${user.id}" ${user.id === "u1" ? "disabled title='Admin cuối cùng không thể hạ quyền'" : ""}>${user.role === "admin" ? "Hạ role" : "Cấp admin"}</button></div></div>`).join("") : `<div class="empty"><div class="empty-icon">⌕</div>Không có tài khoản phù hợp.</div>`}</div>
    <div class="callout warn mt-24"><span>ℹ️</span><div>Đây là dữ liệu giả. Không có email đặt lại mật khẩu được gửi đi và các nút role/trạng thái không thay đổi tài khoản thật.</div></div>`, "users", "Người dùng");
}
function render() {
  const current = route();
  state.role = current.role;
  const topic = topicById(current.topicId);
  const learnerPages = { home: learnerHome, topics: topicsPage, lesson: () => lessonPage(topic), flashcards: () => flashcardsPage(topic), quiz: () => quizPage(topic), result: () => resultPage(topic), speaking: () => speakingPage(topic), writing: () => writingPage(topic), review: reviewPage, progress: progressPage };
  const adminPages = { overview: adminOverview, content: adminContent, editor: adminEditor, "quiz-builder": adminQuizBuilder, users: adminUsers };
  const pages = current.role === "admin" ? adminPages : learnerPages;
  document.getElementById("app").innerHTML = (pages[current.page] || (current.role === "admin" ? adminOverview : learnerHome))();
  document.title = `HustLingo — ${current.role === "admin" ? "Admin" : "Learner"} prototype`;
  save();
}
function saveDraftFromForm() {
  const title = document.getElementById("draft-title")?.value.trim() || "";
  const objective = document.getElementById("draft-objective")?.value.trim() || "";
  const intro = document.getElementById("draft-intro")?.value.trim() || "";
  if (!title || !objective || !intro) { toast("Vui lòng điền đủ tên, mục tiêu và phần giới thiệu."); return false; }
  state.draft = { topicId: state.draft?.topicId || "food", title, objective, intro, version: state.draft?.version || 2, published: state.draft?.published || false };
  save();
  return true;
}

document.addEventListener("click", event => {
  const target = event.target.closest("[data-action]");
  if (!target || target.disabled) return;
  const action = target.dataset.action;
  const topicId = target.dataset.topic || route().topicId;
  const topic = topicById(topicId);
  if (action === "go") { go(target.dataset.page, target.dataset.topic); return; }
  if (action === "switch-role") { state.role = state.role === "learner" ? "admin" : "learner"; state.selected = null; go(state.role === "admin" ? "overview" : "home"); return; }
  if (action === "start-flash") { state.flashIndex = 0; state.flipped = false; state.lastTopic = topic.id; go("flashcards", topic.id); return; }
  if (action === "start-quiz") { state.quizIndex = 0; state.selected = null; state.answers = []; state.lastTopic = topic.id; go("quiz", topic.id); return; }
  if (action === "flip") { state.flipped = !state.flipped; render(); return; }
  if (action === "flash-prev") { state.flashIndex = Math.max(0, state.flashIndex - 1); state.flipped = false; render(); return; }
  if (action === "flash-next") {
    if (state.flashIndex >= topic.words.length - 1) { state.quizIndex = 0; state.selected = null; state.answers = []; go("quiz", topic.id); }
    else { state.flashIndex++; state.flipped = false; render(); }
    return;
  }
  if (action === "speak") {
    if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(target.dataset.word || ""); utterance.lang = "en-US"; utterance.rate = .82; window.speechSynthesis.speak(utterance); }
    else toast("Trình duyệt này chưa hỗ trợ TTS.");
    return;
  }
  if (action === "select-answer") { state.selected = target.dataset.value; render(); return; }
  if (action === "next-question") {
    if (state.selected === null) return;
    const questions = questionsFor(topic);
    state.answers.push(state.selected);
    state.selected = null;
    if (state.quizIndex >= questions.length - 1) {
      if (!state.completedTopics.includes(topic.id)) state.completedTopics.push(topic.id);
      questions.forEach((question, index) => {
        if (state.answers[index] !== question.correct && !state.reviewWords.includes(question.correct)) state.reviewWords.push(question.correct);
      });
      go("result", topic.id);
    } else { state.quizIndex++; render(); }
    return;
  }
  if (action === "mock-speech") { state.speechResult = true; render(); toast("Đã hiển thị kết quả STT mô phỏng."); return; }
  if (action === "mock-feedback") {
    const input = document.getElementById("sentence");
    const text = input?.value.trim() || "";
    if (text.length < 5) { toast("Hãy viết một câu ngắn trước khi xem nhận xét."); return; }
    const word = target.dataset.word;
    const ok = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text);
    state.writingFeedback = { ok, message: ok ? `Câu của bạn có từ “${word}”. Bản thật sẽ kiểm tra ngữ cảnh và ngữ pháp bằng AI.` : `Hãy thêm từ “${word}” vào câu và thử lại.` };
    render(); return;
  }
  if (action === "review-word") { state.reviewWords = state.reviewWords.filter(word => word !== target.dataset.word); render(); toast("Đã đánh dấu từ mẫu là đã nhớ."); return; }
  if (action === "reset-demo") {
    state = structuredClone(initial);
    save(); go("home"); toast("Đã đặt lại dữ liệu prototype trên trình duyệt này."); return;
  }
  if (action === "edit-topic") {
    const item = topicById(topicId);
    state.draft = { topicId: item.id, title: item.title, objective: item.objective, intro: `Quan sát, nghe và luyện dùng các từ cơ bản thuộc chủ đề ${item.title.toLocaleLowerCase("vi")}.`, version: 2, published: false };
    go("editor"); return;
  }
  if (action === "save-draft") { if (saveDraftFromForm()) toast("Đã lưu bản nháp vào trình duyệt."); return; }
  if (action === "preview-draft") { if (saveDraftFromForm()) toast(`Xem trước: ${state.draft.title} — ${state.draft.objective}`); return; }
  if (action === "publish-draft") {
    if (!saveDraftFromForm()) return;
    state.draft.published = true;
    save(); go("content"); toast("Đã mô phỏng phát hành. Bản thật sẽ kiểm tra đủ 25 từ và 40 câu hỏi."); return;
  }
  if (action === "quiz-info") { toast("Bản thật: admin tải ảnh, nhập mô tả và phương án, kiểm tra rồi phát hành."); return; }
  if (action === "toggle-user") {
    const user = state.users.find(item => item.id === target.dataset.user);
    if (!user || user.role === "admin") return;
    user.status = user.status === "active" ? "disabled" : "active";
    render(); toast(`${user.name}: ${user.status === "active" ? "đã mở" : "đã khóa"} trong dữ liệu mẫu.`); return;
  }
  if (action === "toggle-role") {
    const user = state.users.find(item => item.id === target.dataset.user);
    if (!user || user.id === "u1") return;
    user.role = user.role === "admin" ? "learner" : "admin";
    render(); toast(`${user.name}: role mẫu hiện là ${user.role}.`); return;
  }
});

document.addEventListener("keydown", event => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches('[data-action="flip"]')) {
    event.preventDefault(); state.flipped = !state.flipped; render();
  }
});
document.addEventListener("input", event => {
  if (event.target.id === "user-search") {
    state.userSearch = event.target.value;
    const cursor = event.target.selectionStart;
    render();
    const input = document.getElementById("user-search");
    input.focus(); input.setSelectionRange(cursor, cursor);
  }
});
window.addEventListener("hashchange", render);
if (!location.hash) location.hash = "#learner/home";
render();
