import type { ChoiceQuestion, PracticeLevel } from '../types';

export interface ListeningItem {
  id: string;
  level: PracticeLevel;
  title: string;
  context: string;
  transcript: string;
  questions: ChoiceQuestion[];
}

export interface ReadingItem {
  id: string;
  level: PracticeLevel;
  title: string;
  passage: string;
  questions: ChoiceQuestion[];
}

export interface SpeakingItem {
  id: string;
  level: PracticeLevel;
  type: 'repeat' | 'answer' | 'describe';
  title: string;
  prompt: string;
  /** What a good answer sounds like; read aloud with text-to-speech for comparison. */
  sample: string;
  vi?: string;
  tips: string[];
}

export interface WritingItem {
  id: string;
  level: PracticeLevel;
  title: string;
  prompt: string;
  minWords: number;
  maxWords?: number;
  minutes: number;
  usefulPhrases: string[];
  checklist: string[];
  sampleAnswer: string;
}

export const LISTENING_ITEMS: ListeningItem[] = [
  {
    id: 'listen-library', level: 'A1', title: 'At the university library', context: 'Hai sinh viên nói chuyện trong thư viện.',
    transcript: 'Excuse me. Is this seat available? Yes, it is. I am waiting for my friend, but you can sit here until she arrives. Thank you. I only need it for an hour.',
    questions: [
      { id: 'listen-library-1', kind: 'detail', prompt: 'Where does the conversation happen?', options: ['At a library', 'At an airport', 'At a restaurant', 'At a hospital'], answers: [0], explanation: 'Tiêu đề và ngữ cảnh: “at the university library”; người hỏi xin ngồi chỗ trống.' },
      { id: 'listen-library-2', kind: 'detail', prompt: 'How long does the man need the seat?', options: ['Ten minutes', 'One hour', 'All day', 'Until the evening'], answers: [1], explanation: '“I only need it for an hour.”' },
      { id: 'listen-library-3', kind: 'inference', prompt: 'Who will probably come later?', options: ['A librarian', 'The woman’s friend', 'A teacher', 'The man’s brother'], answers: [1], explanation: '“I am waiting for my friend… until she arrives” → bạn của cô gái sẽ tới.' },
    ],
  },
  {
    id: 'listen-coffee', level: 'A2', title: 'Ordering coffee', context: 'Một khách hàng gọi đồ ở quán cà phê.',
    transcript: 'Good morning. Could I have a large latte and a cheese sandwich, please? Sure. Would you like the sandwich heated? Yes, please. That will be seven dollars fifty. Can I pay by card? Of course.',
    questions: [
      { id: 'listen-coffee-1', kind: 'detail', prompt: 'What drink does the customer order?', options: ['Tea', 'A large latte', 'Orange juice', 'Water'], answers: [1], explanation: '“Could I have a large latte…”' },
      { id: 'listen-coffee-2', kind: 'detail', prompt: 'How much does the customer pay?', options: ['$5.70', '$7.15', '$7.50', '$17.50'], answers: [2], explanation: '“That will be seven dollars fifty” = $7.50.' },
      { id: 'listen-coffee-3', kind: 'inference', prompt: 'How will the customer probably pay?', options: ['In cash', 'By card', 'With a voucher', 'Later'], answers: [1], explanation: '“Can I pay by card?” — “Of course.”' },
    ],
  },
  {
    id: 'listen-meeting', level: 'B1', title: 'Project meeting', context: 'Trưởng nhóm thông báo thay đổi lịch thuyết trình.',
    transcript: 'Quick update, everyone. The client asked for more time to review the prototype, so we have agreed to move the presentation from Tuesday to Thursday. Please send your final slides to Linh by Wednesday at noon, so she can combine them into one file. If you need help with the charts, talk to Minh this afternoon.',
    questions: [
      { id: 'listen-meeting-1', kind: 'main-idea', prompt: 'What is the main purpose of the announcement?', options: ['To cancel the project', 'To explain a schedule change', 'To introduce a new client', 'To review the prototype'], answers: [1], explanation: 'Cả đoạn nói về việc dời buổi thuyết trình và hạn nộp slide mới.' },
      { id: 'listen-meeting-2', kind: 'detail', prompt: 'Why was the presentation moved?', options: ['The room was unavailable', 'The client needed more time', 'A team member was sick', 'The slides were lost'], answers: [1], explanation: '“The client asked for more time to review the prototype.”' },
      { id: 'listen-meeting-3', kind: 'detail', prompt: 'When must the slides be sent?', options: ['Tuesday morning', 'Wednesday at noon', 'Thursday at noon', 'This afternoon'], answers: [1], explanation: '“…by Wednesday at noon.”' },
      { id: 'listen-meeting-4', kind: 'inference', prompt: 'What is Minh probably good at?', options: ['Writing reports', 'Making charts', 'Talking to clients', 'Booking rooms'], answers: [1], explanation: '“If you need help with the charts, talk to Minh” → Minh giỏi làm biểu đồ.' },
    ],
  },
  {
    id: 'listen-campus-tour', level: 'B1', title: 'Campus orientation', context: 'Hướng dẫn viên giới thiệu khuôn viên cho tân sinh viên.',
    transcript: 'Welcome to your first day on campus. On your left is the main library, which is open until ten at night during exam weeks. Straight ahead is the student centre, where you can get your ID card. Remember to bring a photo and your admission letter. The cafeteria is on the second floor, and it is usually quiet before eleven thirty.',
    questions: [
      { id: 'listen-campus-1', kind: 'detail', prompt: 'Where can students get their ID card?', options: ['At the library', 'At the student centre', 'In the cafeteria', 'At the main gate'], answers: [1], explanation: '“…the student centre, where you can get your ID card.”' },
      { id: 'listen-campus-2', kind: 'detail', prompt: 'What should students bring?', options: ['A photo and an admission letter', 'Cash and a passport', 'A laptop', 'Their timetable'], answers: [0], explanation: '“Remember to bring a photo and your admission letter.”' },
      { id: 'listen-campus-3', kind: 'inference', prompt: 'When is the best time to eat without crowds?', options: ['At noon', 'Before 11:30', 'After 1 p.m.', 'Late at night'], answers: [1], explanation: '“…usually quiet before eleven thirty.”' },
    ],
  },
  {
    id: 'listen-podcast', level: 'B2', title: 'A podcast about sleep', context: 'Đoạn trích podcast về giấc ngủ của sinh viên.',
    transcript: 'Many students believe that staying up late to study is the most efficient way to prepare for exams. However, research suggests the opposite. When we sleep, the brain organises new information and strengthens memories. Students who cut their sleep short often remember less, even though they spent more hours with their books. So, if you want better results, a regular bedtime may be more useful than an extra cup of coffee.',
    questions: [
      { id: 'listen-podcast-1', kind: 'main-idea', prompt: 'What is the speaker’s main point?', options: ['Coffee helps memory', 'Sleep supports learning', 'Exams are too difficult', 'Students should study at night'], answers: [1], explanation: 'Người nói phản bác việc thức khuya và kết luận ngủ đều đặn giúp học tốt hơn.' },
      { id: 'listen-podcast-2', kind: 'detail', prompt: 'What happens in the brain during sleep, according to the speaker?', options: ['It stops working', 'It organises information', 'It forgets old memories', 'It needs caffeine'], answers: [1], explanation: '“…the brain organises new information and strengthens memories.”' },
      { id: 'listen-podcast-3', kind: 'inference', prompt: 'What would the speaker most likely recommend the night before an exam?', options: ['Studying until 3 a.m.', 'Drinking more coffee', 'Going to bed at a normal time', 'Skipping dinner'], answers: [2], explanation: '“…a regular bedtime may be more useful than an extra cup of coffee.”' },
      { id: 'listen-podcast-4', kind: 'vocabulary-in-context', prompt: '“Cut their sleep short” means…', options: ['sleep less than they need', 'sleep in a short bed', 'take a short nap', 'sleep during class'], answers: [0], explanation: '“cut something short” = làm cho ngắn lại, ở đây là ngủ ít hơn cần thiết.' },
    ],
  },
  {
    id: 'listen-lecture', level: 'C1', title: 'Lecture: urban heat islands', context: 'Trích đoạn bài giảng về hiện tượng đảo nhiệt đô thị.',
    transcript: 'Cities are often several degrees warmer than the surrounding countryside, a phenomenon known as the urban heat island. Dark surfaces such as asphalt absorb sunlight during the day and release it slowly at night, while the lack of vegetation reduces natural cooling. Interestingly, the effect is usually strongest after sunset rather than at midday. Planners are responding with reflective roofs and more street trees, although critics argue that these measures address symptoms rather than the underlying pattern of dense, car-dependent development.',
    questions: [
      { id: 'listen-lecture-1', kind: 'detail', prompt: 'According to the lecture, when is the heat island effect usually strongest?', options: ['At midday', 'After sunset', 'In early morning', 'During rainstorms'], answers: [1], explanation: '“…the effect is usually strongest after sunset rather than at midday.”' },
      { id: 'listen-lecture-2', kind: 'detail', prompt: 'Which TWO causes are mentioned? (Chọn 2)', options: ['Dark surfaces absorbing heat', 'Too many rivers', 'A lack of vegetation', 'High altitude'], answers: [0, 2], explanation: 'Bài nhắc “dark surfaces such as asphalt” và “the lack of vegetation”.' },
      { id: 'listen-lecture-3', kind: 'inference', prompt: 'What do the critics imply?', options: ['Street trees are too expensive', 'The real problem is how cities are designed', 'Reflective roofs make cities colder in winter', 'Heat islands do not exist'], answers: [1], explanation: 'Họ cho rằng giải pháp chỉ xử lý “triệu chứng”, còn nguyên nhân là mô hình đô thị dày đặc, phụ thuộc ô tô.' },
    ],
  },
];

export const READING_ITEMS: ReadingItem[] = [
  {
    id: 'read-day', level: 'A1', title: 'A day at university',
    passage: 'Mai is a first-year engineering student. She usually arrives at campus at eight in the morning. After two classes, she has lunch with her classmates in the canteen. In the afternoon, she studies in the library before taking the bus home at five.',
    questions: [
      { id: 'read-day-1', kind: 'detail', prompt: 'Where does Mai study in the afternoon?', options: ['At home', 'In the library', 'In a café', 'On the bus'], answers: [1], explanation: '“In the afternoon, she studies in the library…”' },
      { id: 'read-day-2', kind: 'detail', prompt: 'Who does Mai have lunch with?', options: ['Her parents', 'Her teacher', 'Her classmates', 'Nobody'], answers: [2], explanation: '“…she has lunch with her classmates in the canteen.”' },
      { id: 'read-day-3', kind: 'main-idea', prompt: 'What is the text mainly about?', options: ['Mai’s daily routine', 'Engineering subjects', 'Bus timetables', 'The university canteen'], answers: [0], explanation: 'Đoạn văn kể lại các hoạt động trong một ngày của Mai.' },
    ],
  },
  {
    id: 'read-notice', level: 'A2', title: 'Notice: library hours',
    passage: 'LIBRARY NOTICE. From 1 December, the library will open at 7:30 a.m. instead of 8:00 a.m. on weekdays. During the exam period (10–24 December), it will stay open until 11 p.m. Group study rooms must be booked online at least one day in advance. Food is not allowed in the reading rooms, but drinks in closed bottles are fine.',
    questions: [
      { id: 'read-notice-1', kind: 'detail', prompt: 'What changes from 1 December?', options: ['The library closes earlier', 'The library opens earlier on weekdays', 'Food is allowed', 'Rooms are free'], answers: [1], explanation: '“…open at 7:30 a.m. instead of 8:00 a.m. on weekdays.”' },
      { id: 'read-notice-2', kind: 'detail', prompt: 'How can students use a group study room?', options: ['Just walk in', 'Book it online one day before', 'Ask a teacher', 'Pay at the desk'], answers: [1], explanation: '“…must be booked online at least one day in advance.”' },
      { id: 'read-notice-3', kind: 'inference', prompt: 'Which can you bring into a reading room?', options: ['A sandwich', 'A bottle of water with a lid', 'An open cup of coffee', 'A pizza'], answers: [1], explanation: 'Chỉ đồ uống trong chai có nắp (“closed bottles”) được phép.' },
    ],
  },
  {
    id: 'read-tech', level: 'B1', title: 'Technology and learning',
    passage: 'Digital tools can make learning more flexible, but technology alone does not guarantee better results. Students still need clear goals, active practice and regular feedback. A flashcard app, for example, is only useful if learners test themselves instead of simply reading the cards. The most effective tools are often those that reduce friction and help learners focus on the task itself, rather than those with the most features.',
    questions: [
      { id: 'read-tech-1', kind: 'main-idea', prompt: 'What is the main idea?', options: ['Technology always improves grades', 'Digital tools work best with good learning habits', 'Students should avoid online tools', 'Feedback is unnecessary'], answers: [1], explanation: 'Công nghệ chỉ hiệu quả khi đi kèm mục tiêu, luyện tập chủ động và phản hồi.' },
      { id: 'read-tech-2', kind: 'detail', prompt: 'According to the text, when is a flashcard app useful?', options: ['When it has many colours', 'When learners test themselves', 'When it is free', 'When teachers use it'], answers: [1], explanation: '“…only useful if learners test themselves instead of simply reading the cards.”' },
      { id: 'read-tech-3', kind: 'vocabulary-in-context', prompt: 'In the passage, “reduce friction” is closest in meaning to…', options: ['make things easier to start and continue', 'make devices cooler', 'reduce the price', 'stop arguments'], answers: [0], explanation: '“friction” ở đây là những trở ngại nhỏ khiến việc học khó bắt đầu/duy trì.' },
    ],
  },
  {
    id: 'read-remote', level: 'B2', title: 'The rise of remote internships',
    passage: 'Remote internships expanded rapidly after 2020, and many companies have kept them. Supporters point out that students in smaller cities can now gain experience with firms they could never have reached in person, and that they save on rent and travel. Critics, however, note that remote interns often miss the informal learning that happens in an office: overhearing how a senior colleague handles a difficult call, or asking a quick question without booking a meeting. Some employers are experimenting with hybrid schemes in which interns spend the first two weeks on site before working from home.',
    questions: [
      { id: 'read-remote-1', kind: 'detail', prompt: 'Which TWO benefits of remote internships are mentioned? (Chọn 2)', options: ['Access to companies in other cities', 'Higher salaries', 'Lower living and travel costs', 'Shorter working hours'], answers: [0, 2], explanation: 'Bài nêu: tiếp cận công ty ở xa và tiết kiệm tiền thuê nhà, đi lại.' },
      { id: 'read-remote-2', kind: 'detail', prompt: 'What do critics say remote interns miss?', options: ['Free meals', 'Informal learning in the office', 'Formal training courses', 'Their university classes'], answers: [1], explanation: '“…miss the informal learning that happens in an office…”' },
      { id: 'read-remote-3', kind: 'purpose', prompt: 'Why does the writer mention hybrid schemes?', options: ['To show one way employers address the problem', 'To argue that offices are unnecessary', 'To criticise students', 'To describe internships before 2020'], answers: [0], explanation: 'Mô hình kết hợp là cách doanh nghiệp thử khắc phục nhược điểm vừa nêu.' },
      { id: 'read-remote-4', kind: 'inference', prompt: 'The writer’s attitude towards remote internships is best described as…', options: ['strongly negative', 'balanced', 'completely enthusiastic', 'uninterested'], answers: [1], explanation: 'Tác giả trình bày cả ưu điểm, nhược điểm và giải pháp → cân bằng.' },
    ],
  },
  {
    id: 'read-ai', level: 'C1', title: 'Automation and the value of judgement',
    passage: 'Forecasts about automation tend to swing between utopia and catastrophe, yet the evidence so far points to something less dramatic: tasks, not whole occupations, are being automated. A radiologist’s day, for instance, involves not only reading scans but also consulting colleagues, explaining results to patients and deciding which anomalies merit further investigation. Software has become remarkably good at the first of these, but the others depend on contextual judgement that is difficult to codify. The paradox is that, as routine analysis becomes cheaper, the premium on such judgement may actually rise.',
    questions: [
      { id: 'read-ai-1', kind: 'main-idea', prompt: 'What is the writer’s central claim?', options: ['Automation will soon replace most jobs', 'Automation mainly affects specific tasks within jobs', 'Radiologists are no longer needed', 'Forecasts about automation are usually accurate'], answers: [1], explanation: '“…tasks, not whole occupations, are being automated.”' },
      { id: 'read-ai-2', kind: 'purpose', prompt: 'Why does the writer describe a radiologist’s day?', options: ['To illustrate that a job contains many different tasks', 'To criticise medical software', 'To recommend a career', 'To show radiologists work too hard'], answers: [0], explanation: 'Ví dụ cho thấy một nghề gồm nhiều nhiệm vụ, chỉ một phần dễ tự động hóa.' },
      { id: 'read-ai-3', kind: 'vocabulary-in-context', prompt: '“Merit” in the passage is closest in meaning to…', options: ['deserve', 'avoid', 'measure', 'reward'], answers: [0], explanation: '“which anomalies merit further investigation” = bất thường nào đáng/xứng đáng được kiểm tra thêm.' },
      { id: 'read-ai-4', kind: 'inference', prompt: 'What does “the paradox” refer to?', options: ['Cheaper analysis may make human judgement more valuable', 'Software is expensive but popular', 'Doctors dislike technology', 'Forecasts are both positive and negative'], answers: [0], explanation: 'Nghịch lý: phân tích thường quy càng rẻ thì giá trị của khả năng phán đoán càng tăng.' },
    ],
  },
];

export const SPEAKING_ITEMS: SpeakingItem[] = [
  { id: 'speak-library', level: 'A1', type: 'repeat', title: 'Asking for directions', prompt: 'Nghe câu mẫu, sau đó ghi âm và nói lại thật tự nhiên.', sample: 'Could you tell me where the library is?', vi: 'Bạn có thể chỉ cho tôi thư viện ở đâu không?', tips: ['Lên giọng nhẹ ở cuối câu hỏi lịch sự.', 'Nối âm: “tell me” → /telmi/.'] },
  { id: 'speak-coffee', level: 'A2', type: 'repeat', title: 'Ordering politely', prompt: 'Nghe câu mẫu, sau đó ghi âm và nói lại.', sample: 'I would like to order a cup of coffee, please.', vi: 'Tôi muốn gọi một cốc cà phê.', tips: ['“would like” thường được nói nhanh thành “I’d like”.', 'Nhấn vào “coffee”.'] },
  { id: 'speak-intro', level: 'A2', type: 'answer', title: 'Introduce yourself', prompt: 'Tell me about yourself: your name, what you study and one hobby. (30–45 giây)', sample: 'Hi, my name is Linh. I am a second-year student at Hanoi University of Science and Technology, and I study computer science. In my free time I enjoy playing badminton with my friends, because it helps me relax after class.', tips: ['Dùng cấu trúc: Tên → Học gì → Sở thích + lý do.', 'Nối các ý bằng “and”, “because”.'] },
  { id: 'speak-project', level: 'B1', type: 'repeat', title: 'Talking about your role', prompt: 'Nghe câu mẫu, sau đó ghi âm và nói lại.', sample: 'I am responsible for presenting the main results of our project.', vi: 'Tôi phụ trách trình bày các kết quả chính của dự án.', tips: ['Nhấn “responsible” ở âm tiết thứ hai: re-SPON-si-ble.', 'Ngắt hơi sau “results”.'] },
  { id: 'speak-picture', level: 'B1', type: 'describe', title: 'Describe a busy place', prompt: 'Describe a place in your city that is always busy. Say where it is, what people do there and how you feel about it. (45–60 giây)', sample: 'One place that is always busy is the Old Quarter in Hanoi. It is right in the centre of the city, and the narrow streets are full of motorbikes, street food stalls and small shops. People go there to eat, shop and meet friends, especially in the evening. Personally, I love the energy, although it can be a little too noisy when I want to relax.', tips: ['Dùng thì hiện tại đơn cho thói quen: people go, it is.', 'Kết bằng cảm nhận cá nhân: Personally, … although …'] },
  { id: 'speak-opinion', level: 'B2', type: 'answer', title: 'Give an opinion', prompt: 'Do you think university students should have part-time jobs? Give your opinion with two reasons. (60 giây)', sample: 'In my opinion, having a part-time job can be very valuable for university students, as long as it does not take too much time. First, it teaches practical skills such as time management and teamwork, which are hard to learn in a classroom. Second, earning some money makes students more independent. However, I think students should limit their working hours, so that their studies come first.', tips: ['Mở đầu rõ quan điểm: In my opinion, …', 'Dùng First, Second, However để tổ chức ý.'] },
  { id: 'speak-ielts-cue', level: 'C1', type: 'describe', title: 'IELTS Part 2 cue card', prompt: 'Describe a skill you learned that took a long time. You should say: what the skill is, how you learned it, why it took a long time, and explain how you feel about it now. (1–2 phút)', sample: 'I would like to talk about learning to play the guitar, which honestly took me far longer than I expected. I started in high school by watching online tutorials, but progress was painfully slow because I never practised consistently. What really made the difference was joining a small band at university, since I suddenly had a reason to practise every day. Looking back, I am proud that I did not give up, and the experience taught me that steady practice beats occasional bursts of effort.', tips: ['Bám theo 4 gợi ý của cue card.', 'Dùng từ nối nâng cao: honestly, what really made the difference, looking back.'] },
];

export const SPEAKING_RUBRIC = [
  { id: 'pronunciation', label: 'Phát âm' },
  { id: 'fluency', label: 'Độ trôi chảy' },
  { id: 'grammar', label: 'Ngữ pháp' },
  { id: 'vocabulary', label: 'Từ vựng' },
] as const;

export const WRITING_ITEMS: WritingItem[] = [
  { id: 'write-routine', level: 'A1', title: 'My daily routine', prompt: 'Write 5–7 sentences about a normal day in your life.', minWords: 40, maxWords: 90, minutes: 10, usefulPhrases: ['usually', 'every day', 'after that', 'in the evening', 'at the weekend'], checklist: ['Dùng thì hiện tại đơn (I get up, she goes…).', 'Có từ chỉ thời gian.', 'Viết hoa đầu câu, có dấu chấm cuối câu.'], sampleAnswer: 'I usually get up at six o’clock. I have breakfast with my family and then I take the bus to university. My classes start at seven thirty. After that, I have lunch with my friends in the canteen. In the evening, I do my homework and watch a short video in English. I go to bed at about eleven.' },
  { id: 'write-email', level: 'A2', title: 'Email to a classmate', prompt: 'You missed a class yesterday. Write an email to a classmate. Say why you missed it, ask what you missed and suggest a time to meet.', minWords: 60, maxWords: 110, minutes: 15, usefulPhrases: ['Hi', 'I’m sorry', 'because', 'Could you tell me', 'Are you free', 'Best wishes'], checklist: ['Có lời chào và lời kết.', 'Trả lời đủ 3 ý: lý do, hỏi bài, hẹn gặp.', 'Dùng câu hỏi lịch sự “Could you…?”'], sampleAnswer: 'Hi Nam,\n\nI’m sorry I missed the English class yesterday. I had a bad cold and stayed at home. Could you tell me what the teacher talked about? Was there any homework? I would also like to borrow your notes if possible.\n\nAre you free on Thursday afternoon? We could meet at the library at three o’clock.\n\nBest wishes,\nHoa' },
  { id: 'write-university', level: 'B1', title: 'University life', prompt: 'Write a paragraph (100–130 words) about the most useful thing you have learned at university so far, and why.', minWords: 100, maxWords: 150, minutes: 20, usefulPhrases: ['The most useful thing', 'so far', 'For example', 'As a result', 'In the future'], checklist: ['Câu chủ đề nêu rõ điều bạn học được.', 'Ít nhất một ví dụ cụ thể.', 'Câu kết nói về tác dụng trong tương lai.'], sampleAnswer: 'The most useful thing I have learned at university so far is how to work in a team. In high school, I usually studied alone, so group projects were difficult for me at first. For example, in my first programming project, our team wasted a lot of time because nobody planned the tasks. After that experience, we started to divide the work clearly and meet every week to check our progress. As a result, our second project was finished early and received a high mark. I believe this skill will be very important in the future, because almost every job requires people to cooperate and communicate well.' },
  { id: 'write-tech', level: 'B2', title: 'Technology in education', prompt: 'Some people think online learning will replace traditional classrooms. Write an essay (180–220 words) giving your opinion.', minWords: 180, maxWords: 250, minutes: 35, usefulPhrases: ['It is often argued that', 'On the one hand', 'On the other hand', 'In my view', 'To sum up'], checklist: ['Mở bài nêu quan điểm rõ ràng.', 'Hai đoạn thân bài, mỗi đoạn một ý chính + ví dụ.', 'Kết luận nhắc lại quan điểm.', 'Dùng từ nối giữa các đoạn.'], sampleAnswer: 'It is often argued that online learning will eventually replace traditional classrooms. In my view, although online courses will continue to grow, physical classrooms will remain important.\n\nOn the one hand, online learning offers flexibility that traditional classes cannot match. Students can watch lectures at any time, replay difficult parts and study from anywhere. This is especially helpful for people who work or live far from a university. Online platforms can also be cheaper, because they do not require classrooms or travel.\n\nOn the other hand, classrooms provide things that are hard to recreate online. Face-to-face discussion encourages students to ask questions and learn from each other, and teachers can notice immediately when someone is confused. In addition, many learners find it difficult to stay motivated without a fixed schedule and the presence of classmates. Practical subjects such as engineering or medicine also require laboratories and hands-on training that cannot easily be moved online.\n\nTo sum up, I believe the future of education is a combination of both. Online tools will make learning more flexible and accessible, but they are unlikely to replace the human interaction and practical experience of a real classroom.' },
  { id: 'write-ielts-task1', level: 'C1', title: 'IELTS Task 1: Library visits', prompt: 'The chart shows the number of visits to a university library (in thousands) from 2019 to 2023: 2019 – 120, 2020 – 45, 2021 – 70, 2022 – 110, 2023 – 135. Summarise the information by selecting and reporting the main features. Write at least 150 words.', minWords: 150, maxWords: 200, minutes: 20, usefulPhrases: ['overall', 'dropped sharply', 'recovered', 'reached a peak', 'compared with'], checklist: ['Có câu overview nêu xu hướng chính.', 'Có số liệu cụ thể và so sánh.', 'Không đưa ý kiến cá nhân.'], sampleAnswer: 'The chart illustrates the number of visits to a university library between 2019 and 2023.\n\nOverall, library visits fell dramatically in 2020 but then recovered steadily, eventually exceeding the pre-2020 level by the end of the period.\n\nIn 2019, the library received 120,000 visits. The following year, this figure dropped sharply to only 45,000, which was less than half of the previous total. From 2021 onwards, however, numbers began to recover, rising to 70,000 in 2021 and then to 110,000 in 2022.\n\nIn the final year, visits reached a peak of 135,000, which was 15,000 higher than in 2019. Compared with the lowest point in 2020, this represents a threefold increase. The largest single rise occurred between 2021 and 2022, when the number of visits grew by 40,000.\n\nIn summary, despite a significant fall at the start of the period, the library became more popular than ever by 2023.' },
];
