# HustLingo Vocabulary — Production Data

## Mục tiêu

Patch này chuyển bộ dữ liệu cũ thành mô hình **production-safe** thay vì đưa cả 10.000 record cũ trực tiếp cho người học.

### Kết quả build

- Raw records giữ nguyên: **10,000**
- Production learner-facing pool: **4,129**
- Review/quarantine queue: **5,871**
- Unique terms: **10,000**
- IPA/pronunciation được chuẩn hóa qua CMUdict khi có: **6,820**
- Nghĩa phổ biến được override/curate: **387**

## Vì sao không bật cả 10.000 từ cho production?

Dữ liệu nguồn cũ có 10.000 record nhưng từ rank 4.208 trở đi là phần dictionary-fill theo thứ tự chữ cái, không phải 10.000 từ được xếp theo tần suất. Phần này có nhiều từ cổ, compound hiếm, nghĩa từ điển phụ và nhãn CEFR/IELTS trước đây được gán theo rule quá rộng.

Vì vậy patch giữ toàn bộ 10.000 record cho compatibility/admin review nhưng **UI học tập mặc định chỉ dùng `PRODUCTION_VOCABULARY`**. Đây là cách an toàn cho sản phẩm thật: không giả vờ rằng dữ liệu chưa xác minh là “chuẩn”.

## Topic taxonomy

Production records được phân lại vào 15 nhóm:

`daily`, `communication`, `family`, `food`, `travel`, `education`, `business`, `workplace`, `health`, `shopping`, `technology`, `environment`, `society`, `culture`, `academic`.

## CEFR

`cefrLevel` hiện là **frequency-based estimate**, không phải nhãn CEFR chính thức. Metadata bắt buộc có:

- `cefrSource: frequency-estimate`
- `cefrConfidence: medium | low`

Không nên quảng cáo toàn bộ bank là “official CEFR”. Khi team có nguồn CEFR được phép tái phân phối, có thể đổi `cefrSource` thành `verified` cho từng record.

## TOEIC / IELTS

`toeicRelevance` và `ieltsRelevance` là **relevance cho luyện thi**, không phải “official word list”.

TOEIC ưu tiên Business, Workplace, Travel, Shopping và communication context. IELTS ưu tiên Academic, Education, Society, Environment, Health, Technology. `examTags` chỉ gắn `toeic`/`ielts` khi relevance = high để tránh tình trạng gần như toàn bộ từ bị gắn IELTS như bản cũ.

## Nguồn mở nên dùng để tiếp tục nâng cấp

- New General Service List (NGSL): general high-frequency English.
- TOEIC Service List (TSL): corpus-based TOEIC-preparation vocabulary.
- New Academic Word List (NAWL): academic English.
- Business Service List (BSL): business English.

Các list của NGSL Project được công bố theo CC BY-SA 4.0. Nếu team nhập trực tiếp dữ liệu list vào repository, phải giữ attribution và điều kiện share-alike tương ứng.

## API sử dụng

Learner-facing:

```ts
import { PRODUCTION_VOCABULARY } from '@/data/vocabulary-en';
```

Admin/data QA:

```ts
import { ENGLISH_VOCABULARY, VOCABULARY_REVIEW_QUEUE } from '@/data/vocabulary-en';
```

Filter helpers:

```ts
import { findWords, wordsForTopic, wordsForLevel, wordsForExam } from '@/utils/vocabulary';
```

## Validation

```bash
node scripts/validate-vocabulary-production.mjs
```

Validator kiểm tra 10.000 raw records, unique IDs/terms, production gate, topic distribution, CEFR labels và chống blanket IELTS tagging.
