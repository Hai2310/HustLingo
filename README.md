<div align="center">

# 🎓 HustLingo

### Học tiếng Anh theo lộ trình rõ ràng — luyện tập có hệ thống — đồng bộ trên mọi thiết bị

**Expo · React Native · TypeScript · Expo Router · Supabase**

Web · Android · iOS

</div>

---

> [!IMPORTANT]
> HustLingo được tổ chức theo **feature-based architecture** để nhóm 4 người có thể phát triển song song mà hạn chế conflict Git.  
> Mỗi thành viên chỉ làm trong module của mình; shared/core code chỉ sửa khi cả nhóm đã thống nhất.

---

## ✨ HustLingo là gì?

HustLingo là ứng dụng học tiếng Anh đa nền tảng, tập trung vào trải nghiệm học **thực tế, rõ ràng và có thể theo dõi tiến độ**.

### Chức năng mục tiêu

| Nhóm | Nội dung |
|---|---|
| 📚 Bài học | Vocabulary, Grammar, Listening, Speaking, Reading, Writing |
| 🧠 Luyện tập | Quiz, Flashcard, Review, Spaced Repetition, TOEIC, IELTS |
| 💬 Gia sư AI | Tutor, Scenario, Chat UI, Call UI, Voice Interaction |
| 👤 Tài khoản | Guest Mode, Email, Google, Facebook |
| ☁️ Đồng bộ | AsyncStorage → Supabase |
| 📈 Tiến độ | Learning progress, Saved words, Review status |
| 💎 Gói học | Free, Plus, Pro |
| 📱 Nền tảng | Web, Android, iOS |

---

# 🧭 Kiến trúc hệ thống

## 1. Kiến trúc tổng quan

![HustLingo System Architecture](docs/architecture/01-system-overview.png)

Luồng chính của ứng dụng:

```text
User
  │
  ▼
Expo + React Native + TypeScript
  │
  ▼
Expo Router
  │
  ├── Home
  ├── Lessons
  ├── Practice
  ├── AI Tutor
  └── Profile
  │
  ▼
Contexts / State
  │
  ├── AuthContext
  ├── LearningContext
  └── SubscriptionContext
  │
  ▼
Service Layer
  │
  ├── authService
  ├── progressService
  ├── savedWordService
  └── subscriptionService
  │
  ├──────────────┐
  ▼              ▼
AsyncStorage   Supabase
Guest Mode     Logged-in User
```

### Tư duy kiến trúc

```text
app/
→ route + screen entry

src/features/
→ chức năng riêng của từng module

src/components/
→ component dùng chung

src/contexts/
→ state toàn app

src/services/
→ backend / local storage access

src/data/
→ data học tập dùng chung

supabase/
→ database / migration / RLS
```

---

## 2. Luồng đăng nhập & đồng bộ dữ liệu

![HustLingo Auth and Data Flow](docs/architecture/02-auth-data-flow.png)

HustLingo sử dụng mô hình **Guest-first**.

User có thể học ngay mà không cần đăng nhập.

```text
Mở app
  ↓
Guest Mode
  ↓
Học / luyện tập
  ↓
AsyncStorage
```

Khi user đăng nhập:

```text
Guest Data
   ↓
Supabase Auth
   ↓
Merge Local Progress
   ↓
Supabase PostgreSQL
   ↓
Sync Web ↔ Android ↔ iOS
```

### Guest Mode

Guest có thể:

- học bài;
- làm flashcard;
- làm quiz;
- làm exam;
- lưu progress;
- lưu saved words;
- lưu settings;
- lưu draft.

### Khi đăng nhập

Backend cần đảm bảo:

- không mất progress Guest;
- merge dữ liệu an toàn;
- không overwrite nhầm dữ liệu cũ;
- đồng bộ được nhiều thiết bị.

### RLS

User chỉ được truy cập dữ liệu của chính mình:

```text
auth.uid() = user_id
```

---

# 👥 Phân chia team

## 3. Bốn module chính

![HustLingo Team Modules](docs/architecture/03-team-modules.png)

| Thành viên | Module | Folder chính | Trách nhiệm |
|---|---|---|---|
| 👤 Thành viên 1 | 📘 Bài học | `src/features/lessons/` | CEFR, lesson, vocabulary, grammar, 4 skills |
| 👤 Thành viên 2 | 🧠 Luyện tập | `src/features/practice/` | Quiz, flashcard, review, exam |
| 👤 Thành viên 3 | 💬 Gia sư AI | `src/features/tutor/` | Tutor, scenario, chat, call UI |
| 👤 Thành viên 4 | ⚙️ Backend/Core | `src/services/`, `src/contexts/`, `supabase/` | Auth, sync, progress, DB, RLS |

> [!NOTE]
> Ba tab **Bài học**, **Luyện tập** và **Gia sư AI** hiện được giữ trống ở public UI để từng thành viên triển khai riêng.

---

# 🗂️ Cấu trúc project

```text
HustLingo/
│
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   │
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── home.tsx
│   │   ├── lessons.tsx
│   │   ├── practice.tsx
│   │   ├── tutor.tsx
│   │   └── profile.tsx
│   │
│   ├── (auth)/
│   │   ├── signin.tsx
│   │   ├── signup.tsx
│   │   └── ...
│   │
│   ├── settings.tsx
│   ├── pricing.tsx
│   └── ...
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── home/
│   │   ├── auth/
│   │   ├── navigation/
│   │   └── motion/
│   │
│   ├── features/
│   │   ├── lessons/
│   │   ├── practice/
│   │   ├── tutor/
│   │   └── backend/
│   │
│   ├── contexts/
│   ├── services/
│   ├── data/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── constants/
│   └── theme/
│
├── assets/
│
├── docs/
│   └── architecture/
│       ├── 01-system-overview.png
│       ├── 02-auth-data-flow.png
│       └── 03-team-modules.png
│
├── supabase/
│   └── migrations/
│
├── scripts/
│
├── .env.example
├── app.config.js
├── eas.json
├── package.json
├── tsconfig.json
└── README.md
```

---

# 📁 Mỗi folder dùng để làm gì?

## `app/`

**Chỉ dùng cho route và screen entry.**

Ví dụ:

```text
app/(tabs)/lessons.tsx
```

nên chủ yếu làm:

```tsx
export { default } from "@/features/lessons/screens/LessonsScreen";
```

Không nên nhét business logic dài vào `app/`.

---

## `src/features/`

Đây là nơi 3 thành viên frontend làm việc chính.

Mỗi feature theo cấu trúc:

```text
feature/
├── README.md
├── screens/
├── components/
├── data/
├── hooks/
└── types/
```

---

## `src/components/common/`

UI dùng chung toàn app.

Ví dụ:

```text
AppCard
Buttons
Screen
PageHeader
SectionTitle
SkillCard
HustLogo
AmbientBackground
```

Nếu component chỉ dùng cho một module thì **không** đưa vào `common/`.

---

## `src/components/home/`

Chỉ dành cho Trang chủ:

```text
HeroSlideshow
PricingTeaser
```

---

## `src/components/auth/`

Component phục vụ:

```text
Sign In
Sign Up
Forgot Password
OAuth UI
```

---

## `src/components/navigation/`

Navigation UI:

```text
AnimatedTabIcon
```

Bottom tab được cấu hình tại:

```text
app/(tabs)/_layout.tsx
```

---

## `src/components/motion/`

Animation dùng chung:

```text
FadeIn
SlideIn
PressableScale
AnimatedProgress
```

---

## `src/contexts/`

Global state:

```text
AuthContext
LearningContext
SubscriptionContext
```

Feature được **dùng**, nhưng không tự ý thay đổi contract.

---

## `src/services/`

Lớp giao tiếp với backend/local storage.

```text
supabase.ts
authService.ts
progressService.ts
savedWordService.ts
subscriptionService.ts
```

### Không nên

```ts
await supabase
  .from("learning_progress")
  .insert(...);
```

trực tiếp trong screen.

### Nên

```ts
await progressService.completeLesson(...);
```

---

## `src/data/`

Shared learning data.

Quan trọng nhất:

```text
src/data/vocabulary-en.ts
```

chứa **10.000 từ tiếng Anh**.

---

## `src/theme/`

Design System chung:

```text
colors
spacing
typography
radius
motion
layout
```

Không để mỗi người tự tạo một bộ màu/style riêng.

---

## `src/types/`

Shared TypeScript interfaces/types.

---

## `src/utils/`

Utility functions:

```text
shuffle
formatDate
calculateAccuracy
spacedRepetition
```

---

## `assets/`

Static files:

```text
logo
image
audio
icon
splash
```

---

## `supabase/`

Backend database:

```text
migration
RLS
schema
trigger
index
```

Chỉ Backend/Core nên sửa.

---

# 📘 Module Bài học

## Owner

**Thành viên 1**

## Entry

```text
app/(tabs)/lessons.tsx
```

## Folder

```text
src/features/lessons/
```

### Nên tổ chức

```text
src/features/lessons/
├── README.md
├── screens/
│   ├── LessonsScreen.tsx
│   ├── LessonDetailScreen.tsx
│   ├── TopicScreen.tsx
│   └── LessonCompleteScreen.tsx
│
├── components/
│   ├── LessonCard.tsx
│   ├── TopicCard.tsx
│   ├── LevelSelector.tsx
│   ├── LessonProgress.tsx
│   ├── VocabularySection.tsx
│   ├── GrammarSection.tsx
│   ├── ListeningSection.tsx
│   ├── SpeakingSection.tsx
│   ├── ReadingSection.tsx
│   └── WritingSection.tsx
│
├── data/
├── hooks/
└── types/
```

### Chức năng cần làm

```text
Lessons Hub
↓
CEFR A1-C1
↓
Topic
↓
Lesson
├── Vocabulary
├── Grammar
├── Listening
├── Speaking
├── Reading
└── Writing
↓
Lesson Progress
```

### Vocabulary

Dùng:

```ts
import { vocabulary } from "@/features/lessons/data/vocabulary";
```

Không tạo thêm một bản dataset 10.000 từ.

---

# 🧠 Module Luyện tập

## Owner

**Thành viên 2**

## Entry

```text
app/(tabs)/practice.tsx
```

## Folder

```text
src/features/practice/
```

### Nên tổ chức

```text
src/features/practice/
├── screens/
│   ├── PracticeScreen.tsx
│   ├── VocabularyQuizScreen.tsx
│   ├── GrammarQuizScreen.tsx
│   ├── FlashcardScreen.tsx
│   ├── ReviewScreen.tsx
│   ├── ListeningPracticeScreen.tsx
│   ├── SpeakingPracticeScreen.tsx
│   ├── ReadingPracticeScreen.tsx
│   ├── WritingPracticeScreen.tsx
│   ├── ExamScreen.tsx
│   └── ResultScreen.tsx
│
├── components/
│   ├── PracticeCard.tsx
│   ├── QuestionCard.tsx
│   ├── AnswerOption.tsx
│   ├── Flashcard.tsx
│   ├── PracticeProgress.tsx
│   ├── ExamTimer.tsx
│   ├── QuestionNavigator.tsx
│   └── ResultCard.tsx
│
├── data/
├── hooks/
└── types/
```

### Chức năng cần làm

```text
Practice Hub
├── Vocabulary Quiz
├── Grammar Quiz
├── Flashcard
├── Spaced Repetition
├── Review
├── Listening
├── Speaking
├── Reading
├── Writing
├── TOEIC
└── IELTS
```

---

# 💬 Module Gia sư AI

## Owner

**Thành viên 3**

## Entry

```text
app/(tabs)/tutor.tsx
```

## Folder

```text
src/features/tutor/
```

### Nên tổ chức

```text
src/features/tutor/
├── screens/
│   ├── TutorScreen.tsx
│   ├── TutorDetailScreen.tsx
│   ├── ScenarioScreen.tsx
│   ├── TutorChatScreen.tsx
│   └── TutorCallScreen.tsx
│
├── components/
│   ├── TutorCard.tsx
│   ├── TutorAvatar.tsx
│   ├── ScenarioCard.tsx
│   ├── ChatBubble.tsx
│   ├── ChatInput.tsx
│   ├── TypingIndicator.tsx
│   ├── VoiceWave.tsx
│   ├── CallControls.tsx
│   └── CallStatus.tsx
│
├── data/
│   ├── tutors.ts
│   ├── scenarios.ts
│   ├── demoMessages.ts
│   └── vocabulary.ts
│
├── hooks/
└── types/
```

### Giai đoạn hiện tại

Ưu tiên:

```text
Tutor List
Scenario
Tutor Detail
Chat UI
Call UI
Voice Wave
Demo Conversation
```

### Giai đoạn sau

```text
Microphone
↓
STT
↓
LLM
↓
TTS
↓
Audio
```

> [!WARNING]
> Không đưa API key hoặc secret AI trực tiếp vào Expo frontend.

---

# ⚙️ Module Backend/Core

## Owner

**Thành viên 4**

## Folder

```text
src/services/
src/contexts/
src/features/backend/
supabase/
```

### Phụ trách

```text
Auth
├── Email
├── Google
└── Facebook

Database
├── profiles
├── learning_progress
├── saved_words
├── feedback
├── subscriptions
└── user_settings

Sync
├── Guest
├── AsyncStorage
└── Supabase

Security
└── RLS
```

### Frontend cần backend mới?

Frontend **không tự tạo bảng**.

Ví dụ cần lưu progress:

```ts
completeLesson({
  lessonId,
  progress,
  completedAt
});
```

Backend sẽ:

1. thiết kế schema;
2. tạo migration;
3. tạo RLS;
4. tạo service;
5. trả contract cho frontend.

---

# 📚 Dataset 10.000 từ

Nguồn duy nhất:

```text
src/data/vocabulary-en.ts
```

ID:

```text
local-en-00001
...
local-en-10000
```

Các feature dùng thông qua:

```text
src/features/lessons/data/vocabulary.ts
src/features/practice/data/vocabulary.ts
src/features/tutor/data/vocabulary.ts
```

### Vì sao không copy 3 lần?

Để tránh:

- duplicate data;
- tăng dung lượng;
- lệch phiên bản;
- sửa một nơi nhưng nơi khác không cập nhật.

> [!TIP]
> Hãy coi `src/data/vocabulary-en.ts` là **single source of truth**.

---

# 🔐 Quy tắc Core

Các file sau **không tự ý sửa**:

```text
app/_layout.tsx
app/(tabs)/_layout.tsx
src/contexts/AuthContext.tsx
src/contexts/LearningContext.tsx
src/services/supabase.ts
supabase/migrations/
package.json
app.config.js
eas.json
tsconfig.json
```

Nếu cần thay đổi:

```text
Báo nhóm
↓
Thống nhất contract
↓
Core/Backend sửa
↓
Feature sử dụng
```

---

# 🚀 Quick Start

## 1. Cài dependency

```bash
npm install
```

## 2. Tạo `.env`

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Cấu hình:

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Không commit `.env`.

---

## 3. Chạy Web

```bash
npx expo start --web --clear
```

Mặc định:

```text
http://localhost:8081
```

---

## 4. Test giao diện điện thoại trên Chrome

```text
F12
Ctrl + Shift + M
```

---

## 5. Chạy điện thoại thật

```bash
npx expo start --tunnel
```

Quét QR bằng Expo Go.

---

## 6. Android Emulator

```bash
npx expo start --android
```

---

# ✅ Validation

Trước khi commit:

```bash
npm run typecheck
```

```bash
npm run validate
```

Nếu có:

```bash
node scripts/validate-team-structure.mjs
```

Mọi lệnh trên phải **PASS** trước khi merge.

---

# 🌿 Git Workflow

Không code trực tiếp trên:

```text
main
```

### Branch

```text
feature/lessons
feature/practice
feature/tutor
feature/backend
```

Ví dụ:

```bash
git checkout -b feature/lessons
```

---

## Commit Convention

Tốt:

```text
feat(lessons): add CEFR level selector
feat(practice): add flashcard review
feat(tutor): add call UI
feat(backend): add progress service

fix(auth): fix Google redirect
fix(home): fix mobile slideshow
```

Không tốt:

```text
update
fix
abc
done
code moi
```

---

# 🔄 Pull Request Flow

```text
Feature Branch
      ↓
Pull Request
      ↓
Code Review
      ↓
Typecheck
      ↓
Validate
      ↓
Merge Main
      ↓
QA
      ↓
Build
```

---

# 🎨 Quy tắc UI

Mỗi màn cần kiểm tra:

```text
Mobile
Tablet
Desktop Web
```

Nên có đủ:

```text
Loading
Empty
Error
Normal
Completed
```

### Theme

Dùng:

```text
src/theme/
```

Không nên:

```ts
backgroundColor: "#FA1234";
```

nếu theme đã có token phù hợp.

---

# 🔑 Security Rules

Không commit:

```text
.env
API secret
private token
SUPABASE_SERVICE_ROLE_KEY
AI provider secret
```

Không để service-role key trong Expo frontend.

User data phải được bảo vệ bằng RLS.

---

# ☑️ Checklist trước Pull Request

- [ ] Code đúng folder của feature.
- [ ] Không sửa Core ngoài phạm vi.
- [ ] Không duplicate dataset 10.000 từ.
- [ ] Không commit secret.
- [ ] Không gọi Supabase trực tiếp trong screen nếu đã có service.
- [ ] Type/interface rõ ràng.
- [ ] Hạn chế `any`.
- [ ] UI chạy mobile.
- [ ] UI chạy web.
- [ ] Navigation hoạt động.
- [ ] Loading state có.
- [ ] Empty state có.
- [ ] Error state có.
- [ ] `npm run typecheck` PASS.
- [ ] `npm run validate` PASS.
- [ ] Không phá Home.
- [ ] Không phá Profile.
- [ ] Không phá Auth.
- [ ] Commit message rõ ràng.

---

# 📌 Ownership

| Khu vực | Folder | Owner |
|---|---|---|
| 🏠 Home | `app/(tabs)/home.tsx`, `src/components/home/` | Core |
| 📘 Lessons | `src/features/lessons/` | Thành viên 1 |
| 🧠 Practice | `src/features/practice/` | Thành viên 2 |
| 💬 Tutor | `src/features/tutor/` | Thành viên 3 |
| ⚙️ Backend | `src/services/`, `src/contexts/`, `supabase/` | Thành viên 4 |
| 🎨 Shared UI | `src/components/common/` | Core |
| 🧭 Navigation | `app/(tabs)/_layout.tsx` | Core |
| 🎯 Theme | `src/theme/` | Core |
| 📚 10.000 Vocabulary | `src/data/vocabulary-en.ts` | Shared Read-only |

---

# 🎯 Nguyên tắc quan trọng nhất

```text
Lessons
→ code trong lessons

Practice
→ code trong practice

Tutor
→ code trong tutor

Backend
→ quản lý Context + Service + Supabase

Shared/Core
→ chỉ sửa khi nhóm thống nhất
```

---

<div align="center">

## HustLingo

**One codebase · Four modules · One shared architecture**

Expo · React Native · TypeScript · Supabase

</div>
