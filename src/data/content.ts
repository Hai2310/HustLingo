export const learningTopics = [
  { id:'daily-life', title:'Daily Life', subtitle:'Từ vựng và mẫu câu dùng mỗi ngày', icon:'sunny-outline', level:'A1', accent:'#FCECEF' },
  { id:'technology', title:'Technology', subtitle:'Máy tính, Internet và công nghệ', icon:'laptop-outline', level:'A2', accent:'#ECF9F3' },
  { id:'travel', title:'Travel', subtitle:'Sân bay, khách sạn và di chuyển', icon:'airplane-outline', level:'A2', accent:'#FFF5E7' },
  { id:'education', title:'Education', subtitle:'Học tập, đại học và phát triển kỹ năng', icon:'school-outline', level:'B1', accent:'#EEF4FF' },
  { id:'business', title:'Business', subtitle:'Giao tiếp và môi trường công việc', icon:'briefcase-outline', level:'B1', accent:'#FFF1F1' },
  { id:'health', title:'Health', subtitle:'Sức khỏe, cơ thể và lối sống', icon:'fitness-outline', level:'B1', accent:'#EAF8F1' },
  { id:'society', title:'Society', subtitle:'Con người, cộng đồng và xã hội', icon:'people-outline', level:'B2', accent:'#F2EDFF' },
  { id:'environment', title:'Environment', subtitle:'Môi trường và phát triển bền vững', icon:'leaf-outline', level:'B2', accent:'#EAF8F1' },
] as const;

export const listeningLessons = [
  { id:'listen-1', level:'A1', title:'At the university library', transcript:'Excuse me. Is this seat available? Yes, it is. I am waiting for my friend, but you can sit here until she arrives.', question:'Where does the conversation happen?', options:['At a library','At an airport','At a restaurant','At a hospital'], answer:0 },
  { id:'listen-2', level:'A2', title:'Ordering coffee', transcript:'Good morning. Could I have a large latte and a cheese sandwich, please? Sure. Would you like the sandwich heated? Yes, please.', question:'What drink does the customer order?', options:['Tea','Latte','Juice','Water'], answer:1 },
  { id:'listen-3', level:'B1', title:'Project meeting', transcript:'The team agreed to move the presentation to Thursday because the client requested more time to review the prototype. Everyone should send their final slides by Wednesday noon.', question:'Why was the presentation moved?', options:['The room was unavailable','The client needed more time','A team member was sick','The prototype was cancelled'], answer:1 },
];

export const readingLessons = [
  { id:'read-1', level:'A1', title:'A day at university', text:'Mai is a first-year engineering student. She usually arrives at campus at eight in the morning. After two classes, she has lunch with her classmates. In the afternoon, she studies in the library before taking the bus home.', question:'Where does Mai study in the afternoon?', options:['At home','In the library','In a café','On the bus'], answer:1 },
  { id:'read-2', level:'B1', title:'Technology and learning', text:'Digital tools can make learning more flexible, but technology alone does not guarantee better results. Students still need clear goals, active practice and regular feedback. The most effective tools are often those that reduce friction and help learners focus on the task itself.', question:'What is the main idea?', options:['Technology always improves grades','Digital tools work best with good learning habits','Students should avoid online tools','Feedback is unnecessary'], answer:1 },
];

export const writingPrompts = [
  { id:'write-1', level:'A1', title:'My daily routine', prompt:'Viết 5–7 câu bằng tiếng Anh về một ngày thường của bạn.', tip:'Dùng Present Simple và các từ chỉ thời gian như usually, often, every day.' },
  { id:'write-2', level:'A2', title:'University life', prompt:'Viết 80–100 từ về trải nghiệm học tập ở trường đại học.', tip:'Bạn có thể nói về môn học, bạn bè, lịch học và hoạt động sau giờ học.' },
  { id:'write-3', level:'B1', title:'Technology in education', prompt:'Viết 120–150 từ: How can technology improve university learning?', tip:'Nêu quan điểm, ít nhất 2 lý do và một ví dụ cụ thể.' },
];

export const speakingPhrases = [
  { id:'speak-1', level:'A1', text:'Could you tell me where the library is?', vi:'Bạn có thể chỉ cho tôi thư viện ở đâu không?' },
  { id:'speak-2', level:'A2', text:'I would like to order a cup of coffee, please.', vi:'Tôi muốn gọi một cốc cà phê.' },
  { id:'speak-3', level:'B1', text:'I am responsible for presenting the main results of our project.', vi:'Tôi phụ trách trình bày các kết quả chính của dự án.' },
];

export const tutorScenarios = [
  {
    id:'coffee',
    tutor:'Emma',
    title:'Coffee Shop',
    subtitle:'Gọi đồ uống và trò chuyện hằng ngày',
    level:'Beginner',
    icon:'cafe-outline',
    objective:'Order a drink politely and handle a simple follow-up question.',
    learnerRole:'A customer ordering a drink before class.',
    topicIds:['food', 'shopping', 'daily'],
    suggestedPhrases:['I would like...', 'Could I have...?', 'That will be all, thank you.'],
    starterPrompt:'Welcome to the coffee shop. What would you like to order?',
  },
  {
    id:'university',
    tutor:'Emma',
    title:'University',
    subtitle:'Hỏi đường và trao đổi với bạn học',
    level:'Beginner',
    icon:'school-outline',
    objective:'Ask for help around campus and keep a short conversation going.',
    learnerRole:'A new student looking for the language lab.',
    topicIds:['education', 'communication', 'daily'],
    suggestedPhrases:['Could you tell me where...?', 'I am looking for...', 'Thanks for your help.'],
    starterPrompt:'Hi! You look a little lost. What are you looking for?',
  },
  {
    id:'travel',
    tutor:'Emma',
    title:'Travel',
    subtitle:'Sân bay, khách sạn và chỉ đường',
    level:'Intermediate',
    icon:'airplane-outline',
    objective:'Ask for directions and solve a small travel problem.',
    learnerRole:'A traveler checking in and asking about transport.',
    topicIds:['travel', 'communication', 'daily'],
    suggestedPhrases:['How do I get to...?', 'Is there a shuttle...?', 'Could you recommend...?'],
    starterPrompt:'Welcome to the hotel. How can I help you today?',
  },
  {
    id:'interview',
    tutor:'David',
    title:'Job Interview',
    subtitle:'Giới thiệu bản thân và trả lời phỏng vấn',
    level:'Intermediate',
    icon:'briefcase-outline',
    objective:'Give a clear self-introduction and answer common interview questions.',
    learnerRole:'A university student interviewing for an internship.',
    topicIds:['workplace', 'business', 'communication'],
    suggestedPhrases:['I am responsible for...', 'One strength I have is...', 'I learned that...'],
    starterPrompt:'Thanks for joining us. Could you tell me about yourself?',
  },
  {
    id:'presentation',
    tutor:'David',
    title:'Presentation',
    subtitle:'Thuyết trình học thuật và công việc',
    level:'Advanced',
    icon:'podium-outline',
    objective:'Open a presentation, explain one idea and handle a question.',
    learnerRole:'A presenter sharing a project update with a team.',
    topicIds:['academic', 'business', 'communication'],
    suggestedPhrases:['Today I would like to...', 'The key point is...', 'That is a great question.'],
    starterPrompt:'You have five minutes to present your project. How would you open?',
  },
  {
    id:'meeting',
    tutor:'David',
    title:'Meeting',
    subtitle:'Đưa ý kiến và phản hồi chuyên nghiệp',
    level:'Advanced',
    icon:'people-outline',
    objective:'Share an opinion, disagree politely and agree on an action.',
    learnerRole:'A team member discussing a project deadline.',
    topicIds:['workplace', 'business', 'communication'],
    suggestedPhrases:['I see your point, but...', 'My suggestion would be...', 'Let us agree on...'],
    starterPrompt:'We need to decide how to handle the project deadline. What do you think?',
  },
] as const;
