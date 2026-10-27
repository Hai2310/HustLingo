import { requireSupabaseConfig, supabase } from '@/services/supabase';
import type { TutorCatalog } from '../types';

export async function loadTutorCatalog(): Promise<TutorCatalog> {
  requireSupabaseConfig();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const [tutors, scenarios, profiles, details] = await Promise.all([
      supabase.from('ai_tutors').select('id,name,role,initials,description,tone,accent_color')
        .eq('is_published', true).order('sort_order').abortSignal(controller.signal),
      supabase.from('tutor_scenarios').select('id,tutor_id,title,subtitle,level,icon')
        .eq('is_published', true).order('sort_order').abortSignal(controller.signal),
      supabase.from('tutor_profile_details').select('tutor_id,specialties,suitable_levels').abortSignal(controller.signal),
      supabase.from('tutor_scenario_details').select('scenario_id,objective,learner_role,suggested_phrases,topic_ids,starter_prompt')
        .abortSignal(controller.signal),
    ]);
    for (const result of [tutors, scenarios, profiles, details]) {
      if (result.error) throw new Error('Không tải được dữ liệu Gia sư từ database. Vui lòng thử lại.');
    }
    const mappedTutors = (tutors.data || []).map(row => {
      const extension = profiles.data?.find(item => item.tutor_id === row.id);
      return {
        id: row.id as string, name: row.name as string, role: row.role as string,
        initials: row.initials as string, description: row.description as string,
        tone: row.tone || undefined, accent: row.accent_color || undefined,
        specialties: (extension?.specialties || []) as string[],
        suitableLevels: (extension?.suitable_levels || []) as string[],
      };
    });
    return {
      tutors: mappedTutors,
      scenarios: (scenarios.data || []).flatMap(row => {
        const tutor = mappedTutors.find(item => item.id === row.tutor_id);
        if (!tutor) return [];
        const extension = details.data?.find(item => item.scenario_id === row.id);
        return [{
          id: row.id as string, tutorId: tutor.id, tutor: tutor.name,
          title: row.title as string, subtitle: row.subtitle as string, level: row.level as string,
          icon: row.icon || undefined, objective: extension?.objective,
          learnerRole: extension?.learner_role,
          suggestedPhrases: (extension?.suggested_phrases || []) as string[],
          topicIds: (extension?.topic_ids || []) as string[], starterPrompt: extension?.starter_prompt,
        }];
      }),
    };
  } finally { clearTimeout(timer); }
}
