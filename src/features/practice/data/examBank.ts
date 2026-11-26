import type { ChoiceQuestion, ExamGroup, ExamItem } from '../types';

const choice = (question: ChoiceQuestion): ExamItem => ({ ...question, type: 'choice' });
const part5 = (id: string, prompt: string, options: string[], answer: number, explanation: string): ExamGroup => ({
  id, exam: 'toeic', section: 'reading', part: 'Part 5', title: 'Incomplete Sentences',
  items: [choice({ id: `${id}-q`, kind: 'grammar', prompt, options, answers: [answer], explanation })],
});
const part2 = (id: string, question: string, options: string[], answer: number, explanation: string): ExamGroup => ({
  id, exam: 'toeic', section: 'listening', part: 'Part 2', title: 'Question–Response',
  audioText: question,
  items: [choice({ id: `${id}-q`, kind: 'response', prompt: 'Chọn câu đáp phù hợp nhất với câu bạn vừa nghe.', options, answers: [answer], explanation: `Câu hỏi: “${question}” — ${explanation}` })],
});

/** Original practice items written for HustLingo in TOEIC/IELTS style (not official test content). */
export const EXAM_BANK: ExamGroup[] = [
  // ───────────── TOEIC Listening ─────────────
  part2('toeic-p2-1', 'When does the training session start?', ['In the conference room.', 'At nine thirty.', 'Yes, I trained hard.'], 1, '“When” hỏi thời gian → “At nine thirty.”'),
  part2('toeic-p2-2', 'Who is responsible for the budget report?', ['By Friday.', 'Ms. Tanaka in Finance.', 'It was very expensive.'], 1, '“Who” hỏi người → “Ms. Tanaka in Finance.”'),
  part2('toeic-p2-3', 'Why was the shipment delayed?', ['Because of the storm.', 'Two boxes, please.', 'Next to the warehouse.'], 0, '“Why” hỏi lý do → “Because of the storm.”'),
  part2('toeic-p2-4', 'Would you like me to print the agenda?', ['Thanks, that would help.', 'It was printed in Japan.', 'An agency in Seoul.'], 0, 'Lời đề nghị giúp đỡ → đáp lại bằng lời cảm ơn/đồng ý.'),
  part2('toeic-p2-5', 'Where should I park my car?', ['About twenty minutes.', 'In the lot behind the building.', 'I parked it yesterday.'], 1, '“Where” hỏi nơi chốn → “In the lot behind the building.”'),
  part2('toeic-p2-6', 'Haven’t you met the new director yet?', ['No, but I will this afternoon.', 'Yes, it is a new direction.', 'The meeting room is full.'], 0, 'Câu hỏi phủ định vẫn trả lời theo sự thật: chưa gặp → “No, but…”. Hai đáp án còn lại là bẫy âm giống (direction, meeting).'),
  {
    id: 'toeic-p3-printer', exam: 'toeic', section: 'listening', part: 'Part 3', title: 'Conversation',
    audioText: 'Woman: Hi Daniel, the printer on the third floor is jammed again. Do you know if someone has called technical support? Man: I reported it this morning, but they said a technician can’t come until Thursday. Woman: That’s a problem. I need to print fifty copies of the sales brochure for tomorrow’s client meeting. Man: You could use the print shop across the street. Just keep the receipt and the company will pay you back.',
    items: [
      choice({ id: 'toeic-p3-printer-1', kind: 'detail', prompt: 'What problem does the woman mention?', options: ['A printer is not working.', 'A client cancelled a meeting.', 'The office is closed.', 'Brochures were lost.'], answers: [0], explanation: '“…the printer on the third floor is jammed again.”' }),
      choice({ id: 'toeic-p3-printer-2', kind: 'detail', prompt: 'When will a technician come?', options: ['This afternoon', 'Tomorrow', 'On Thursday', 'Next week'], answers: [2], explanation: '“…a technician can’t come until Thursday.”' }),
      choice({ id: 'toeic-p3-printer-3', kind: 'inference', prompt: 'What does the man suggest?', options: ['Postponing the meeting', 'Using a nearby print shop', 'Borrowing his printer', 'Emailing the brochure'], answers: [1], explanation: '“You could use the print shop across the street.”' }),
    ],
  },
  {
    id: 'toeic-p3-hotel', exam: 'toeic', section: 'listening', part: 'Part 3', title: 'Conversation',
    audioText: 'Man: Good evening, I have a reservation under the name Pham for three nights. Woman: Welcome, Mr. Pham. I see you booked a standard room, but we have a free upgrade to a room with a city view tonight. Man: That sounds great. Is breakfast included? Woman: Yes, it is served from six thirty to ten in the restaurant on the ground floor.',
    items: [
      choice({ id: 'toeic-p3-hotel-1', kind: 'detail', prompt: 'Where does the conversation most likely take place?', options: ['At an airport', 'At a hotel front desk', 'In a restaurant', 'At a travel agency'], answers: [1], explanation: 'Có “reservation… for three nights”, “room”, “upgrade” → quầy lễ tân khách sạn.' }),
      choice({ id: 'toeic-p3-hotel-2', kind: 'detail', prompt: 'What does the woman offer the man?', options: ['A discount', 'A free room upgrade', 'A late check-out', 'Airport transport'], answers: [1], explanation: '“…we have a free upgrade to a room with a city view.”' }),
      choice({ id: 'toeic-p3-hotel-3', kind: 'detail', prompt: 'Where is breakfast served?', options: ['In the guest rooms', 'On the top floor', 'On the ground floor', 'At a café nearby'], answers: [2], explanation: '“…in the restaurant on the ground floor.”' }),
    ],
  },
  {
    id: 'toeic-p4-announcement', exam: 'toeic', section: 'listening', part: 'Part 4', title: 'Talk',
    audioText: 'Attention, all passengers on flight VN two-five-four to Da Nang. Due to bad weather at our destination, the departure has been delayed by approximately forty-five minutes. The new boarding time is eleven fifteen at gate twelve. Passengers who need to change connecting flights should speak to an agent at the service desk near gate ten. We apologise for the inconvenience.',
    items: [
      choice({ id: 'toeic-p4-1', kind: 'purpose', prompt: 'What is the purpose of the announcement?', options: ['To announce a gate closure', 'To report a flight delay', 'To advertise a service', 'To cancel a flight'], answers: [1], explanation: '“…the departure has been delayed by approximately forty-five minutes.”' }),
      choice({ id: 'toeic-p4-2', kind: 'detail', prompt: 'What is the reason for the change?', options: ['A technical problem', 'Bad weather', 'A crew shortage', 'Heavy traffic'], answers: [1], explanation: '“Due to bad weather at our destination…”' }),
      choice({ id: 'toeic-p4-3', kind: 'detail', prompt: 'Where should passengers go to change connecting flights?', options: ['Gate twelve', 'The check-in counter', 'The service desk near gate ten', 'The baggage claim'], answers: [2], explanation: '“…speak to an agent at the service desk near gate ten.”' }),
    ],
  },
  // ───────────── TOEIC Reading ─────────────
  part5('toeic-p5-1', 'All employees must submit their expense reports ______ the end of the month.', ['by', 'until', 'since', 'during'], 0, '“by + mốc thời gian” = trước/chậm nhất vào (hạn chót).'),
  part5('toeic-p5-2', 'The new software is ______ easier to use than the previous version.', ['much', 'very', 'more', 'most'], 0, 'Bổ nghĩa cho so sánh hơn “easier” dùng “much”, không dùng “very”.'),
  part5('toeic-p5-3', 'Ms. Lee asked that the documents be ______ to her office before noon.', ['deliver', 'delivered', 'delivering', 'delivers'], 1, 'Bị động sau “be”: be + V3 → “be delivered”.'),
  part5('toeic-p5-4', 'Our sales increased ______ after the advertising campaign began.', ['significant', 'significance', 'significantly', 'signify'], 2, 'Bổ nghĩa cho động từ “increased” cần trạng từ → “significantly”.'),
  part5('toeic-p5-5', 'Neither the manager ______ her assistant was available for comment.', ['or', 'nor', 'and', 'but'], 1, 'Cấu trúc cố định “neither … nor …”.'),
  part5('toeic-p5-6', 'The conference room is ______ for the board meeting on Tuesday.', ['reserve', 'reserving', 'reserved', 'reservation'], 2, '“is reserved” = đã được đặt trước (bị động/tính từ).'),
  part5('toeic-p5-7', 'Applicants ______ résumés are incomplete will not be considered.', ['who', 'whose', 'which', 'whom'], 1, 'Sở hữu “résumés của ứng viên” → đại từ quan hệ “whose”.'),
  part5('toeic-p5-8', 'If the shipment ______ on time, we would have met the deadline.', ['arrives', 'arrived', 'had arrived', 'has arrived'], 2, 'Câu điều kiện loại 3: If + had V3, would have V3.'),
  part5('toeic-p5-9', 'Please contact customer service ______ you have any questions about your order.', ['should', 'unless', 'whether', 'although'], 0, 'Đảo ngữ điều kiện: “should you have…” — ở đây “should” đứng đầu mệnh đề = if. Các từ khác sai nghĩa.'),
  part5('toeic-p5-10', 'The company has decided to ______ its operations to Southeast Asia.', ['expand', 'expansion', 'expansive', 'expanded'], 0, 'Sau “to” cần động từ nguyên mẫu → “expand”.'),
  part5('toeic-p5-11', 'Mr. Kim is ______ qualified for the position than the other candidates.', ['good', 'better', 'best', 'well'], 1, 'Có “than” → so sánh hơn; “better qualified” = đủ năng lực hơn.'),
  part5('toeic-p5-12', 'Due to the holiday, the office will be closed ______ Monday.', ['in', 'on', 'at', 'for'], 1, 'Dùng “on” với thứ trong tuần.'),
  {
    id: 'toeic-p7-memo', exam: 'toeic', section: 'reading', part: 'Part 7', title: 'Memo',
    passage: 'MEMO\nTo: All staff\nFrom: Facilities Department\nSubject: Elevator maintenance\n\nPlease be informed that the east elevators will be out of service from Monday, 14 July, to Wednesday, 16 July, for scheduled maintenance. During this period, staff are asked to use the west elevators or the stairs. Deliveries should be directed to the loading area at the back of the building, where a service lift will remain available. We expect some delays in the mornings between 8:30 and 9:15, so please plan accordingly. Questions may be sent to facilities@corpmail.com.',
    items: [
      choice({ id: 'toeic-p7-memo-1', kind: 'purpose', prompt: 'What is the purpose of the memo?', options: ['To announce new office hours', 'To inform staff about elevator maintenance', 'To introduce a new delivery company', 'To request feedback on facilities'], answers: [1], explanation: 'Tiêu đề và câu đầu: thang máy phía đông ngừng hoạt động để bảo trì.' }),
      choice({ id: 'toeic-p7-memo-2', kind: 'detail', prompt: 'How long will the maintenance last?', options: ['One day', 'Two days', 'Three days', 'One week'], answers: [2], explanation: 'Từ thứ Hai 14/7 đến thứ Tư 16/7 → 3 ngày.' }),
      choice({ id: 'toeic-p7-memo-3', kind: 'inference', prompt: 'What are staff advised to do?', options: ['Work from home', 'Arrive a little earlier in the morning', 'Use the loading area entrance', 'Email the elevator company'], answers: [1], explanation: '“We expect some delays in the mornings… please plan accordingly” → nên đến sớm hơn.' }),
    ],
  },
  {
    id: 'toeic-p7-ad', exam: 'toeic', section: 'reading', part: 'Part 7', title: 'Advertisement',
    passage: 'GreenLeaf Catering — Fresh lunches delivered to your office\n\nWhether it is a team meeting or a company celebration, GreenLeaf provides healthy, locally sourced meals for groups of 10 to 200 people. Orders placed at least 48 hours in advance receive a 10% discount. Vegetarian and gluten-free options are available at no extra cost. Delivery is free within the city centre; a small fee applies to other areas. Visit our website to see this month’s menu.',
    items: [
      choice({ id: 'toeic-p7-ad-1', kind: 'detail', prompt: 'How can customers get a discount?', options: ['By ordering for more than 200 people', 'By ordering two days in advance', 'By choosing vegetarian meals', 'By picking up the order'], answers: [1], explanation: '“Orders placed at least 48 hours in advance receive a 10% discount.”' }),
      choice({ id: 'toeic-p7-ad-2', kind: 'detail', prompt: 'Which TWO statements are true about GreenLeaf? (Chọn 2)', options: ['Gluten-free meals cost extra.', 'It serves groups of up to 200 people.', 'Delivery is always free.', 'Delivery to the city centre is free.'], answers: [1, 3], explanation: '“groups of 10 to 200 people” và “Delivery is free within the city centre”.' }),
      choice({ id: 'toeic-p7-ad-3', kind: 'vocabulary-in-context', prompt: 'The phrase “locally sourced” is closest in meaning to…', options: ['bought from nearby producers', 'cooked at the office', 'imported from abroad', 'sold in local shops'], answers: [0], explanation: '“locally sourced” = nguyên liệu lấy từ nhà cung cấp địa phương.' }),
    ],
  },

  // ───────────── IELTS Listening ─────────────
  {
    id: 'ielts-l1-club', exam: 'ielts', section: 'listening', part: 'Section 1', title: 'Joining a sports club',
    audioText: 'Receptionist: Good morning, Riverside Sports Centre. Caller: Hi, I’d like to join the badminton club. Receptionist: Of course. Can I take your name? Caller: It’s Tran, T-R-A-N, first name An. Receptionist: Thank you. Membership is twenty-five pounds a month, or two hundred and forty pounds if you pay for the whole year. Caller: I’ll pay monthly for now. When are the sessions? Receptionist: Beginners play on Tuesday evenings from seven to nine, and there’s an open session on Saturday mornings. Caller: Great, I’ll come on Tuesday.',
    items: [
      choice({ id: 'ielts-l1-1', kind: 'detail', prompt: 'Which sport does the caller want to play?', options: ['Tennis', 'Badminton', 'Swimming', 'Squash'], answers: [1], explanation: '“I’d like to join the badminton club.”' }),
      choice({ id: 'ielts-l1-2', kind: 'detail', prompt: 'How much is the monthly membership?', options: ['£20', '£25', '£40', '£240'], answers: [1], explanation: '“Membership is twenty-five pounds a month.” £240 là phí theo năm (bẫy).' }),
      choice({ id: 'ielts-l1-3', kind: 'detail', prompt: 'When do beginners play?', options: ['Monday mornings', 'Tuesday evenings', 'Saturday mornings', 'Sunday afternoons'], answers: [1], explanation: '“Beginners play on Tuesday evenings from seven to nine.” Saturday là open session.' }),
    ],
  },
  {
    id: 'ielts-l3-project', exam: 'ielts', section: 'listening', part: 'Section 3', title: 'Students discussing a project',
    audioText: 'Tutor: So, how is your research on urban gardens going? Sara: Quite well. We interviewed twelve gardeners, and most of them said the main benefit was meeting neighbours rather than growing food. Ben: Which surprised us, actually. We expected people to talk about saving money. Tutor: Interesting. What will you do next? Sara: We want to compare two gardens, one in the city centre and one in the suburbs. Ben: Although we are still worried about finding enough time before the deadline.',
    items: [
      choice({ id: 'ielts-l3-1', kind: 'detail', prompt: 'According to the interviews, what was the main benefit of urban gardens?', options: ['Saving money', 'Growing fresh food', 'Meeting neighbours', 'Physical exercise'], answers: [2], explanation: '“…the main benefit was meeting neighbours rather than growing food.”' }),
      choice({ id: 'ielts-l3-2', kind: 'inference', prompt: 'What had the students expected?', options: ['That gardeners would mention saving money', 'That few people would agree to interviews', 'That city gardens would be larger', 'That the tutor would disagree'], answers: [0], explanation: '“We expected people to talk about saving money.”' }),
      choice({ id: 'ielts-l3-3', kind: 'detail', prompt: 'What is Ben concerned about?', options: ['The number of interviews', 'Time before the deadline', 'Choosing a garden', 'The tutor’s feedback'], answers: [1], explanation: '“…still worried about finding enough time before the deadline.”' }),
    ],
  },
  // ───────────── IELTS Reading ─────────────
  {
    id: 'ielts-r-bees', exam: 'ielts', section: 'reading', part: 'Passage 1', title: 'Urban beekeeping',
    passage: 'Over the past decade, beekeeping has become increasingly popular in large cities. Rooftop hives can now be found on hotels, offices and even museums. Supporters claim that urban bees benefit from a wider variety of flowers than bees living near large farms, where a single crop often dominates. However, some ecologists warn that adding large numbers of honeybees may increase competition for food with wild bee species, which are already in decline. They argue that planting more flowers would do more for pollinators than installing new hives.',
    items: [
      choice({ id: 'ielts-r-bees-1', kind: 'true-false-not-given', prompt: 'Beekeeping in cities has grown more popular in recent years.', options: ['True', 'False', 'Not Given'], answers: [0], explanation: '“…beekeeping has become increasingly popular in large cities.”' }),
      choice({ id: 'ielts-r-bees-2', kind: 'true-false-not-given', prompt: 'Urban honey tastes better than honey from farms.', options: ['True', 'False', 'Not Given'], answers: [2], explanation: 'Bài không so sánh mùi vị mật ong.' }),
      choice({ id: 'ielts-r-bees-3', kind: 'true-false-not-given', prompt: 'All ecologists support adding more hives in cities.', options: ['True', 'False', 'Not Given'], answers: [1], explanation: '“some ecologists warn…” → không phải tất cả ủng hộ; trái với bài.' }),
      choice({ id: 'ielts-r-bees-4', kind: 'main-idea', prompt: 'What do the ecologists recommend?', options: ['Banning rooftop hives', 'Planting more flowers', 'Moving hives to farms', 'Importing wild bees'], answers: [1], explanation: '“…planting more flowers would do more for pollinators…”' }),
    ],
  },
  {
    id: 'ielts-r-sleep', exam: 'ielts', section: 'reading', part: 'Passage 2', title: 'The science of napping',
    passage: 'Short daytime naps have long been associated with laziness, but research presents a more nuanced picture. Studies at several universities found that a nap of 10 to 20 minutes improved alertness and performance on simple tasks without leaving people feeling groggy. Longer naps, particularly those exceeding 30 minutes, allow the brain to enter deep sleep, and waking from this stage can cause temporary confusion known as sleep inertia. Nevertheless, longer naps may help with creative problem-solving, as they give the brain time to make unusual connections. Researchers therefore suggest that the ideal nap depends on what a person needs to do afterwards.',
    items: [
      choice({ id: 'ielts-r-sleep-1', kind: 'detail', prompt: 'According to the passage, a 10–20 minute nap…', options: ['causes sleep inertia', 'improves alertness', 'reduces creativity', 'is a sign of laziness'], answers: [1], explanation: '“…a nap of 10 to 20 minutes improved alertness…”' }),
      choice({ id: 'ielts-r-sleep-2', kind: 'vocabulary-in-context', prompt: '“Groggy” is closest in meaning to…', options: ['energetic', 'sleepy and confused', 'hungry', 'nervous'], answers: [1], explanation: 'Liên hệ với “sleep inertia… temporary confusion” → lờ đờ, mơ màng.' }),
      choice({ id: 'ielts-r-sleep-3', kind: 'detail', prompt: 'Which TWO effects of longer naps are mentioned? (Chọn 2)', options: ['Temporary confusion after waking', 'Better creative problem-solving', 'Lower blood pressure', 'Improved memory for numbers'], answers: [0, 1], explanation: 'Nhắc tới “sleep inertia” và “creative problem-solving”.' }),
      choice({ id: 'ielts-r-sleep-4', kind: 'main-idea', prompt: 'What is the writer’s conclusion?', options: ['Everyone should avoid naps', 'Long naps are always better', 'The best nap length depends on the next task', 'Naps only help students'], answers: [2], explanation: '“…the ideal nap depends on what a person needs to do afterwards.”' }),
    ],
  },
  // ───────────── IELTS Writing & Speaking ─────────────
  {
    id: 'ielts-w-task1', exam: 'ielts', section: 'writing', part: 'Task 1', title: 'Academic Task 1',
    passage: 'The table shows the percentage of students using three study methods in 2015 and 2025.\n\nPrinted textbooks: 2015 – 80% · 2025 – 45%\nOnline videos: 2015 – 30% · 2025 – 75%\nStudy groups: 2015 – 50% · 2025 – 48%',
    items: [{ type: 'writing', id: 'ielts-w-task1-q', kind: 'writing', prompt: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.', minWords: 150, sampleAnswer: 'The table compares the proportion of students who used printed textbooks, online videos and study groups in 2015 and 2025.\n\nOverall, online videos replaced printed textbooks as the most common study method, while the use of study groups remained almost unchanged.\n\nIn 2015, printed textbooks were by far the most popular method, used by 80% of students. By 2025, however, this figure had fallen to 45%. Online videos showed the opposite trend: only 30% of students used them in 2015, but the figure more than doubled to 75% ten years later.\n\nStudy groups were used by half of all students in 2015 and by 48% in 2025, a negligible change. As a result, by the end of the period, study groups were slightly more common than printed textbooks.' }],
  },
  {
    id: 'ielts-w-task2', exam: 'ielts', section: 'writing', part: 'Task 2', title: 'Academic Task 2',
    passage: 'Some people believe that university education should be free for everyone. Others think students should pay for their own studies.',
    items: [{ type: 'writing', id: 'ielts-w-task2-q', kind: 'writing', prompt: 'Discuss both views and give your own opinion. Write at least 250 words.', minWords: 250 }],
  },
  {
    id: 'ielts-s-part1', exam: 'ielts', section: 'speaking', part: 'Part 1', title: 'Introduction & interview',
    items: [
      { type: 'speaking', id: 'ielts-s1-1', kind: 'speaking', prompt: 'Do you work or are you a student?', sampleAnswer: 'I am a student. I am in my second year at a technical university in Hanoi, where I study information technology.' },
      { type: 'speaking', id: 'ielts-s1-2', kind: 'speaking', prompt: 'What do you usually do at the weekend?', sampleAnswer: 'It depends, but I usually spend Saturday catching up on assignments, and on Sunday I try to relax, for example by going for coffee with friends or playing football.' },
    ],
  },
  {
    id: 'ielts-s-part2', exam: 'ielts', section: 'speaking', part: 'Part 2', title: 'Long turn',
    passage: 'Describe a place where you like to study. You should say:\n• where it is\n• what it looks like\n• how often you go there\nand explain why you like studying there.',
    items: [{ type: 'speaking', id: 'ielts-s2-1', kind: 'speaking', prompt: 'Bạn có 1 phút chuẩn bị, sau đó nói 1–2 phút.', prepSeconds: 60, sampleAnswer: 'The place I would like to describe is a small café near my university. It is on a quiet side street, so it is not as noisy as most cafés in the city. Inside there are wooden tables, lots of plants and big windows, which make it feel bright and calm. I go there about three times a week, usually in the afternoon after class. The main reason I like studying there is that it helps me concentrate: at home I am easily distracted, but in the café I feel I should be productive. Also, the staff do not mind if students stay for a long time, which is really helpful during exam periods.' }],
  },
  {
    id: 'ielts-s-part3', exam: 'ielts', section: 'speaking', part: 'Part 3', title: 'Discussion',
    items: [
      { type: 'speaking', id: 'ielts-s3-1', kind: 'speaking', prompt: 'Do you think libraries are still important in the digital age?', sampleAnswer: 'Yes, I would say they are, although their role has changed. People no longer need libraries just to find information, but they still offer quiet study spaces and free access to resources, which is particularly important for students who cannot afford them.' },
      { type: 'speaking', id: 'ielts-s3-2', kind: 'speaking', prompt: 'How might the way people study change in the future?', sampleAnswer: 'I think studying will become more personalised. With AI tools, learners will probably get exercises that match their level, so they can progress at their own pace. On the other hand, there is a risk that people rely too much on technology and lose the ability to concentrate for long periods.' },
    ],
  },
];

export const EXAM_SECTIONS: Record<'toeic' | 'ielts', { id: 'listening' | 'reading' | 'writing' | 'speaking'; title: string; description: string }[]> = {
  toeic: [
    { id: 'listening', title: 'Listening', description: 'Part 2 hỏi–đáp, Part 3 hội thoại, Part 4 bài nói' },
    { id: 'reading', title: 'Reading', description: 'Part 5 điền câu, Part 7 đọc hiểu' },
  ],
  ielts: [
    { id: 'listening', title: 'Listening', description: 'Section 1 & 3' },
    { id: 'reading', title: 'Reading', description: 'True/False/Not Given, chọn đáp án' },
    { id: 'writing', title: 'Writing', description: 'Task 1 mô tả số liệu, Task 2 nghị luận' },
    { id: 'speaking', title: 'Speaking', description: 'Part 1, Part 2 cue card, Part 3' },
  ],
};
