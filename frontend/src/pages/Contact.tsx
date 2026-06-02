import { useEffect, useState } from 'react';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';

const REASONS = [
  { i: '🏫', t: 'For Schools', d: 'Launch an Atal Tinkering Lab programme with curriculum, training and analytics built in.' },
  { i: '👩‍🏫', t: 'For Educators', d: 'Bring AI-assisted, project-based STEM learning into your classroom with ready-to-teach content.' },
  { i: '🤝', t: 'Partnerships', d: 'Collaborate on content, hardware, competitions and innovation challenges.' },
  { i: '🛟', t: 'Support', d: 'Already onboard? Reach our team for platform, billing or technical help.' },
];

const OFFICES = [
  { city: 'Varanasi', addr: 'Lanka, Varanasi - 221005', tag: 'Office' },
];

export default function Contact() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [form, setForm] = useState({ name: '', email: '', org: '', topic: 'For Schools', message: '' });
  const [sent, setSent] = useState(false);
  function set(k: string, v: string) { setForm((p) => ({ ...p, [k]: v })); }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="landing">
      <SiteNav />

      <section className="pg-hero">
        <div className="pg-hero-inner">
          <span className="rb-kicker" style={{ color: '#bcd4ff' }}>Contact us</span>
          <h1>Let's build the future of learning together</h1>
          <p>
            Whether you're a school leader, an educator or a partner, our team is ready to help you launch a world-class
            innovation programme. Tell us a little about your goals and we'll be in touch within one business day.
          </p>
        </div>
      </section>

      <section className="rb-section">
        <div className="rb-section-inner contact-grid">
          <div className="contact-info">
            <div className="rb-section-head" style={{ textAlign: 'left', margin: 0 }}>
              <span className="rb-kicker">How can we help?</span>
              <h2>Reach the right team</h2>
            </div>
            <div className="contact-reasons">
              {REASONS.map((r) => (
                <div key={r.t} className="contact-reason">
                  <span>{r.i}</span>
                  <div><b>{r.t}</b><p>{r.d}</p></div>
                </div>
              ))}
            </div>

            <div className="contact-direct">
              <div><span className="contact-ico">✉️</span><div><b>Email</b><a href="mailto:support@nervescape.com">support@nervescape.com</a></div></div>
              <div><span className="contact-ico">📞</span><div><b>Phone</b><a href="tel:+918707565776">+91 8707565776</a></div></div>
              <div><span className="contact-ico">🕘</span><div><b>Hours</b><span>Mon–Sat, 9:00 AM – 6:00 PM IST</span></div></div>
            </div>

            <div className="contact-offices">
              {OFFICES.map((o) => (
                <div key={o.city} className="contact-office">
                  <span className="contact-office-tag">{o.tag}</span>
                  <b>{o.city}</b>
                  <p>{o.addr}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-form-card">
            {sent ? (
              <div className="contact-sent">
                <span style={{ fontSize: 44 }}>✅</span>
                <h3>Thank you, {form.name || 'there'}!</h3>
                <p className="muted">Your message has been received. Our team will reach out to you shortly at {form.email || 'your email'}.</p>
                <button className="rb-hero-cta primary" onClick={() => { setSent(false); setForm({ name: '', email: '', org: '', topic: 'For Schools', message: '' }); }}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h3>Send us a message</h3>
                <div className="field"><label>Full name</label><input value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="Your name" /></div>
                <div className="field"><label>Work email</label><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required placeholder="you@school.edu" /></div>
                <div className="field"><label>School / Organisation</label><input value={form.org} onChange={(e) => set('org', e.target.value)} placeholder="Your school or company" /></div>
                <div className="field"><label>I'm reaching out about</label>
                  <select value={form.topic} onChange={(e) => set('topic', e.target.value)}>
                    {REASONS.map((r) => <option key={r.t}>{r.t}</option>)}
                  </select>
                </div>
                <div className="field"><label>Message</label><textarea rows={4} value={form.message} onChange={(e) => set('message', e.target.value)} required placeholder="Tell us about your goals…" /></div>
                <button className="rb-hero-cta primary" style={{ width: '100%' }} type="submit">Send message →</button>
                <p className="muted" style={{ fontSize: 12, marginTop: 12, textAlign: 'center' }}>We respect your privacy. Your details are only used to respond to your enquiry.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
