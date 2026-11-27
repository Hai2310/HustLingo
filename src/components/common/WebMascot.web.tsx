import React, { useEffect, useId, useRef, useState } from 'react';
import { Asset } from 'expo-asset';
import { Ionicons } from '@expo/vector-icons';
import { Link, usePathname } from 'expo-router';
import type { Href } from 'expo-router';
import { hum } from '@/theme/hum';
import type { WebMascotProps } from './WebMascot';
import './WebMascot.css';

const portrait = Asset.fromModule(require('../../../assets/mascot/bom.webp')).uri;
const name = 'Bờm';
const tabs = new Set(['/home', '/lessons', '/practice', '/tutor', '/profile']);

type Tip = { message: string; action: string; href: Href };

const lessons: Tip = {
  message: 'Chọn một bài vừa sức để bắt đầu nhé!',
  action: 'Xem bài học',
  href: '/(tabs)/lessons',
};

const tips: Record<string, Tip> = {
  lessons: {
    message: 'Học xong một mục, thử làm vài câu để xem mình nhớ được gì.',
    action: 'Mở Luyện tập',
    href: '/(tabs)/practice',
  },
  practice: {
    message: 'Khi muốn đổi kỹ năng, thử nghe mẫu rồi đọc lại một câu.',
    action: 'Luyện nói',
    href: { pathname: '/(tabs)/practice', params: { skill: 'speaking' } },
  },
  tutor: {
    message: 'Thử đọc một câu mẫu để làm quen với âm thanh trước khi trò chuyện.',
    action: 'Luyện nói',
    href: { pathname: '/(tabs)/practice', params: { skill: 'speaking' } },
  },
  profile: {
    message: 'Bạn có thể tiếp tục từ một bài ngắn để duy trì nhịp học.',
    action: 'Xem bài học',
    href: '/(tabs)/lessons',
  },
};

export function WebMascot({ placement = 'dock' }: WebMascotProps) {
  const pathname = usePathname().replace(/\/$/, '');
  const inHero = placement === 'hero';
  if (inHero !== (pathname === '/home')) return null;
  return <Mascot pathname={pathname} inHero={inHero} />;
}

function Mascot({ pathname, inHero }: { pathname: string; inHero: boolean }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const section = pathname.split('/')[1];
  const tip = Object.hasOwn(tips, section) ? tips[section] : lessons;
  const position = inHero ? 'hero' : tabs.has(pathname) ? 'tab' : pathname === '/tutor/chat' ? 'chat' : 'page';

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <aside className="hust-mascot" aria-label={`Linh vật ${name}`} data-position={position}
      onKeyDown={event => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation();
          close();
        }
      }}>
      <button
        ref={trigger}
        type="button"
        className="hust-mascot-trigger"
        aria-label={open ? `Thu gọn gợi ý của ${name}` : `Mở gợi ý của ${name}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(value => !value)}
      >
        {inHero ? (
          <span className="hust-mascot-peek" aria-hidden="true">
            <span className="hust-mascot-pose">
              <img src={portrait} alt="" className="hust-mascot-art hust-mascot-body" draggable={false} />
              <img src={portrait} alt="" className="hust-mascot-art hust-mascot-paw" draggable={false} />
            </span>
          </span>
        ) : <img src={portrait} alt="" className="hust-mascot-art" draggable={false} />}
        <span className="hust-mascot-name" aria-hidden="true">{name}</span>
      </button>

      <section id={panelId} className="hust-mascot-panel" aria-label={`Gợi ý của ${name}`} hidden={!open}>
        <div className="hust-mascot-panel-top">
          <strong>{name}</strong>
          <button type="button" className="hust-mascot-close" aria-label="Đóng gợi ý"
            onClick={close}>
            <Ionicons name="close" size={21} color={hum.ink} aria-hidden />
          </button>
        </div>
        <p>{tip.message}</p>
        <Link href={tip.href} asChild>
          <a className="hust-mascot-action" onClick={() => setOpen(false)}>
            {tip.action}
            <Ionicons name="arrow-forward" size={16} color={hum.blue} aria-hidden />
          </a>
        </Link>
      </section>
    </aside>
  );
}
