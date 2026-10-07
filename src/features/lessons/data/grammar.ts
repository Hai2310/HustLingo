export interface GrammarPoint {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  title: string;
  pattern: string;
  explanation: string;
  examples: string[];
}

export const grammarPoints: GrammarPoint[] = [
  { id:'a1-be', level:'A1', title:'Động từ to be', pattern:'S + am/is/are + ...', explanation:'Dùng để nói về danh tính, trạng thái hoặc đặc điểm ở hiện tại.', examples:['I am a student.','She is ready.','They are at the library.'] },
  { id:'a1-present-simple', level:'A1', title:'Present Simple', pattern:'S + V(s/es)', explanation:'Diễn tả thói quen, lịch trình và sự thật.', examples:['I study English every day.','He works in Hanoi.'] },
  { id:'a1-present-continuous', level:'A1', title:'Present Continuous', pattern:'S + am/is/are + V-ing', explanation:'Diễn tả hành động đang xảy ra quanh thời điểm nói.', examples:['I am reading now.','They are studying together.'] },
  { id:'a1-articles', level:'A1', title:'A / An / The', pattern:'a/an/the + noun', explanation:'A/an dùng với danh từ số ít chưa xác định; the dùng khi đối tượng đã xác định.', examples:['I saw a dog. The dog was friendly.'] },
  { id:'a2-past-simple', level:'A2', title:'Past Simple', pattern:'S + V2/ed', explanation:'Diễn tả hành động đã hoàn tất trong quá khứ.', examples:['We visited the museum yesterday.'] },
  { id:'a2-future', level:'A2', title:'Will & Be going to', pattern:'will + V / be going to + V', explanation:'Will thường cho quyết định tức thời/dự đoán; going to cho kế hoạch hoặc dấu hiệu rõ.', examples:['I will call you later.','We are going to travel this summer.'] },
  { id:'a2-comparative', level:'A2', title:'Comparatives & Superlatives', pattern:'adj-er / more ... than; the adj-est / most ...', explanation:'So sánh hai hoặc nhiều đối tượng.', examples:['This route is shorter.','It is the most useful feature.'] },
  { id:'b1-present-perfect', level:'B1', title:'Present Perfect', pattern:'have/has + V3', explanation:'Nối một trải nghiệm hoặc hành động quá khứ với hiện tại.', examples:['She has studied English for three years.'] },
  { id:'b1-conditionals', level:'B1', title:'First & Second Conditional', pattern:'If + present, will + V / If + past, would + V', explanation:'Nói về khả năng thực tế hoặc tình huống giả định.', examples:['If it rains, we will stay home.','If I had more time, I would travel.'] },
  { id:'b1-passive', level:'B1', title:'Passive Voice', pattern:'be + V3', explanation:'Nhấn mạnh đối tượng chịu tác động thay vì người thực hiện.', examples:['The report was sent yesterday.'] },
  { id:'b2-reported', level:'B2', title:'Reported Speech', pattern:'said/told + (that) + clause', explanation:'Tường thuật lại lời nói với thay đổi thì và đại từ khi cần.', examples:['She said that she was ready.'] },
  { id:'b2-relative', level:'B2', title:'Relative Clauses', pattern:'who / which / that / whose', explanation:'Bổ sung thông tin cho danh từ đứng trước.', examples:['The student who won the prize studies here.'] },
  { id:'b2-third-conditional', level:'B2', title:'Third Conditional', pattern:'If + had V3, would have V3', explanation:'Giả định một kết quả khác trong quá khứ.', examples:['If we had left earlier, we would have arrived on time.'] },
  { id:'c1-inversion', level:'C1', title:'Inversion', pattern:'Negative adverb + auxiliary + S + V', explanation:'Đảo ngữ để tạo sắc thái nhấn mạnh trong văn phong trang trọng.', examples:['Rarely have I seen such a clear report.'] },
  { id:'c1-nominalisation', level:'C1', title:'Nominalisation', pattern:'verb/adjective → noun phrase', explanation:'Danh từ hóa giúp văn phong học thuật cô đọng và khách quan hơn.', examples:['The analysis of the data revealed a pattern.'] },
];
