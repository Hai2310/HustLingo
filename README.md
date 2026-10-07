<div *align*="center">



**# 🎓 HustLingo**



**### \*\*Học tiếng Anh theo lộ trình rõ ràng · Luyện tập có hệ thống · Đồng bộ trên mọi thiết bị\*\***



[![HustLingo]\(https\://img.shields.io/badge/HustLingo-HUST%20English-C8102E?style=for-the-badge&logo=bookstack&logoColor=white)]\(#)

[![Expo]\(https\://img.shields.io/badge/Expo-React%20Native-111827?style=for-the-badge&logo=expo&logoColor=white)]\(https\://expo.dev/)

[![TypeScript]\(https\://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)]\(https\://www\.typescriptlang.org/)

[![Supabase]\(https\://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)]\(https\://supabase.com/)



[![Web]\(https\://img.shields.io/badge/Web-Ready-38BDF8?style=flat-square&logo=googlechrome&logoColor=white)]\(#)

[![Android]\(https\://img.shields.io/badge/Android-Ready-34A853?style=flat-square&logo=android&logoColor=white)]\(#)

[![iOS]\(https\://img.shields.io/badge/iOS-Ready-111827?style=flat-square&logo=apple&logoColor=white)]\(#)

[![Team]\(https\://img.shields.io/badge/Team-4%20Members-8B5CF6?style=flat-square&logo=github&logoColor=white)]\(#team-hustlingo)



\</div>



**---**



**## 🚀 Giới thiệu về HustLingo**



**\*\*HustLingo\*\*** là ứng dụng học tiếng Anh đa nền tảng được xây dựng với mục tiêu tạo ra một không gian học tập **\*\*rõ lộ trình, có luyện tập thực tế, có theo dõi tiến độ và có khả năng mở rộng thành gia sư AI cá nhân hóa\*\***.



Thay vì tách rời bài học, luyện tập, từ vựng, luyện thi và hội thoại thành nhiều công cụ khác nhau, HustLingo gom toàn bộ quá trình học vào **\*\*một hệ thống thống nhất\*\***:



\`\`\`text

Học kiến thức

    ↓

Luyện tập

    ↓

Ôn lại phần chưa nhớ

    ↓

Theo dõi tiến độ

    ↓

Đồng bộ nhiều thiết bị

    ↓

Luyện giao tiếp với Gia sư AI

\`\`\`



**### 🎯 HustLingo hướng tới ai?**



HustLingo phù hợp với:



\- sinh viên cần củng cố tiếng Anh hằng ngày;

\- người học theo lộ trình **\*\*CEFR A1 → C1\*\***;

\- người cần luyện **\*\*TOEIC / IELTS\*\***;

\- người muốn học từ vựng có hệ thống thay vì học rời rạc;

\- người muốn luyện đủ **\*\*Listening · Speaking · Reading · Writing\*\***;

\- người muốn học ở chế độ Guest trước, sau đó đăng nhập để đồng bộ dữ liệu;

\- người muốn luyện giao tiếp qua các tình huống thực tế với **\*\*Gia sư AI\*\***.



**### 💡 HustLingo giải quyết điều gì?**



Nhiều ứng dụng học ngôn ngữ thường gặp một trong các vấn đề:



\`\`\`text

Nội dung nhiều nhưng khó biết nên học gì trước

Luyện tập và bài học tách rời

Học xong nhưng không có hệ thống ôn lại

Không theo dõi được từ đã nhớ / chưa nhớ

Đổi thiết bị dễ mất tiến độ

Tính năng AI nằm tách biệt khỏi lộ trình học

\`\`\`



HustLingo được thiết kế để nối các phần này lại thành một vòng học thống nhất:



\| Giai đoạn | HustLingo thực hiện |

\|---|---|

\| **\*\*Học\*\*** | Lesson theo level, topic, vocabulary, grammar và 4 kỹ năng |

\| **\*\*Luyện\*\*** | Quiz, Flashcard, Listening, Speaking, Reading, Writing |

\| **\*\*Ôn\*\*** | Review queue, Spaced Repetition, Saved Words |

\| **\*\*Thi\*\*** | TOEIC, IELTS, timer, result, analytics |

\| **\*\*Theo dõi\*\*** | Learning Progress, accuracy, completed lessons |

\| **\*\*Giao tiếp\*\*** | Tutor, Scenario, Chat UI, Call UI |

\| **\*\*Đồng bộ\*\*** | Guest data → Supabase account → nhiều thiết bị |



**### 🌍 Một codebase cho nhiều nền tảng**



HustLingo sử dụng:



\`\`\`text

Expo + React Native + TypeScript

\`\`\`



để phát triển chung cho:



\`\`\`text

Web

Android

iOS

\`\`\`



Mục tiêu là hạn chế việc phải duy trì ba codebase riêng, đồng thời giữ trải nghiệm học nhất quán giữa web và mobile.



**### 📚 Nền tảng nội dung học**



Project có **\*\*10.000 từ tiếng Anh dùng chung\*\*** tại:



\`\`\`text

src/data/vocabulary-en.ts

\`\`\`



Dataset này là nguồn dữ liệu vocabulary chung cho:



\`\`\`text

Bài học

Luyện tập

Gia sư AI

\`\`\`



Các feature chỉ import/re-export nguồn chung thay vì copy thành nhiều bản khác nhau.



Ngoài vocabulary, kiến trúc project đã chuẩn bị không gian cho:



\`\`\`text

Grammar

Listening

Speaking

Reading

Writing

TOEIC

IELTS

Tutor scenarios

Review data

\`\`\`



**### 🧠 Học tập theo vòng lặp, không chỉ xem nội dung**



HustLingo không chỉ hiển thị bài học. Mục tiêu của project là tạo một learning loop:



\`\`\`text

Lesson

  ↓

Practice

  ↓

Answer / Result

  ↓

Learning Progress

  ↓

Review

  ↓

Next Lesson

\`\`\`



Các trạng thái như:



\`\`\`text

learned

need review

mastered

completed

accuracy

next review

\`\`\`



được dùng để giúp người học biết mình đang ở đâu và cần làm gì tiếp theo.



**### 💬 Gia sư AI**



Module Gia sư AI được thiết kế cho các tình huống giao tiếp như:



\`\`\`text

Coffee Shop

Job Interview

University

Travel

Presentation

Daily Conversation

\`\`\`



Kiến trúc tương lai:



\`\`\`text

Microphone

    ↓

STT

    ↓

LLM

    ↓

TTS

    ↓

Audio / Conversation

\`\`\`



Ở giai đoạn hiện tại, team ưu tiên hoàn thiện **\*\*Tutor UI, Scenario, Chat UI, Call UI và interaction flow\*\*** trước khi kết nối AI runtime thật.



**### ☁️ Guest-first & đồng bộ dữ liệu**



HustLingo cho phép user vào học ngay:



\`\`\`text

Open App

   ↓

Guest Mode

   ↓

AsyncStorage

\`\`\`



Khi user muốn đồng bộ:



\`\`\`text

Login

↓

Email / Google / Facebook

↓

Merge local progress

↓

Supabase

↓

Web ↔ Android ↔ iOS

\`\`\`



Điều này giúp quá trình bắt đầu học nhanh hơn nhưng vẫn hỗ trợ tài khoản và đồng bộ lâu dài.



**### 🧱 Kiến trúc để nhiều người cùng phát triển**



Project được chia theo **\*\*feature-based architecture\*\***:



\`\`\`text

Lessons

Practice

Tutor

Backend/Core

\`\`\`



Mỗi thành viên có vùng code riêng, trong khi những phần dùng chung như:



\`\`\`text

Theme

Common Components

Auth

Learning Context

Navigation

Supabase

\`\`\`



được quản lý tập trung.



Mục tiêu là:



\- giảm conflict Git;

\- tránh duplicate code;

\- tránh mỗi feature tự tạo một kiến trúc riêng;

\- dễ test;

\- dễ review;

\- dễ mở rộng sau này.



**### 🔭 Định hướng phát triển**



HustLingo hướng tới một hệ thống học tiếng Anh hoàn chỉnh:



\`\`\`text

Learning Content

\+

Practice Engine

\+

Spaced Repetition

\+

Exam Training

\+

AI Conversation

\+

Cloud Sync

\+

Progress Analytics

\`\`\`



Tức là không chỉ là một bộ flashcard hoặc một chatbot, mà là **\*\*một hệ sinh thái học tiếng Anh thống nhất từ học kiến thức → luyện tập → ôn tập → kiểm tra → giao tiếp\*\***.



**---**









\\> [!IMPORTANT]



\\> _\*\*_**\*\*HustLingo dùng kiến trúc feature-based.\*\***\*\*  



\\> Mỗi thành viên làm trong module của mình, còn các phần dùng chung như \`AuthContext\`, \`LearningContext\`, \`Supabase\`, navigation và theme chỉ thay đổi khi cả nhóm đã thống nhất.







**---**







**## 🌟 Điểm nổi bật**



\| | Module | Mục tiêu |

\|---|---|---|

\| 📘 | **\*\*Bài học\*\*** | CEFR A1-C1, Vocabulary, Grammar, Listening, Speaking, Reading, Writing |

\| 🧠 | **\*\*Luyện tập\*\*** | Quiz, Flashcard, Review, Spaced Repetition, TOEIC, IELTS |

\| 💬 | **\*\*Gia sư AI\*\*** | Tutor, Scenario, Chat UI, Call UI và kiến trúc STT → LLM → TTS |

\| ⚙️ | **\*\*Backend\*\*** | Supabase Auth, Progress, Saved Words, Subscription, RLS, Sync |

\| 📚 | **\*\*Dữ liệu\*\*** | 10.000 từ tiếng Anh dùng chung cho toàn bộ project |

\| 📱 | **\*\*Đa nền tảng\*\*** | Web · Android · iOS với một codebase Expo |



**---**



**# 👥 Team HustLingo**



\| Thành viên | GitHub | Phụ trách | Khu vực code chính |

\|---|---|---|---|

\| **\*\*Huy\*\*** | [@HuyAA-DD]\(https\://github.com/HuyAA-DD) | 📘 **\*\*Bài học\*\*** | \`src/features/lessons/\` |

\| **\*\*Dương\*\*** | [@smileviel]\(https\://github.com/smileviel) | 🧠 **\*\*Luyện tập\*\*** | \`src/features/practice/\` |

\| **\*\*Khánh\*\*** | [@hdkhanh12]\(https\://github.com/hdkhanh12) | 💬 **\*\*Gia sư AI\*\*** | \`src/features/tutor/\` |

\| **\*\*Hải\*\*** | [@Hai2310]\(https\://github.com/Hai2310) | ⚙️ **\*\*Backend / Core\*\*** | \`src/services/\`, \`src/contexts/\`, \`supabase/\` |



**### Màu nhận diện module**



![Lessons]\(https\://img.shields.io/badge/Huy-Bài%20học-60A5FA?style=for-the-badge)

![Practice]\(https\://img.shields.io/badge/Dương-Luyện%20tập-34D399?style=for-the-badge)

![Tutor]\(https\://img.shields.io/badge/Khánh-Gia%20sư%20AI-A78BFA?style=for-the-badge)

![Backend]\(https\://img.shields.io/badge/Hải-Backend-F59E0B?style=for-the-badge)



**---**



**# 🏠 Tổng quan sản phẩm**



HustLingo được thiết kế theo hướng **\*\*Guest-first\*\***:



\`\`\`text

Mở ứng dụng

     ↓

Vào Home ngay

     ↓

Học / luyện tập ở Guest Mode

     ↓

Lưu local bằng AsyncStorage

     ↓

Đăng nhập khi cần đồng bộ

     ↓

Supabase

\`\`\`



**### Các tab chính**



\`\`\`text

🏠 Trang chủ

📘 Bài học

🧠 Luyện tập

💬 Gia sư AI

👤 Hồ sơ

\`\`\`



\> Ba tab **\*\*Bài học\*\***, **\*\*Luyện tập\*\*** và **\*\*Gia sư AI\*\*** hiện được giữ sạch ở public UI để Huy, Dương và Khánh xây chức năng riêng mà không ảnh hưởng Home/Profile/Settings/backend.



**---**



**# 🧭 Kiến trúc tổng quan hệ thống**



![HustLingo System Architecture]\(docs/architecture/01-system-overview\.png)



**## Luồng tổng quát**



\`\`\`text

Người dùng

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

State / Context

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

    ├───────────────┐

    ▼               ▼

AsyncStorage      Supabase

Guest Mode        Account Data

\`\`\`



**### Nguyên tắc kiến trúc**



\| Folder | Trách nhiệm |

\|---|---|

\| \`app/\` | Route và entry screen |

\| \`src/features/\` | Chức năng riêng của từng module |

\| \`src/components/\` | Component dùng chung |

\| \`src/contexts/\` | State toàn app |

\| \`src/services/\` | Giao tiếp backend / local storage |

\| \`src/data/\` | Data học tập dùng chung |

\| \`src/theme/\` | Design system |

\| \`supabase/\` | Database, migration, RLS |



**---**



**# 🔐 Luồng đăng nhập & đồng bộ dữ liệu**



![HustLingo Auth and Data Flow]\(docs/architecture/02-auth-data-flow\.png)



HustLingo không bắt user đăng nhập ngay.



**## Guest Mode**



Guest vẫn có thể:



\- học bài;

\- làm flashcard;

\- làm quiz;

\- làm exam;

\- lưu progress;

\- lưu saved words;

\- lưu settings;

\- lưu draft.



Dữ liệu Guest được lưu tại:



\`\`\`text

AsyncStorage

\`\`\`



**## Khi đăng nhập**



\`\`\`text

Guest Data

    ↓

Supabase Auth

    ↓

Merge Local Progress

    ↓

Supabase PostgreSQL

    ↓

Sync Web ↔ Android ↔ iOS

\`\`\`



Các phương thức Auth:



\`\`\`text

Email

Google

Facebook

\`\`\`



**## RLS**



Dữ liệu user phải được bảo vệ bằng Row Level Security.



Ví dụ logic:



\`\`\`text

auth.uid() = user_id

\`\`\`



User A không được đọc hoặc sửa dữ liệu của User B.



**---**



**# 🧩 Kiến trúc 4 module chính**



![HustLingo Team Modules]\(docs/architecture/03-team-modules.png)



Tất cả module dùng chung:



\`\`\`text

Shared Layer

├── Theme

├── Common Components

├── Motion

├── Types

├── Utils

└── AsyncStorage

\`\`\`



**---**



**# 🗂️ Cấu trúc project**



\`\`\`text

HustLingo/

│

├── app/

│   ├── \_layout.tsx

│   ├── index.tsx

│   │

│   ├── (tabs)/

│   │   ├── \_layout.tsx

│   │   ├── home.tsx

│   │   ├── lessons.tsx

│   │   ├── practice.tsx

│   │   ├── tutor.tsx

│   │   └── profile.tsx

│   │

│   ├── (auth)/

│   │   ├── signin.tsx

│   │   ├── signup.tsx

│   │   └── ...

│   │

│   ├── settings.tsx

│   ├── pricing.tsx

│   └── ...

│

├── src/

│   ├── components/

│   │   ├── common/

│   │   ├── home/

│   │   ├── auth/

│   │   ├── navigation/

│   │   └── motion/

│   │

│   ├── features/

│   │   ├── lessons/

│   │   ├── practice/

│   │   ├── tutor/

│   │   └── backend/

│   │

│   ├── contexts/

│   ├── services/

│   ├── data/

│   ├── hooks/

│   ├── types/

│   ├── utils/

│   ├── constants/

│   └── theme/

│

├── assets/

│

├── docs/

│   └── architecture/

│       ├── 01-system-overview\.png

│       ├── 02-auth-data-flow\.png

│       └── 03-team-modules.png

│

├── supabase/

│   └── migrations/

│

├── scripts/

│

├── .env.example

├── app.config.js

├── eas.json

├── package.json

├── tsconfig.json

└── README.md

\`\`\`



**---**



**# 📁 Giải thích từng khu vực**



**## \`app/\` — Route & Screen Entry**



\`app/\` chỉ nên giữ các route và entry screen.



Ví dụ:



\`\`\`text

app/(tabs)/lessons.tsx

\`\`\`



có thể chỉ cần:



\`\`\`tsx

export { default } from "@/features/lessons/screens/LessonsScreen";

\`\`\`



Không nên đưa data lớn hoặc business logic vào \`app/\`.



**---**



**## \`src/features/\` — Nơi 3 thành viên frontend làm việc chính**



\`\`\`text

src/features/

├── lessons/

├── practice/

└── tutor/

\`\`\`



Mỗi module tổ chức theo:



\`\`\`text

feature/

├── README.md

├── screens/

├── components/

├── data/

├── hooks/

└── types/

\`\`\`



**---**



**## \`src/components/common/\` — Shared UI**



Ví dụ:



\`\`\`text

AppCard

Buttons

Screen

PageHeader

SectionTitle

SkillCard

HustLogo

AmbientBackground

\`\`\`



Component chỉ dùng riêng một module phải để trong module đó.



**---**



**## \`src/components/home/\`**



Chỉ dành cho Trang chủ:



\`\`\`text

HeroSlideshow

PricingTeaser

\`\`\`



**---**



**## \`src/components/auth/\`**



Dùng cho:



\`\`\`text

Sign In

Sign Up

Forgot Password

OAuth UI

\`\`\`



**---**



**## \`src/components/navigation/\`**



Component điều hướng dùng chung:



\`\`\`text

AnimatedTabIcon

\`\`\`



Bottom Tab cấu hình ở:



\`\`\`text

app/(tabs)/\_layout.tsx

\`\`\`



**---**



**## \`src/components/motion/\`**



Animation dùng chung:



\`\`\`text

FadeIn

SlideIn

PressableScale

AnimatedProgress

\`\`\`



**---**



**## \`src/contexts/\`**



Global state:



\`\`\`text

AuthContext

LearningContext

SubscriptionContext

\`\`\`



Các module được sử dụng Context nhưng không tự ý thay đổi contract chung.



**---**



**## \`src/services/\`**



Lớp giao tiếp backend/local storage:



\`\`\`text

supabase.ts

authService.ts

progressService.ts

savedWordService.ts

subscriptionService.ts

\`\`\`



**### Không nên**



\`\`\`ts

await supabase

  .from("learning_progress")

  .insert(...);

\`\`\`



trực tiếp trong screen.



**### Nên**



\`\`\`ts

await progressService.completeLesson(...);

\`\`\`



**---**



**## \`src/data/\`**



Data dùng chung toàn project.



Quan trọng nhất:



\`\`\`text

src/data/vocabulary-en.ts

\`\`\`



chứa **\*\*10.000 từ tiếng Anh\*\***.



**---**



**## \`src/theme/\`**



Design system:



\`\`\`text

colors

spacing

typography

radius

motion

layout

\`\`\`



Không để mỗi thành viên tự tạo một hệ màu/style khác.



**---**



**## \`assets/\`**



Chứa:



\`\`\`text

logo

image

audio

icon

splash

\`\`\`



**---**



**## \`supabase/\`**



Backend schema:



\`\`\`text

migration

RLS

trigger

index

database definition

\`\`\`



Phần này thuộc Backend/Core.



**---**



**# 📘 Huy — Module Bài học**



GitHub: **\*\*[@HuyAA-DD]\(**&#x68;ttps\://github.com/HuyAA-D&#x44;**)\*\***



**## Entry**



\`\`\`text

app/(tabs)/lessons.tsx

\`\`\`



**## Folder làm việc chính**



\`\`\`text

src/features/lessons/

\`\`\`



**## Cấu trúc đề xuất**



\`\`\`text

src/features/lessons/

├── README.md

├── screens/

│   ├── LessonsScreen.tsx

│   ├── LessonDetailScreen.tsx

│   ├── TopicScreen.tsx

│   └── LessonCompleteScreen.tsx

│

├── components/

│   ├── LessonCard.tsx

│   ├── TopicCard.tsx

│   ├── LevelSelector.tsx

│   ├── LessonProgress.tsx

│   ├── VocabularySection.tsx

│   ├── GrammarSection.tsx

│   ├── ListeningSection.tsx

│   ├── SpeakingSection.tsx

│   ├── ReadingSection.tsx

│   └── WritingSection.tsx

│

├── data/

├── hooks/

└── types/

\`\`\`



**## Chức năng cần xây**



\`\`\`text

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

\`\`\`



Dùng vocabulary:



\`\`\`ts

import { vocabulary } from "@/features/lessons/data/vocabulary";

\`\`\`



Không tạo một bản 10.000 từ khác.



**---**



**# 🧠 Dương — Module Luyện tập**



GitHub: **\*\*[@smileviel]\(**&#x68;ttps\://github.com/smilevie&#x6C;**)\*\***



**## Entry**



\`\`\`text

app/(tabs)/practice.tsx

\`\`\`



**## Folder làm việc chính**



\`\`\`text

src/features/practice/

\`\`\`



**## Cấu trúc đề xuất**



\`\`\`text

src/features/practice/

├── screens/

│   ├── PracticeScreen.tsx

│   ├── VocabularyQuizScreen.tsx

│   ├── GrammarQuizScreen.tsx

│   ├── FlashcardScreen.tsx

│   ├── ReviewScreen.tsx

│   ├── ListeningPracticeScreen.tsx

│   ├── SpeakingPracticeScreen.tsx

│   ├── ReadingPracticeScreen.tsx

│   ├── WritingPracticeScreen.tsx

│   ├── ExamScreen.tsx

│   └── ResultScreen.tsx

│

├── components/

│   ├── PracticeCard.tsx

│   ├── QuestionCard.tsx

│   ├── AnswerOption.tsx

│   ├── Flashcard.tsx

│   ├── PracticeProgress.tsx

│   ├── ExamTimer.tsx

│   ├── QuestionNavigator.tsx

│   └── ResultCard.tsx

│

├── data/

├── hooks/

└── types/

\`\`\`



**## Chức năng cần xây**



\`\`\`text

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

\`\`\`



**---**



**# 💬 Khánh — Module Gia sư AI**



GitHub: **\*\*[@hdkhanh12]\(**&#x68;ttps\://github.com/hdkhanh1&#x32;**)\*\***



**## Entry**



\`\`\`text

app/(tabs)/tutor.tsx

\`\`\`



**## Folder làm việc chính**



\`\`\`text

src/features/tutor/

\`\`\`



**## Cấu trúc đề xuất**



\`\`\`text

src/features/tutor/

├── screens/

│   ├── TutorScreen.tsx

│   ├── TutorDetailScreen.tsx

│   ├── ScenarioScreen.tsx

│   ├── TutorChatScreen.tsx

│   └── TutorCallScreen.tsx

│

├── components/

│   ├── TutorCard.tsx

│   ├── TutorAvatar.tsx

│   ├── ScenarioCard.tsx

│   ├── ChatBubble.tsx

│   ├── ChatInput.tsx

│   ├── TypingIndicator.tsx

│   ├── VoiceWave.tsx

│   ├── CallControls.tsx

│   └── CallStatus.tsx

│

├── data/

│   ├── tutors.ts

│   ├── scenarios.ts

│   ├── demoMessages.ts

│   └── vocabulary.ts

│

├── hooks/

└── types/

\`\`\`



**## Giai đoạn hiện tại**



Ưu tiên:



\`\`\`text

Tutor List

Scenario

Tutor Detail

Chat UI

Call UI

Voice Wave

Demo Conversation

\`\`\`



**## Giai đoạn AI thật**



\`\`\`text

Microphone

↓

STT

↓

LLM

↓

TTS

↓

Audio Output

\`\`\`



\> [!WARNING]

\> Không đưa API key hoặc secret AI trực tiếp vào frontend.



**---**



**# ⚙️ Hải — Backend / Core**



GitHub: **\*\*[@Hai2310]\(**&#x68;ttps\://github.com/Hai231&#x30;**)\*\***



**## Folder phụ trách**



\`\`\`text

src/services/

src/contexts/

src/features/backend/

supabase/

\`\`\`



**## Trách nhiệm chính**



\`\`\`text

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

\`\`\`



Nếu frontend cần backend mới, frontend mô tả contract cần dùng.



Ví dụ:



\`\`\`ts

completeLesson({

  lessonId,

  progress,

  completedAt

});

\`\`\`



Backend phụ trách schema, migration, RLS và service.



**---**



**# 📚 Dataset 10.000 từ**



Nguồn duy nhất:



\`\`\`text

src/data/vocabulary-en.ts

\`\`\`



ID:



\`\`\`text

local-en-00001

...

local-en-10000

\`\`\`



Ba module dùng qua:



\`\`\`text

src/features/lessons/data/vocabulary.ts

src/features/practice/data/vocabulary.ts

src/features/tutor/data/vocabulary.ts

\`\`\`



**### Vì sao không copy 3 lần?**



\- tránh duplicate data;

\- giảm dung lượng;

\- không lệch phiên bản;

\- chỉ có một source of truth.



\> [!TIP]

\> \`src/data/vocabulary-en.ts\` là **\*\*shared read-only dataset\*\***.



**---**



**# 🔐 Core files — không tự ý sửa**



\`\`\`text

app/\_layout.tsx

app/(tabs)/\_layout.tsx



src/contexts/AuthContext.tsx

src/contexts/LearningContext.tsx



src/services/supabase.ts



supabase/migrations/



package.json

app.config.js

eas.json

tsconfig.json

\`\`\`



Khi cần thay đổi shared/core:



\`\`\`text

Trao đổi trong nhóm

↓

Thống nhất interface

↓

Backend/Core cập nhật

↓

Feature sử dụng

\`\`\`



**---**



**# 🚀 Quick Start**



**## Cài dependency**



\`\`\`bash

npm install

\`\`\`



**## Tạo \`.env\`**



Windows PowerShell:



\`\`\`powershell

Copy-Item .env.example .env

\`\`\`



Cấu hình:



\`\`\`env

EXPO_PUBLIC_SUPABASE_URL=

EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

\`\`\`



Không commit \`.env\`.



**---**



**## Chạy Web**



\`\`\`bash

npx expo start --web --clear

\`\`\`



Mặc định:



\`\`\`text

http\://localhost:8081

\`\`\`



**---**



**## Test giao diện điện thoại trên Chrome**



\`\`\`text

F12

Ctrl + Shift + M

\`\`\`



**---**



**## Chạy điện thoại thật**



\`\`\`bash

npx expo start --tunnel

\`\`\`



Quét QR bằng Expo Go.



**---**



**## Android Emulator**



\`\`\`bash

npx expo start --android

\`\`\`



**---**



**# ✅ Kiểm tra code**



Trước khi đưa code chung vào project:



\`\`\`bash

npm run typecheck

\`\`\`



\`\`\`bash

npm run validate

\`\`\`



Nếu có team validator:



\`\`\`bash

node scripts/validate-team-structure.mjs

\`\`\`



Kết quả mong muốn:



\`\`\`text

PASS

\`\`\`



**---**



**# 🎨 Quy tắc UI**



Mỗi màn cần kiểm tra:



\`\`\`text

Mobile

Tablet

Desktop Web

\`\`\`



Nên xử lý đủ:



\`\`\`text

Loading

Empty

Error

Normal

Completed

\`\`\`



Dùng design system chung:



\`\`\`text

src/theme/

\`\`\`



Không tự chọn màu và spacing khác hoàn toàn với project.



**---**



**# 🔑 Security**



Không commit:



\`\`\`text

.env

API secret

private token

SUPABASE_SERVICE_ROLE_KEY

AI provider secret

\`\`\`



Không bao giờ đưa service-role key vào Expo frontend.



User data phải được bảo vệ bằng RLS.



**---**



**# ☑️ Checklist trước khi đưa code vào bản chung**



\- [ ] Code đúng folder phụ trách.

\- [ ] Không sửa Core ngoài phạm vi.

\- [ ] Không duplicate dataset 10.000 từ.

\- [ ] Không commit secret.

\- [ ] Không gọi Supabase trực tiếp trong screen nếu đã có service.

\- [ ] Type/interface rõ ràng.

\- [ ] Hạn chế \`any\`.

\- [ ] UI chạy trên mobile.

\- [ ] UI chạy trên web.

\- [ ] Navigation hoạt động.

\- [ ] Loading state có.

\- [ ] Empty state có.

\- [ ] Error state có.

\- [ ] \`npm run typecheck\` PASS.

\- [ ] \`npm run validate\` PASS.

\- [ ] Không phá Home.

\- [ ] Không phá Profile.

\- [ ] Không phá Auth.



**---**



**# 📌 Ownership**



\| Khu vực | Folder | Owner |

\|---|---|---|

\| 🏠 **\*\*Trang chủ / Core UI\*\*** | \`app/(tabs)/home.tsx\`, \`src/components/home/\` | Hải / Core |

\| 📘 **\*\*Bài học\*\*** | \`src/features/lessons/\` | Huy — [@HuyAA-DD]\(https\://github.com/HuyAA-DD) |

\| 🧠 **\*\*Luyện tập\*\*** | \`src/features/practice/\` | Dương — [@smileviel]\(https\://github.com/smileviel) |

\| 💬 **\*\*Gia sư AI\*\*** | \`src/features/tutor/\` | Khánh — [@hdkhanh12]\(https\://github.com/hdkhanh12) |

\| ⚙️ **\*\*Backend\*\*** | \`src/services/\`, \`src/contexts/\`, \`supabase/\` | Hải — [@Hai2310]\(https\://github.com/Hai2310) |

\| 🎨 **\*\*Shared UI\*\*** | \`src/components/common/\` | Core |

\| 🧭 **\*\*Navigation\*\*** | \`app/(tabs)/\_layout.tsx\` | Core |

\| 🎯 **\*\*Theme\*\*** | \`src/theme/\` | Core |

\| 📚 **\*\*10.000 Vocabulary\*\*** | \`src/data/vocabulary-en.ts\` | Shared Read-only |



**---**



**# 🎯 Nguyên tắc quan trọng nhất**



\`\`\`text

Huy

→ Lessons



Dương

→ Practice



Khánh

→ Tutor



Hải

→ Backend / Core



Shared code

→ chỉ thay đổi khi cả nhóm thống nhất

\`\`\`



**---**



\<div *align*="center">



**### 🎓 \*\*HustLingo\*\***



**\*\*Learn clearly · Practice consistently · Progress together\*\***



![Lessons]\(https\://img.shields.io/badge/Lessons-Huy-60A5FA?style=flat-square)

![Practice]\(https\://img.shields.io/badge/Practice-Dương-34D399?style=flat-square)

![Tutor]\(https\://img.shields.io/badge/AI%20Tutor-Khánh-A78BFA?style=flat-square)

![Backend]\(https\://img.shields.io/badge/Backend-Hải-F59E0B?style=flat-square)



**\*\*Expo · React Native · TypeScript · Supabase\*\***



\</div>


---

# 📦 Kiến trúc Data Production mở rộng

> Phần này **chỉ bổ sung kiến trúc dữ liệu mới**, không thay đổi các phần kiến trúc, phân công, backend hoặc cấu trúc feature đã mô tả phía trên.

Mục tiêu của data layer production là phục vụ đầy đủ:

```text
Vocabulary
Grammar
Listening
Speaking
Reading
Writing
TOEIC
IELTS
Topics
Review
Tutor
```

Toàn bộ dữ liệu học tập dùng chung được đặt tại:

```text
src/data/
```

Các feature:

```text
Lessons
Practice
Tutor
```

chỉ import dữ liệu từ `src/data/`, không tự tạo thêm các bộ dữ liệu trùng lặp.

---

## 🗃️ Cấu trúc `src/data/` production

```text
src/data/
│
├── vocabulary/
│   ├── vocabulary-en.ts
│   ├── vocabulary-types.ts
│   ├── vocabulary-topics.ts
│   ├── vocabulary-indexes.ts
│   └── index.ts
│
├── grammar/
│   ├── grammar-a1.ts
│   ├── grammar-a2.ts
│   ├── grammar-b1.ts
│   ├── grammar-b2.ts
│   ├── grammar-c1.ts
│   ├── grammar-types.ts
│   └── index.ts
│
├── listening/
│   ├── dialogues.ts
│   ├── announcements.ts
│   ├── interviews.ts
│   ├── talks.ts
│   ├── questions.ts
│   ├── listening-types.ts
│   └── index.ts
│
├── speaking/
│   ├── daily-topics.ts
│   ├── picture-description.ts
│   ├── opinion-prompts.ts
│   ├── interview-prompts.ts
│   ├── pronunciation.ts
│   ├── rubrics.ts
│   ├── speaking-types.ts
│   └── index.ts
│
├── reading/
│   ├── short-passages.ts
│   ├── articles.ts
│   ├── emails-notices.ts
│   ├── academic-passages.ts
│   ├── questions.ts
│   ├── reading-types.ts
│   └── index.ts
│
├── writing/
│   ├── sentence-building.ts
│   ├── email-prompts.ts
│   ├── paragraph-prompts.ts
│   ├── essay-prompts.ts
│   ├── ielts-writing.ts
│   ├── rubrics.ts
│   ├── writing-types.ts
│   └── index.ts
│
├── toeic/
│   ├── listening-part-1.ts
│   ├── listening-part-2.ts
│   ├── listening-part-3.ts
│   ├── listening-part-4.ts
│   ├── reading-part-5.ts
│   ├── reading-part-6.ts
│   ├── reading-part-7.ts
│   ├── toeic-types.ts
│   └── index.ts
│
├── ielts/
│   ├── listening.ts
│   ├── reading.ts
│   ├── speaking-part-1.ts
│   ├── speaking-part-2.ts
│   ├── speaking-part-3.ts
│   ├── writing-task-1.ts
│   ├── writing-task-2.ts
│   ├── ielts-types.ts
│   └── index.ts
│
├── topics/
│   ├── topics.ts
│   ├── topic-mapping.ts
│   └── index.ts
│
├── review/
│   ├── review-config.ts
│   ├── spaced-repetition.ts
│   └── index.ts
│
└── index.ts
```

---

# 📚 Vocabulary Production

Bộ vocabulary production vẫn giữ mục tiêu:

```text
10.000 từ tiếng Anh
```

nhưng dữ liệu phải được chuẩn hóa theo schema rõ ràng.

Ví dụ:

```ts
export interface VocabularyEntry {
  id: string;
  term: string;

  translation: string;

  partOfSpeech:
    | "noun"
    | "verb"
    | "adjective"
    | "adverb"
    | "pronoun"
    | "preposition"
    | "conjunction"
    | "determiner"
    | "interjection"
    | "other";

  ipa?: string;

  exampleSentence: string;
  exampleTranslation?: string;

  level:
    | "A1"
    | "A2"
    | "B1"
    | "B2"
    | "C1"
    | "C2";

  topic: string;

  examTags: Array<
    | "general"
    | "toeic"
    | "ielts"
  >;

  frequencyRank?: number;

  synonyms?: string[];
  antonyms?: string[];
  collocations?: string[];

  source?: string;
  confidence?: "high" | "medium" | "low";
  verified?: boolean;
}
```

### Nguyên tắc production

Không coi một từ là:

```text
CEFR chuẩn
IELTS chuẩn
TOEIC chuẩn
```

chỉ vì được sinh tự động.

Nếu chưa có nguồn xác minh:

```ts
verified: false
```

và sử dụng:

```ts
confidence: "medium"
```

hoặc:

```ts
confidence: "low"
```

Các metadata quan trọng cần kiểm tra:

```text
term
translation
partOfSpeech
IPA
CEFR
topic
example
examTags
frequencyRank
```

---

# 🏷️ Hệ thống chủ đề dùng chung

Data không gom gần như toàn bộ vocabulary vào một topic.

Các topic production:

```text
Daily Life
Family
Education
University
Work & Career
Business
Technology
Travel
Food & Drink
Health
Environment
Science
Society
Culture
Media
Transportation
Shopping
Finance
Communication
Housing
Sports
Entertainment
Nature
Government
Academic English
```

Mỗi record phải có topic phù hợp với nghĩa chính đang được dạy.

Ví dụ:

```text
airport
→ Travel

salary
→ Work & Career / Finance

algorithm
→ Technology

pollution
→ Environment

lecture
→ Education / University
```

---

# 🎧 Listening Data

Listening không chỉ chứa transcript.

Một record production cần đủ metadata để có thể dùng trực tiếp trong Bài học hoặc Luyện tập.

```ts
export interface ListeningItem {
  id: string;

  title: string;

  level:
    | "A1"
    | "A2"
    | "B1"
    | "B2"
    | "C1";

  topic: string;

  type:
    | "dialogue"
    | "announcement"
    | "interview"
    | "talk"
    | "conversation";

  transcript: string;

  audioAsset?: string;

  speakers?: Array<{
    id: string;
    gender?: "male" | "female";
    accent?: string;
  }>;

  speed?: number;

  questions: ListeningQuestion[];

  examTags?: Array<
    | "general"
    | "toeic"
    | "ielts"
  >;
}
```

### Loại câu hỏi Listening

```text
Main Idea
Detail
Inference
Purpose
Speaker Intention
Vocabulary in Context
True / False
Multiple Choice
```

Ví dụ:

```ts
{
  id: "listen-b1-travel-001",
  title: "Checking in at the airport",
  level: "B1",
  topic: "Travel",
  type: "dialogue",
  transcript: "...",
  audioAsset: "assets/audio/listening/...",
  speed: 1,
  questions: [
    {
      type: "main_idea",
      question: "...",
      options: [
        "...",
        "...",
        "...",
        "..."
      ],
      answer: 1,
      explanation: "..."
    }
  ],
  examTags: ["general"]
}
```

> Audio thật phải sử dụng recording, TTS hoặc nguồn có quyền sử dụng phù hợp. Không gắn nhãn audio là TOEIC/IELTS official nếu không phải nội dung chính thức được cấp phép.

---

# 🗣️ Speaking Data

Speaking cần có nhiều loại bài khác nhau.

```text
Daily Conversation
Picture Description
Question & Answer
Interview
Opinion
Presentation
Role Play
IELTS Speaking
```

Schema:

```ts
export interface SpeakingPrompt {
  id: string;

  title: string;

  level: string;
  topic: string;

  type:
    | "conversation"
    | "picture-description"
    | "interview"
    | "opinion"
    | "presentation"
    | "role-play"
    | "ielts";

  prompt: string;

  preparationSeconds?: number;
  speakingSeconds?: number;

  usefulVocabulary?: string[];
  targetGrammar?: string[];
  pronunciationTargets?: string[];

  sampleAnswer?: string;

  rubric?: {
    pronunciation?: number;
    fluency?: number;
    grammar?: number;
    vocabulary?: number;
    coherence?: number;
  };

  examTags?: string[];
}
```

Speaking production cần hỗ trợ:

```text
Pronunciation
Fluency
Grammar
Vocabulary
Coherence
Task Completion
```

---

# 📖 Reading Data

Reading được chia theo loại nội dung:

```text
Short Passage
Article
Email
Notice
Advertisement
Academic Passage
TOEIC Reading
IELTS Reading
```

Schema:

```ts
export interface ReadingPassage {
  id: string;

  title: string;

  level: string;
  topic: string;

  type:
    | "short-passage"
    | "article"
    | "email"
    | "notice"
    | "academic"
    | "toeic"
    | "ielts";

  text: string;

  wordCount: number;

  questions: ReadingQuestion[];

  vocabulary?: string[];

  examTags?: string[];
}
```

Các dạng câu hỏi:

```text
Main Idea
Detail
Inference
Vocabulary in Context
Reference
Matching
Multiple Choice
True / False / Not Given
Yes / No / Not Given
Sentence Completion
Summary Completion
Heading Matching
```

---

# ✍️ Writing Data

Writing phải có prompt, yêu cầu, giới hạn từ, thời gian và rubric.

```ts
export interface WritingPrompt {
  id: string;

  title: string;

  level: string;
  topic: string;

  type:
    | "sentence"
    | "email"
    | "paragraph"
    | "essay"
    | "ielts-task-1"
    | "ielts-task-2";

  prompt: string;

  minimumWords?: number;
  recommendedMinutes?: number;

  usefulVocabulary?: string[];
  targetGrammar?: string[];

  sampleAnswer?: string;

  rubric?: {
    taskAchievement?: number;
    coherence?: number;
    vocabulary?: number;
    grammar?: number;
  };

  examTags?: string[];
}
```

Các dạng bài:

```text
Sentence Building
Paragraph Writing
Email
Description
Opinion Essay
Discussion Essay
Problem / Solution
Advantages / Disadvantages
IELTS Writing Task 1
IELTS Writing Task 2
```

---

# 📐 Grammar Data

Grammar được chia theo CEFR:

```text
A1
A2
B1
B2
C1
```

Mỗi bài grammar nên có:

```ts
export interface GrammarLesson {
  id: string;

  title: string;
  level: string;

  explanation: string;

  formula?: string;

  examples: Array<{
    sentence: string;
    translation?: string;
  }>;

  commonMistakes?: string[];

  exercises?: string[];

  relatedVocabulary?: string[];

  tags?: string[];
}
```

---

# 🟦 TOEIC Data

TOEIC được tổ chức theo đúng từng phần của engine luyện thi:

```text
TOEIC
│
├── Listening
│   ├── Part 1 — Photographs
│   ├── Part 2 — Question-Response
│   ├── Part 3 — Conversations
│   └── Part 4 — Talks
│
└── Reading
    ├── Part 5 — Incomplete Sentences
    ├── Part 6 — Text Completion
    └── Part 7 — Reading Comprehension
```

Data cần hỗ trợ:

```text
question
options
answer
explanation
difficulty
topic
part
skill
time
```

Không dùng tag `toeic` ngẫu nhiên cho vocabulary.

Vocabulary TOEIC phải được map dựa trên:

```text
Business
Office
Meetings
Finance
Travel
Transportation
Shopping
Customer Service
Human Resources
Marketing
Communication
```

và nguồn/reference rõ ràng khi có.

---

# 🟪 IELTS Data

IELTS:

```text
IELTS
│
├── Listening
├── Reading
├── Speaking
│   ├── Part 1
│   ├── Part 2
│   └── Part 3
│
└── Writing
    ├── Task 1
    └── Task 2
```

Data IELTS không chỉ là vocabulary tag.

Nó phải hỗ trợ:

```text
Academic topics
Question types
Band-oriented rubric
Speaking prompts
Writing prompts
Reading passages
Listening tasks
```

---

# 🔁 Review & Spaced Repetition Data

Review dùng dữ liệu từ:

```text
Vocabulary
Grammar
Lessons
Practice
```

Luồng:

```text
User làm bài
↓
Sai / chưa nhớ
↓
Need Review
↓
Review Queue
↓
Spaced Repetition
↓
Mastered
```

Ví dụ trạng thái:

```ts
export interface ReviewState {
  itemId: string;

  itemType:
    | "vocabulary"
    | "grammar"
    | "lesson";

  status:
    | "new"
    | "learning"
    | "need-review"
    | "mastered";

  repetitions: number;

  interval: number;

  easeFactor: number;

  nextReviewAt: string;

  lastReviewedAt?: string;
}
```

---

# 🔗 Data nào phục vụ tab nào?

## 📘 Bài học — Huy

```text
Lessons
↓
Vocabulary
Grammar
Listening
Speaking
Reading
Writing
Topics
```

Huy sử dụng:

```text
src/data/vocabulary/
src/data/grammar/
src/data/listening/
src/data/speaking/
src/data/reading/
src/data/writing/
src/data/topics/
```

Feature-specific mapping vẫn để tại:

```text
src/features/lessons/data/
```

---

## 🧠 Luyện tập — Dương

```text
Practice
↓
Vocabulary Quiz
Grammar Quiz
Listening Practice
Speaking Practice
Reading Practice
Writing Practice
Flashcard
Review
TOEIC
IELTS
```

Dương sử dụng:

```text
src/data/vocabulary/
src/data/grammar/
src/data/listening/
src/data/speaking/
src/data/reading/
src/data/writing/
src/data/toeic/
src/data/ielts/
src/data/review/
```

Feature-specific configuration:

```text
src/features/practice/data/
```

---

## 💬 Gia sư AI — Khánh

Gia sư AI có thể sử dụng data chung để tạo ngữ cảnh học:

```text
Vocabulary
Topic
Grammar target
Speaking prompt
Scenario
```

Khánh sử dụng:

```text
src/data/vocabulary/
src/data/speaking/
src/data/topics/
src/features/tutor/data/
```

Tutor-specific data:

```text
tutors
scenarios
demoMessages
persona configuration
conversation context
```

---

## ⚙️ Backend/Core — Hải

Backend không sửa nội dung lesson của các thành viên.

Backend chịu trách nhiệm lưu trạng thái liên quan tới data:

```text
learning_progress
saved_words
review_state
completed_lessons
exam_results
user_settings
subscriptions
```

Luồng:

```text
Static Learning Data
        │
        ▼
Frontend Feature
        │
        ▼
Context / Service
        │
        ▼
Supabase User State
```

Nội dung học và trạng thái user phải tách riêng.

---

# 🧪 Data Validation trước Production

Mọi data mới cần qua validation trước khi được sử dụng trong app.

Validator cần kiểm tra:

```text
ID unique
Required fields
Valid CEFR
Valid topic
Valid question type
Answer tồn tại
Answer nằm trong options
Explanation không rỗng khi yêu cầu
Không duplicate question
Không duplicate vocabulary
Exam tag hợp lệ
Audio asset tồn tại nếu record yêu cầu audio
Word count hợp lệ
Time limit hợp lệ
```

Cấu trúc script:

```text
scripts/
├── validate-vocabulary.mjs
├── validate-grammar.mjs
├── validate-listening.mjs
├── validate-speaking.mjs
├── validate-reading.mjs
├── validate-writing.mjs
├── validate-toeic.mjs
├── validate-ielts.mjs
└── validate-learning-data.mjs
```

Có thể chạy chung:

```bash
node scripts/validate-learning-data.mjs
```

Kết quả production mong muốn:

```text
Vocabulary      PASS
Grammar         PASS
Listening       PASS
Speaking        PASS
Reading         PASS
Writing         PASS
TOEIC           PASS
IELTS            PASS

Duplicate IDs   0
Invalid records 0
```

---

# ✅ Nguyên tắc Data Production

```text
1 source of truth
+
typed data
+
validated data
+
topic mapping
+
CEFR metadata
+
exam-specific data
+
không duplicate
+
không gắn nhãn "official" nếu không có nguồn
```

Data layer cuối cùng phục vụ:

```text
Lesson
+
Practice
+
Review
+
TOEIC / IELTS
+
Tutor
+
Progress
```

mà không để mỗi feature tự xây một bộ dữ liệu riêng.

