# Rubric đánh giá sản phẩm HustLingo

Phiên bản rubric: 1.0 · Ngày lập: 25/11/2026 · Nhánh tham chiếu: `huy2`
Trạng thái: **chưa chấm điểm**. Tài liệu này chỉ định nghĩa tiêu chí, thang mức và bằng chứng cần thu thập.

Rubric bám theo phạm vi P0 trong [docs/01-scope.md](../docs/01-scope.md), yêu cầu FR/NFR trong [docs/03-requirements.md](../docs/03-requirements.md) và ma trận kiểm thử TC-01 → TC-12 trong [docs/07-testing.md](../docs/07-testing.md). Mỗi tiêu chí ghi rõ ID liên quan để đối chiếu.

---

## 1. Nguyên tắc chấm

1. **Chấm theo bằng chứng, không theo ý định.** Tính năng chỉ được tính khi chạy được trên ít nhất một nền tảng bắt buộc (web hoặc Android) và có bằng chứng (ảnh chụp, video, log, kết quả lệnh, commit). Code có sẵn nhưng chưa nối vào UI, hoặc route chỉ chuyển hướng sang màn trống, được tính là **chưa có**.
2. **Phân biệt ba trạng thái:** *có code* < *chạy được* < *đã kiểm thử có biên bản*. Mức 3–4 của hầu hết tiêu chí yêu cầu trạng thái cuối.
3. **Demo phải được gọi là demo.** Tính năng mô phỏng (Tutor demo, dữ liệu mẫu) được tính đủ điểm ở phạm vi P0 nếu nhãn demo rõ ràng. Nếu UI hoặc tài liệu ngụ ý đây là tính năng thật, tiêu chí đó bị hạ một mức.
4. **Không suy diễn nền tảng.** Kết quả Android/web không được dùng làm bằng chứng cho iOS.
5. **P1 và Roadmap là điểm cộng**, không bù cho P0 còn thiếu (xem mục 4).

## 2. Thang mức

Mỗi tiêu chí con được chấm theo 5 mức. Điểm tiêu chí con = (mức ÷ 4) × trọng số.

| Mức | Tên | Mô tả chung |
| --- | --- | --- |
| 4 | Xuất sắc | Đáp ứng đầy đủ tiêu chí chấp nhận, xử lý trường hợp biên và lỗi, có bằng chứng kiểm thử trên web và Android. |
| 3 | Tốt | Đáp ứng tiêu chí chính, chạy ổn định ở luồng chuẩn, có bằng chứng trên ít nhất một nền tảng; còn thiếu sót nhỏ ở trường hợp biên. |
| 2 | Đạt một phần | Có phần chạy được nhưng thiếu một thành phần bắt buộc của tiêu chí, hoặc chưa có bằng chứng kiểm thử. |
| 1 | Yếu | Mới có khung, dữ liệu hoặc code rời rạc; người dùng chưa hoàn thành được tác vụ. |
| 0 | Không có | Chưa có, hoặc có nhưng gây lỗi/crash ở luồng chính. |

Một số tiêu chí trọng số nhỏ (C4, F4, F5, I1, I2) chỉ mô tả mức 4, 2 và 0. Mức 3 và 1 được hiểu là nằm giữa hai mô tả liền kề.

## 3. Tổng quan trọng số

| Nhóm | Nội dung | Trọng số |
| --- | --- | ---: |
| A | Chức năng cốt lõi P0 | 25 |
| B | Vòng học liền mạch end-to-end | 10 |
| C | Chất lượng nội dung học | 12 |
| D | Tài khoản, đồng bộ và toàn vẹn dữ liệu | 12 |
| E | Bảo mật và phân quyền | 10 |
| F | Trải nghiệm, khả năng tiếp cận và đa nền tảng | 12 |
| G | Kiến trúc và chất lượng mã | 9 |
| H | Kiểm thử và bằng chứng nghiệm thu | 6 |
| I | Tài liệu và quy trình nhóm | 4 |
| | **Tổng** | **100** |

---

## Nhóm A — Chức năng cốt lõi P0 (25 điểm)

### A1. Guest-first và khởi động ứng dụng — 3 điểm · FR-01, TC-01

| Mức | Mô tả |
| --- | --- |
| 4 | Mở Home không bắt đăng nhập; vào được Lessons, Practice, Tutor demo; dữ liệu học của guest còn sau khi đóng/mở lại app trên web và Android. |
| 3 | Như mức 4 nhưng mới kiểm trên một nền tảng, hoặc một module chưa dùng được ở chế độ guest. |
| 2 | Guest vào được Home nhưng một số luồng ép đăng nhập hoặc dữ liệu local mất sau khi tải lại. |
| 1 | Chỉ có màn Welcome/Onboarding; chưa dùng được module nào khi chưa đăng nhập. |
| 0 | App không khởi động hoặc bắt buộc đăng nhập. |

Bằng chứng: video luồng guest, kiểm tra AsyncStorage/localStorage sau khi tải lại.

### A2. Lessons Hub và bài học — 6 điểm · FR-04, TC-04

| Mức | Mô tả |
| --- | --- |
| 4 | Chọn được level và topic; mở được bài vocabulary, grammar và ít nhất một bài mẫu cho mỗi kỹ năng nghe/nói/đọc/viết; level chưa có nội dung hiển thị trạng thái "chưa có" thay vì mở bài rỗng; đánh dấu hoàn thành bài. |
| 3 | Vocabulary và grammar hoạt động đầy đủ; có bài mẫu cho 2–3 kỹ năng. |
| 2 | Vocabulary hoặc grammar hoạt động; các kỹ năng còn lại chỉ có dữ liệu, chưa có màn. |
| 1 | Có danh sách bài/topic nhưng mở bài không có nội dung dùng được. |
| 0 | Chưa có. |

Câu hỏi kiểm tra: ID topic giữa danh mục bài học và kho từ có khớp không (ví dụ `daily-life` và `daily`)? Mở topic có ra từ không?

### A3. Flashcard và từ đã lưu — 4 điểm · FR-05, TC-04

| Mức | Mô tả |
| --- | --- |
| 4 | Thẻ có từ, nghĩa, IPA, ví dụ và ảnh khi có; phát âm bằng TTS hoặc audio; lật thẻ mượt; lưu/bỏ lưu từ và danh sách từ đã lưu còn sau khi tải lại; không hiển thị mục bị quarantine. |
| 3 | Đủ trường chính và phát âm; lưu từ hoạt động; thiếu một chi tiết (ảnh hoặc ví dụ). |
| 2 | Hiển thị thẻ nhưng thiếu phát âm hoặc thiếu lưu từ. |
| 1 | Chỉ có danh sách từ tĩnh. |
| 0 | Chưa có, hoặc route chỉ chuyển hướng sang màn trống. |

### A4. Quiz và hàng ôn tập — 5 điểm · FR-06, FR-07, TC-05, TC-06

| Mức | Mô tả |
| --- | --- |
| 4 | Quiz từ vựng và ngữ pháp có ít nhất hai dạng câu, một đáp án đúng, điểm và giải thích; có câu xem ảnh chọn từ kèm alt/fallback; câu sai vào hàng ôn; lịch ôn 1/3/7 ngày và sai thì đặt lại 1 ngày; một thao tác không tạo hai lượt. |
| 3 | Quiz đầy đủ và câu sai vào hàng ôn; lịch ôn đơn giản hóa hoặc thiếu câu ảnh. |
| 2 | Quiz chạy được và chấm điểm; chưa có hàng ôn hoặc chưa có giải thích. |
| 1 | Có dữ liệu câu hỏi nhưng chưa làm bài được. |
| 0 | Chưa có. |

### A5. Luyện thi TOEIC/IELTS rút gọn — 3 điểm · FR-08, TC-07

| Mức | Mô tả |
| --- | --- |
| 4 | Mỗi bộ có timer, chuyển câu tới/lui, nộp bài, tự nộp khi hết giờ, màn kết quả; UI ghi rõ "luyện tập mẫu", không hiển thị điểm quy đổi chính thức. |
| 3 | Một bộ đầy đủ; bộ còn lại thiếu một thành phần. |
| 2 | Làm được bài nhưng thiếu timer hoặc thiếu kết quả. |
| 1 | Chỉ có danh mục đề. |
| 0 | Chưa có. |

### A6. Gia sư AI (Tutor) — 4 điểm · FR-09, TC-08 (FR-15 là điểm cộng)

| Mức | Mô tả |
| --- | --- |
| 4 | Tutor list, detail, scenario, chat UI, call UI và summary hoạt động; demo conversation có nhãn **Chế độ demo** rõ ràng; có trạng thái lỗi, gõ, thử lại; guest không gửi dữ liệu tới nhà cung cấp AI. |
| 3 | Đủ luồng list → scenario → chat → summary; thiếu call UI hoặc thiếu một trạng thái lỗi. |
| 2 | Chat chạy được nhưng nhãn demo không rõ, hoặc thiếu summary/scenario. |
| 1 | Chỉ có danh sách gia sư. |
| 0 | Chưa có. |

Ghi chú: nếu đội trình diễn AI thật qua Edge Function `tutor-chat`, chấm phần đó ở mục 4 (điểm cộng) và kiểm tra thêm tiêu chí E3.

---

## Nhóm B — Vòng học liền mạch end-to-end (10 điểm)

### B1. Luồng học → luyện → ôn — 6 điểm · Điều kiện hoàn thành trong docs/01

| Mức | Mô tả |
| --- | --- |
| 4 | Người dùng mới (guest) mở một bài, học từ, bấm "Luyện ngay" làm quiz về đúng bài đó, thấy câu sai, ôn lại câu sai sau khi tải lại app. Lessons và Practice dùng chung ID bài/từ. Chạy được cả khi Supabase không truy cập được. |
| 3 | Luồng hoàn chỉnh nhưng phải điều hướng thủ công giữa các module, hoặc chỉ chạy khi có mạng. |
| 2 | Hai trong ba bước nối được với nhau. |
| 1 | Các module tồn tại riêng lẻ, không chia sẻ dữ liệu. |
| 0 | Không có luồng nào trọn vẹn. |

### B2. Tiến độ phản ánh đúng hoạt động — 4 điểm · FR-10

| Mức | Mô tả |
| --- | --- |
| 4 | Màn Progress hiển thị đúng số từ đã học, đã lưu, cần ôn, bài hoàn thành, độ chính xác và mục tiêu ngày; số liệu thay đổi ngay sau mỗi thao tác học/luyện và khớp với dữ liệu lưu trữ. |
| 3 | Đủ chỉ số, cập nhật đúng; thiếu một chỉ số hoặc chưa có trạng thái rỗng hướng dẫn. |
| 2 | Có màn tiến độ nhưng một số chỉ số không bao giờ thay đổi vì module nguồn chưa ghi dữ liệu. |
| 1 | Chỉ hiển thị số tĩnh. |
| 0 | Chưa có. |

---

## Nhóm C — Chất lượng nội dung học (12 điểm)

### C1. Độ chính xác và phù hợp trình độ — 4 điểm · docs/04

| Mức | Mô tả |
| --- | --- |
| 4 | Nghĩa, IPA, loại từ đúng; level phù hợp người mới bắt đầu (A1–A2) ở bài mẫu; đã có người duyệt và ghi nguồn/phiên bản; nhãn CEFR/TOEIC/IELTS không ghi "chính thức" khi chưa xác minh. |
| 3 | Nội dung bài mẫu đúng; nhãn level là ước lượng nhưng có ghi chú. |
| 2 | Phần lớn đúng; có lỗi nghĩa/đáp án rải rác hoặc câu hỏi không có căn cứ trong nội dung (ví dụ đáp án nghe không có trong transcript). |
| 1 | Nhiều lỗi, chưa duyệt. |
| 0 | Nội dung sai hoặc chỉ là placeholder. |

### C2. Ví dụ và ngữ cảnh sử dụng — 3 điểm

| Mức | Mô tả |
| --- | --- |
| 4 | Câu ví dụ tự nhiên, minh họa đúng nghĩa (ví dụ "My mother works at a hospital."), không phải câu mẫu chung chung; mỗi từ trong bài bàn giao có ít nhất một ví dụ đã duyệt. |
| 3 | Bài mẫu có ví dụ tốt; phần kho từ còn ví dụ sinh tự động. |
| 2 | Ví dụ chủ yếu sinh theo mẫu ("Please remember the meaning of ..."). |
| 1 | Rất ít ví dụ. |
| 0 | Không có ví dụ. |

### C3. Thiết kế bài học — 3 điểm

| Mức | Mô tả |
| --- | --- |
| 4 | Mỗi bài có mục tiêu, nội dung, luyện tập kèm theo và tiêu chí hoàn thành; grammar có công thức, giải thích, lỗi thường gặp, ví dụ; nói/viết có hướng dẫn và ví dụ trả lời. |
| 3 | Bài có cấu trúc rõ; thiếu mục tiêu hoặc thiếu lỗi thường gặp. |
| 2 | Bài chỉ là danh sách nội dung, chưa có hoạt động luyện gắn kèm. |
| 1 | Nội dung rời rạc. |
| 0 | Chưa có. |

### C4. Tài nguyên đa phương tiện và bản quyền — 2 điểm · NFR-04

| Mức | Mô tả |
| --- | --- |
| 4 | Ảnh/audio rõ chủ thể, có nguồn và quyền sử dụng (ví dụ THIRD_PARTY_VOCABULARY_ATTRIBUTIONS.md); bài nghe có audio hoặc TTS và ghi rõ lựa chọn; ảnh AI sinh được ghi chú. |
| 2 | Có ảnh/audio nhưng thiếu ghi nguồn hoặc thiếu cho bài nghe. |
| 0 | Không có, hoặc dùng tài nguyên không rõ quyền. |

---

## Nhóm D — Tài khoản, đồng bộ và toàn vẹn dữ liệu (12 điểm)

### D1. Xác thực — 4 điểm · FR-02, TC-02

| Mức | Mô tả |
| --- | --- |
| 4 | Email/password, Google và Facebook qua Supabase Auth; xử lý callback OAuth trên web và Android, hủy đăng nhập, lỗi mạng; giữ dữ liệu guest khi đăng nhập thất bại; session còn sau khi mở lại app. |
| 3 | Email và một nhà cung cấp OAuth chạy được; xử lý lỗi cơ bản. |
| 2 | Chỉ email/password, hoặc OAuth chạy trên một nền tảng. |
| 1 | Có màn đăng nhập nhưng chưa kết nối backend. |
| 0 | Chưa có. |

### D2. Chuyển dữ liệu guest sang tài khoản — 3 điểm · FR-03, TC-03

| Mức | Mô tả |
| --- | --- |
| 4 | Hỏi xác nhận trước khi nhập; import hai lần không nhân đôi lượt; mất mạng giữa chừng không hỏng dữ liệu; đổi tài khoản trên cùng máy không tự chuyển snapshot sang tài khoản khác. |
| 3 | Import đúng và idempotent; chưa xử lý mất mạng giữa chừng. |
| 2 | Import được nhưng có thể nhân đôi hoặc không hỏi xác nhận. |
| 1 | Chưa có import, dữ liệu guest bị bỏ khi đăng nhập. |
| 0 | Đăng nhập làm mất hoặc trộn sai dữ liệu. |

### D3. Đồng bộ nhiều thiết bị và offline — 5 điểm · FR-10, NFR-03, TC-09

| Mức | Mô tả |
| --- | --- |
| 4 | Học trên Android, mở web cùng tài khoản thấy đúng ID bài/từ/lượt; thao tác offline được lưu và đẩy lên khi có mạng; không báo "đã lưu cloud" khi chưa lưu; trạng thái đồng bộ hiển thị rõ; có chiến lược xử lý ghi đồng thời. |
| 3 | Đồng bộ đúng ở luồng chuẩn trên hai thiết bị; offline giữ dữ liệu local nhưng chưa tự đồng bộ lại. |
| 2 | Đồng bộ một chiều hoặc chưa kiểm thử trên hai thiết bị. |
| 1 | Có code đồng bộ nhưng chưa chạy được với Supabase. |
| 0 | Chưa có, hoặc đồng bộ ghi đè mất dữ liệu. |

---

## Nhóm E — Bảo mật và phân quyền (10 điểm)

### E1. RLS và cô lập dữ liệu giữa tài khoản — 4 điểm · FR-11, NFR-02, TC-10

| Mức | Mô tả |
| --- | --- |
| 4 | Mọi bảng chứa dữ liệu người dùng bật RLS; JWT learner A không đọc/sửa được dữ liệu learner B qua Data API; có script hoặc biên bản kiểm thử chứng minh. |
| 3 | RLS đúng trên tất cả bảng; kiểm thử thủ công, chưa có script. |
| 2 | RLS có nhưng một số bảng/cột chưa kiểm soát. |
| 1 | RLS chỉ bật một phần, chưa kiểm thử. |
| 0 | Truy cập chéo được dữ liệu tài khoản khác. |

### E2. Role, status và chống tự nâng quyền — 3 điểm · FR-11, docs/09

| Mức | Mô tả |
| --- | --- |
| 4 | Tài khoản mới luôn là learner; learner không sửa được `role`/`status` của mình (cột server-only hoặc grant theo cột); tài khoản disabled bị chặn dù JWT còn hạn. |
| 3 | Chống tự nâng quyền đúng; chặn disabled chưa kiểm thử. |
| 2 | Có role trong DB nhưng policy owner-write cho phép sửa cả hàng `profiles`. |
| 1 | Role chỉ tồn tại ở client. |
| 0 | Learner tự cấp được quyền admin. |

### E3. Quản lý bí mật và backend AI — 3 điểm · NFR-02, docs/13

| Mức | Mô tả |
| --- | --- |
| 4 | Không có service role key hay khóa AI trong bundle, `EXPO_PUBLIC_*` hoặc repo; `.env` không bị commit; Edge Function xác thực JWT người gọi, giới hạn kích thước/hạn mức, CORS phù hợp; lỗi dịch vụ AI không làm hỏng luồng học. |
| 3 | Bí mật an toàn; Edge Function xác thực đúng; thiếu hạn mức hoặc CORS còn mở `*`. |
| 2 | Bí mật an toàn nhưng chưa có kiểm soát đầu vào/hạn mức. |
| 1 | Có dấu hiệu bí mật nằm ở client. |
| 0 | Lộ service key hoặc khóa AI. |

---

## Nhóm F — Trải nghiệm, khả năng tiếp cận và đa nền tảng (12 điểm)

### F1. Tính nhất quán và rõ ràng của giao diện — 3 điểm

| Mức | Mô tả |
| --- | --- |
| 4 | Dùng chung theme, component và ngôn ngữ hiển thị; điều hướng tab rõ; người mới hiểu nên làm gì tiếp theo ở mỗi màn; không có tab hoặc màn trống mà không giải thích. |
| 3 | Nhất quán; còn vài màn thiếu lời dẫn. |
| 2 | Có màn trống hoặc nút dẫn tới chỗ chưa làm mà không báo. |
| 1 | Giao diện rời rạc giữa các module. |
| 0 | Không dùng được. |

### F2. Trạng thái loading / empty / error / completed — 3 điểm · NFR-03, TC-12

| Mức | Mô tả |
| --- | --- |
| 4 | Mọi màn có dữ liệu động có đủ 5 trạng thái, có nút thử lại; phân biệt nội dung offline, tiến độ trên máy và tiến độ đã đồng bộ. |
| 3 | Đủ trạng thái ở các module chính. |
| 2 | Chỉ có trạng thái bình thường và loading. |
| 1 | Lỗi hiển thị dạng thô hoặc không hiển thị. |
| 0 | Lỗi gây crash. |

### F3. Responsive và đa nền tảng — 3 điểm · NFR-01

| Mức | Mô tả |
| --- | --- |
| 4 | Không tràn hoặc che nút ở 360/768/1280 px trên web; chạy trên Android thật hoặc emulator; iOS có biên bản riêng hoặc ghi rõ chưa kiểm thử. |
| 3 | Web và Android chạy tốt; một vài lỗi bố cục nhỏ. |
| 2 | Chỉ chạy tốt trên một nền tảng. |
| 1 | Lỗi bố cục nghiêm trọng. |
| 0 | Không build được cho nền tảng bắt buộc. |

### F4. Khả năng tiếp cận — 2 điểm · NFR-04

| Mức | Mô tả |
| --- | --- |
| 4 | Nút và ảnh có `accessibilityLabel`; tương phản đủ; dùng được với cỡ chữ lớn và screen reader; tôn trọng tùy chọn giảm chuyển động. |
| 2 | Có nhãn ở phần lớn thành phần tương tác; chưa thử screen reader. |
| 0 | Không có nhãn truy cập. |

### F5. Hiệu năng cảm nhận — 1 điểm · NFR-05

| Mức | Mô tả |
| --- | --- |
| 4 | Danh sách bài tải dưới 3 giây ở mạng ổn định, lật thẻ dưới 300 ms; có đo trung vị 5 lượt. |
| 2 | Cảm nhận mượt nhưng chưa đo. |
| 0 | Giật hoặc treo rõ rệt. |

---

## Nhóm G — Kiến trúc và chất lượng mã (9 điểm)

### G1. Cấu trúc module và phân tách trách nhiệm — 3 điểm · docs/05, docs/10

| Mức | Mô tả |
| --- | --- |
| 4 | Tổ chức theo feature (`lessons`, `practice`, `tutor`, `backend`) với `screens/components/data/hooks/types/services`; route trong `app/` mỏng; context và service dùng chung qua interface nhóm thống nhất; không có component trùng lặp giữa `src/components` và `src/components/common`. |
| 3 | Cấu trúc rõ; còn vài chỗ trùng lặp hoặc logic nằm trong route. |
| 2 | Có cấu trúc nhưng nhiều file trùng, nhiều nguồn dữ liệu cho cùng một khái niệm. |
| 1 | Mã dồn trong vài file lớn. |
| 0 | Không có cấu trúc. |

### G2. Chất lượng mã TypeScript — 3 điểm

| Mức | Mô tả |
| --- | --- |
| 4 | `npm run typecheck` sạch; hạn chế `any` và `@ts-nocheck`; mã định dạng đọc được (không dồn cả màn hình vào một dòng); đặt tên nhất quán; không có file rỗng hoặc mã chết. |
| 3 | Typecheck sạch; còn vài chỗ khó đọc. |
| 2 | Typecheck có lỗi nhỏ, hoặc nhiều file khó bảo trì. |
| 1 | Nhiều lỗi kiểu, mã khó đọc. |
| 0 | Không build được. |

### G3. Dữ liệu, migration và phụ thuộc — 3 điểm

| Mức | Mô tả |
| --- | --- |
| 4 | Migration Supabase có thứ tự, chạy lại được trên project trống; một nguồn sự thật cho mỗi loại nội dung với ID ổn định và phiên bản; script seed/import có kiểm tra; `package.json` chỉ chứa phụ thuộc được dùng và có lý do. |
| 3 | Migration và seed chạy được; còn dữ liệu trùng giữa `src/data` và `src/features/*/data`. |
| 2 | Migration chạy được nhưng dữ liệu nội dung phân tán, ID không thống nhất. |
| 1 | Migration lỗi hoặc thiếu. |
| 0 | Không có backend dữ liệu. |

---

## Nhóm H — Kiểm thử và bằng chứng nghiệm thu (6 điểm)

### H1. Kiểm thử tự động — 3 điểm · NFR-06

| Mức | Mô tả |
| --- | --- |
| 4 | `npm run check` (validate + typecheck + test:lessons) chạy PASS và gate đã cập nhật theo tính năng thực tế; có unit test cho chấm điểm, lịch ôn, merge idempotent; có integration test RLS/sync. |
| 3 | `npm run check` PASS; có unit test cho một phần logic nghiệp vụ. |
| 2 | Chỉ có typecheck và validator dữ liệu. |
| 1 | Có script nhưng không chạy được hoặc gate đã lỗi thời. |
| 0 | Không có. |

### H2. Kiểm thử thủ công và người dùng — 3 điểm · docs/07 mục Nghiệm thu

| Mức | Mô tả |
| --- | --- |
| 4 | Biên bản TC-01 → TC-12 ghi commit/build, nền tảng, kết quả đạt/chưa đạt; ít nhất 5 người ngoài nhóm thử một lesson + practice, 4/5 tự hoàn thành; ghi lại vấn đề và hướng sửa. |
| 3 | Biên bản đủ ca P0; thử người dùng ít hơn 5 người. |
| 2 | Kiểm thử thủ công không có biên bản đầy đủ. |
| 1 | Chỉ thử bởi người phát triển. |
| 0 | Không có. |

---

## Nhóm I — Tài liệu và quy trình nhóm (4 điểm)

### I1. Tài liệu khớp với sản phẩm — 2 điểm

| Mức | Mô tả |
| --- | --- |
| 4 | README mô tả đúng tính năng đã có, phân biệt rõ đã làm / demo / roadmap; hướng dẫn cài đặt và cấu hình Supabase/AI chạy được từ đầu; tài liệu thiết kế cũ (Flutter, prototype HTML) được đánh dấu là tham khảo. |
| 2 | Tài liệu đầy đủ nhưng có chỗ mô tả tính năng chưa tồn tại như đã hoàn thành. |
| 0 | Thiếu tài liệu cài đặt. |

### I2. Quy trình Git và phân công — 2 điểm

| Mức | Mô tả |
| --- | --- |
| 4 | Mỗi thành viên có đóng góp tương ứng module được giao (Huy — Lessons, Dương — Practice, Khánh — Tutor, Hải — Backend/Core); làm việc qua nhánh và pull request; commit message rõ nghĩa; không commit file tạm, file rỗng hoặc bí mật. |
| 2 | Có nhánh/PR nhưng commit message hoặc merge chưa sạch. |
| 0 | Không có quy trình. |

---

## 4. Điểm cộng (tối đa +10, không vượt 100)

Chỉ tính khi P0 của module liên quan đạt từ mức 3 trở lên.

| Mục | ID | Tối đa |
| --- | --- | ---: |
| Gia sư AI thật (STT → LLM → TTS hoặc chat LLM qua Edge Function) có hạn mức, xử lý lỗi và nhãn rõ | FR-15 | +4 |
| AI chấm phát âm hoặc chấm câu viết theo từ vựng | FR-15, Idea_UDDNT | +2 |
| Admin web quản trị nội dung/tài khoản có audit | FR-13, FR-14 | +2 |
| Gói Free/Plus/Pro với entitlement do server xác nhận | FR-16 | +1 |
| Build phát hành thật (EAS web deploy hoặc APK preview) có link kiểm chứng | DEPLOYMENT.md | +1 |

## 5. Điều kiện giới hạn điểm

Các lỗi sau giới hạn tổng điểm bất kể điểm thành phần:

| Lỗi phát hiện | Tổng điểm tối đa |
| --- | ---: |
| Lộ service role key hoặc khóa AI trong bundle hoặc repo | 50 |
| Đọc/sửa được dữ liệu tài khoản khác, hoặc learner tự nâng quyền admin | 60 |
| Crash ở luồng chính guest → Lessons → Practice | 60 |
| Mất dữ liệu học khi đăng nhập hoặc đồng bộ | 70 |
| Tutor demo trình bày như AI thật mà không có nhãn | 80 |

## 6. Điểm cần kiểm tra khi chấm (ghi nhận từ khảo sát repo, chưa đánh giá)

Các mục dưới đây được ghi lại để người chấm xác minh. Đây chưa phải kết luận:

- `src/features/practice/screens/PracticeScreen.tsx` và các route `app/quiz.tsx`, `app/flashcards.tsx`, `app/exam.tsx`, `app/listening.tsx`, `app/reading.tsx`, `app/speaking.tsx`, `app/writing.tsx`, `app/grammar.tsx`: kiểm tra các route này có màn chức năng thật hay chỉ chuyển hướng sang tab Practice (ảnh hưởng A3, A4, A5, B1).
- ID topic giữa `learningTopics` và kho từ (`daily-life` / `daily`) có thống nhất chưa (A2, G3).
- Tỷ lệ câu ví dụ có `exampleQuality: generated` trong kho từ production (C2).
- Bài nghe có audio hay chỉ có transcript; câu hỏi `listen-1` có căn cứ trong transcript không (C1, C4).
- Migration `profiles` có cho learner sửa `role`/`status` không (E2).
- CORS của `supabase/functions/tutor-chat/index.ts` và cơ chế hạn mức (E3).
- Phụ thuộc `omniroute` trong `package.json` có được dùng không; file `test.py` rỗng ở gốc repo (G3, I2).
- Trùng lặp component giữa `src/components/*.tsx` và `src/components/common/` (G1).
- Kết quả `npm run check` trên commit được chấm (H1).
- Đồng bộ Supabase đã kiểm thử trong đợt này chưa (D3), theo [docs/product-improvement-report.md](../docs/product-improvement-report.md).

---

## 7. Phiếu chấm (để trống)

Commit được chấm: `________` · Người chấm: `________` · Ngày: `________` · Nền tảng thử: ☐ Web ☐ Android ☐ iOS

| Mã | Tiêu chí | Trọng số | Mức (0–4) | Điểm | Bằng chứng / ghi chú |
| --- | --- | ---: | :---: | ---: | --- |
| A1 | Guest-first | 3 | | | |
| A2 | Lessons Hub và bài học | 6 | | | |
| A3 | Flashcard và từ đã lưu | 4 | | | |
| A4 | Quiz và hàng ôn | 5 | | | |
| A5 | Luyện thi rút gọn | 3 | | | |
| A6 | Tutor | 4 | | | |
| B1 | Luồng học → luyện → ôn | 6 | | | |
| B2 | Tiến độ | 4 | | | |
| C1 | Độ chính xác nội dung | 4 | | | |
| C2 | Ví dụ và ngữ cảnh | 3 | | | |
| C3 | Thiết kế bài học | 3 | | | |
| C4 | Đa phương tiện, bản quyền | 2 | | | |
| D1 | Xác thực | 4 | | | |
| D2 | Import guest | 3 | | | |
| D3 | Đồng bộ và offline | 5 | | | |
| E1 | RLS | 4 | | | |
| E2 | Role/status | 3 | | | |
| E3 | Bí mật và backend AI | 3 | | | |
| F1 | Nhất quán giao diện | 3 | | | |
| F2 | Trạng thái màn hình | 3 | | | |
| F3 | Responsive, đa nền tảng | 3 | | | |
| F4 | Khả năng tiếp cận | 2 | | | |
| F5 | Hiệu năng | 1 | | | |
| G1 | Cấu trúc module | 3 | | | |
| G2 | Chất lượng TypeScript | 3 | | | |
| G3 | Dữ liệu, migration, phụ thuộc | 3 | | | |
| H1 | Kiểm thử tự động | 3 | | | |
| H2 | Kiểm thử thủ công, người dùng | 3 | | | |
| I1 | Tài liệu | 2 | | | |
| I2 | Quy trình Git | 2 | | | |
| | **Tổng thành phần** | **100** | | | |
| | Điểm cộng (≤ 10) | | | | |
| | Giới hạn áp dụng (nếu có) | | | | |
| | **Tổng cuối** | | | | |
