import { ReactNode, useState } from 'react';
import { useAuth } from '../auth';

export interface Tab { key: string; label: string; icon?: string; group?: string; disabled?: boolean; }
export interface MenuItem { key: string; label: string; icon?: string; onClick: () => void; }

export default function Layout({ title, subtitle, tabs, active, onTab, menu, children }: {
  title: string;
  subtitle?: string;
  tabs: Tab[];
  active: string;
  onTab: (k: string) => void;
  menu?: MenuItem[];
  children: ReactNode;
}) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const initials = (user?.full_name || '?').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
  const role = user?.role || '';
  const groups = Array.from(new Set(tabs.map((t) => t.group || 'Main')));

  function pick(k: string) { onTab(k); setOpen(false); }

  return (
    <div className="app-shell">
      {open && <div className="sb-backdrop" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sb-brand">
          <div className="sb-brand-mark">N</div>
          <div className="sb-brand-name">Nervescape<small>ANALYTICS</small></div>
        </div>

        {groups.map((g) => (
          <div key={g}>
            <div className="sb-section">{g}</div>
            {tabs.filter((t) => (t.group || 'Main') === g).map((t) => (
              <button
                key={t.key}
                className={`sb-item ${active === t.key ? 'active' : ''} ${t.disabled ? 'disabled' : ''}`}
                onClick={() => !t.disabled && pick(t.key)}
                disabled={t.disabled}
                title={t.disabled ? 'Coming soon' : undefined}
              >
                <span className="ico">{t.icon || '•'}</span>
                <span style={{ flex: 1 }}>{t.label}</span>
                {t.disabled && <span className="sb-soon">soon</span>}
              </button>
            ))}
          </div>
        ))}

      </aside>

      <main className="app-main">
        <header className="app-topbar">
          <div className="row" style={{ gap: 12 }}>
            <button className="menu-toggle" onClick={() => setOpen(true)} aria-label="Menu">☰</button>
            <div>
              <h1>{title}</h1>
              {subtitle && <div className="sub">{subtitle}</div>}
            </div>
          </div>
          <div className="row" style={{ gap: 10 }}>
            <span className="pill">{role.toUpperCase()} PORTAL</span>
            <div className="user-menu">
              <button className="avatar avatar-btn" title={user?.full_name} onClick={() => setUserOpen((v) => !v)}>{initials}</button>
              {userOpen && <div className="um-backdrop" onClick={() => setUserOpen(false)} />}
              {userOpen && (
                <div className="um-pop">
                  <div className="um-head">
                    <div className="avatar lg">{initials}</div>
                    <div style={{ minWidth: 0 }}>
                      <b style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.full_name}</b>
                      <span className="um-email">{user?.email}</span>
                    </div>
                  </div>
                  {menu?.map((m) => (
                    <button key={m.key} className="um-item" onClick={() => { m.onClick(); setUserOpen(false); }}>
                      <span className="um-ico">{m.icon}</span>{m.label}
                    </button>
                  ))}
                  <button className="um-item danger" onClick={logout}><span className="um-ico">⎋</span>Sign out</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}
