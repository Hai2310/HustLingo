import type { VocabularyTopicId } from './vocabulary-en';

export interface VocabularyTopicDefinition {
  id: VocabularyTopicId;
  label: string;
  labelVi: string;
  description: string;
}

export const VOCABULARY_TOPICS: VocabularyTopicDefinition[] = [
  {
    "id": "communication",
    "label": "Communication",
    "labelVi": "Giao tiếp",
    "description": "Speaking, listening, messages and interpersonal communication."
  },
  {
    "id": "family",
    "label": "Family & Relationships",
    "labelVi": "Gia đình & Quan hệ",
    "description": "Family members, relationships and personal life."
  },
  {
    "id": "food",
    "label": "Food & Dining",
    "labelVi": "Ẩm thực",
    "description": "Food, dining, restaurants and cooking."
  },
  {
    "id": "travel",
    "label": "Travel & Transport",
    "labelVi": "Du lịch & Giao thông",
    "description": "Travel, transport, hotels and directions."
  },
  {
    "id": "education",
    "label": "Education",
    "labelVi": "Giáo dục",
    "description": "School, university, learning and exams."
  },
  {
    "id": "business",
    "label": "Business & Finance",
    "labelVi": "Kinh doanh & Tài chính",
    "description": "Business, finance, markets and commercial English."
  },
  {
    "id": "workplace",
    "label": "Workplace",
    "labelVi": "Công việc & Văn phòng",
    "description": "Jobs, offices, meetings, careers and workplace English."
  },
  {
    "id": "health",
    "label": "Health & Body",
    "labelVi": "Sức khỏe & Cơ thể",
    "description": "Health, medicine, the body and wellbeing."
  },
  {
    "id": "shopping",
    "label": "Shopping & Services",
    "labelVi": "Mua sắm & Dịch vụ",
    "description": "Shopping, products, prices and customer services."
  },
  {
    "id": "technology",
    "label": "Technology",
    "labelVi": "Công nghệ",
    "description": "Computers, software, data, digital tools and technology."
  },
  {
    "id": "environment",
    "label": "Environment & Nature",
    "labelVi": "Môi trường & Tự nhiên",
    "description": "Nature, climate, environment and sustainability."
  },
  {
    "id": "society",
    "label": "Society & Government",
    "labelVi": "Xã hội & Chính quyền",
    "description": "Government, law, society, public life and citizenship."
  },
  {
    "id": "culture",
    "label": "Culture & Media",
    "labelVi": "Văn hóa & Truyền thông",
    "description": "Arts, media, music, film, sport and culture."
  },
  {
    "id": "academic",
    "label": "Academic English",
    "labelVi": "Tiếng Anh học thuật",
    "description": "Research, academic writing, analysis and study language."
  },
  {
    "id": "daily",
    "label": "Daily Life",
    "labelVi": "Đời sống hằng ngày",
    "description": "Common everyday English and high-frequency general vocabulary."
  }
] as VocabularyTopicDefinition[];

export const VOCABULARY_TOPIC_IDS = VOCABULARY_TOPICS.map((topic) => topic.id);
