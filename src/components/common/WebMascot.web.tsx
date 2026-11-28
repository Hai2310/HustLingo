import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Asset } from 'expo-asset';
import { Ionicons } from '@expo/vector-icons';
import { Link, usePathname } from 'expo-router';
import type { Href } from 'expo-router';
import { cosmic } from '@/theme/cosmic';
import { explorerBom, explorerBomBlink } from '@/theme/cosmicArt';
import type { WebMascotProps } from './WebMascot';
import './WebMascot.css';

const portrait = Asset.fromModule(explorerBom).uri;
const portraitBlink = Asset.fromModule(explorerBomBlink).uri;
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
  const bubble = useRef<HTMLElement>(null);
  const panelId = useId();
  const section = pathname.split('/')[1];
  const tip = Object.hasOwn(tips, section) ? tips[section] : lessons;
  const position = inHero ? 'hero' : tabs.has(pathname) ? 'tab' : pathname === '/tutor/chat' ? 'chat' : 'page';

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useLayoutEffect(() => {
    const button = trigger.current;
    const panel = bubble.current;
    if (!inHero || !open || !button || !panel) return;
    panel.showPopover?.();

    const gap = 15;
    const inset = 12;
    function reposition() {
      if (!button || !panel) return;
      const anchor = button.getBoundingClientRect();
      const { width, height } = panel.getBoundingClientRect();
      const edge = window.visualViewport;
      const viewportLeft = edge?.offsetLeft ?? 0;
      const viewportTop = edge?.offsetTop ?? 0;
      const viewportRight = viewportLeft + (edge?.width ?? window.innerWidth);
      const viewportBottom = viewportTop + (edge?.height ?? window.innerHeight);
      if (anchor.bottom <= viewportTop || anchor.top >= viewportBottom) {
        setOpen(false);
        return;
      }
      const center = anchor.left + anchor.width / 2;
      const left = Math.max(viewportLeft + inset, Math.min(center - width / 2, viewportRight - width - inset));
      const above = anchor.bottom + gap + height > viewportBottom - inset && anchor.top - gap - height >= viewportTop + inset;
      const wantedTop = above ? anchor.top - gap - height : anchor.bottom + gap;
      panel.style.left = `${left}px`;
      panel.style.top = `${Math.max(viewportTop + inset, Math.min(wantedTop, viewportBottom - height - inset))}px`;
      panel.style.setProperty('--bubble-tail-x', `${Math.max(25, Math.min(center - left, width - 25))}px`);
      panel.dataset.side = above ? 'above' : 'below';
    }

    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !button?.contains(event.target) && !panel?.contains(event.target)) setOpen(false);
    }

    reposition();
    panel.querySelector('button')?.focus({ preventScroll: true });
    const viewport = window.visualViewport;
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(reposition);
    observer?.observe(panel);
    observer?.observe(button);
    document.addEventListener('scroll', reposition, { capture: true, passive: true });
    document.addEventListener('pointerdown', dismiss);
    window.addEventListener('resize', reposition);
    viewport?.addEventListener('resize', reposition);
    viewport?.addEventListener('scroll', reposition);
    return () => {
      observer?.disconnect();
      document.removeEventListener('scroll', reposition, true);
      document.removeEventListener('pointerdown', dismiss);
      window.removeEventListener('resize', reposition);
      viewport?.removeEventListener('resize', reposition);
      viewport?.removeEventListener('scroll', reposition);
      if (panel.isConnected) panel.hidePopover?.();
    };
  }, [inHero, open]);

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  const panel = (
    <section ref={bubble} id={panelId} className={inHero ? 'hust-mascot-hero-bubble' : 'hust-mascot-panel'} popover={inHero ? 'manual' : undefined}
      role={inHero ? 'dialog' : undefined} aria-label={`Gợi ý của ${name}`} hidden={!open}>
      <div className={inHero ? 'hust-mascot-bubble-body' : undefined}>
        <div className="hust-mascot-panel-top">
          <strong>{name}</strong>
          <button type="button" className="hust-mascot-close" aria-label="Đóng gợi ý" onClick={close}>
            <Ionicons name="close" size={21} color={cosmic.text} aria-hidden />
          </button>
        </div>
        <p>{tip.message}</p>
        <Link href={tip.href} asChild>
          <a className="hust-mascot-action" onClick={() => setOpen(false)}>
            {tip.action}
            <Ionicons name="arrow-forward" size={16} color={cosmic.ice} aria-hidden />
          </a>
        </Link>
      </div>
    </section>
  );

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
        aria-controls={!inHero || open ? panelId : undefined}
        aria-haspopup={inHero ? 'dialog' : undefined}
        onClick={() => setOpen(value => !value)}
      >
        <span className="hust-mascot-frame" aria-hidden="true">
          <img src={portrait} alt="" className="hust-mascot-art" draggable={false} />
          {inHero && <img src={portraitBlink} alt="" className="hust-mascot-art hust-mascot-blink" draggable={false} />}
        </span>
        <span className="hust-mascot-name" aria-hidden="true">{name}</span>
      </button>

      {(!inHero || open) && panel}
    </aside>
  );
}
