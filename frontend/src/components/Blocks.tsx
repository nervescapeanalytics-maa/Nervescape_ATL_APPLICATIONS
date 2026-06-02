// Renders the rich, typed content blocks produced by the backend curriculum builder.
export interface Block {
  type: string;
  level?: number;
  text?: string;
  title?: string;
  items?: string[];
  svg?: string;
  url?: string;
  caption?: string;
  language?: string;
  code?: string;
  variant?: string;
}

export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="content">
      {blocks.map((b, i) => <BlockView key={i} b={b} />)}
    </div>
  );
}

function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case 'heading':
      return b.level === 3 ? <h3>{b.text}</h3> : <h2>{b.text}</h2>;
    case 'paragraph':
      return <p>{b.text}</p>;
    case 'callout':
      return (
        <div className={`callout ${b.variant || ''}`}>
          {b.title && <div className="title">{b.title}</div>}
          <div>{b.text}</div>
        </div>
      );
    case 'steps':
      return (
        <>
          {b.title && <div className="muted" style={{ marginTop: 10, fontWeight: 600 }}>{b.title}</div>}
          <ol className="steps">{(b.items || []).map((it, i) => <li key={i}>{it}</li>)}</ol>
        </>
      );
    case 'list':
      return (
        <>
          {b.title && <div className="muted" style={{ marginTop: 10, fontWeight: 600 }}>{b.title}</div>}
          <ul>{(b.items || []).map((it, i) => <li key={i} style={{ lineHeight: 1.7 }}>{it}</li>)}</ul>
        </>
      );
    case 'figure':
      return (
        <figure>
          <div dangerouslySetInnerHTML={{ __html: b.svg || '' }} />
          {b.caption && <figcaption>{b.caption}</figcaption>}
        </figure>
      );
    case 'image':
      return (
        <figure>
          <img src={b.url} alt={b.caption || ''} style={{ maxWidth: '100%', borderRadius: 10 }} />
          {b.caption && <figcaption>{b.caption}</figcaption>}
        </figure>
      );
    case 'code':
      return <pre><code>{b.code}</code></pre>;
    case 'example':
      return (
        <div className="callout realworld">
          {b.title && <div className="title">{b.title}</div>}
          <div>{b.text}</div>
        </div>
      );
    default:
      return b.text ? <p>{b.text}</p> : null;
  }
}
