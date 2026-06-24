import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { Extension } from '@tiptap/core';
import { useEffect, useRef } from 'react';

// Custom font-size extension on top of TextStyle
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() { return { types: ['textStyle'] }; },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (el) => el.style.fontSize?.replace(/['"]+/g, '') || null,
          renderHTML: (attrs) => attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
        },
      },
    }];
  },
  addCommands() {
    return {
      setFontSize: (size: string) => ({ chain }) => chain().setMark('textStyle', { fontSize: size }).run(),
      unsetFontSize: () => ({ chain }) => chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

const FONTS = ['Inter', 'Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Comic Sans MS'];
const SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  compact?: boolean;
}

export default function RichTextEditor({ value, onChange, placeholder = 'Start typing…', minHeight = 120, compact }: Props) {
  const imgRef = useRef<HTMLInputElement>(null);
  const attachRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener', target: '_blank' } }),
      Image.configure({ inline: true, allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow, TableHeader, TableCell,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle, Color, FontFamily, FontSize, Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    editorProps: {
      attributes: { class: 'rte-content', style: `min-height:${minHeight}px` },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const cur = editor.getHTML();
    if (value !== cur && value !== undefined) editor.commands.setContent(value || '', { emitUpdate: false });
  }, [value, editor]);

  if (!editor) return <div className="rte-loading">Loading editor…</div>;

  const btn = (active: boolean) => `rte-btn${active ? ' active' : ''}`;

  async function insertFile(ref: React.RefObject<HTMLInputElement | null>, type: 'image' | 'audio' | 'video' | 'attachment') {
    const file = ref.current?.files?.[0];
    if (!file || !editor) return;
    const url = await fileToDataUrl(file);
    if (type === 'image') editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    else if (type === 'audio') editor.chain().focus().insertContent(`<audio controls src="${url}" style="max-width:100%"></audio><p></p>`).run();
    else if (type === 'video') editor.chain().focus().insertContent(`<video controls src="${url}" style="max-width:100%;border-radius:8px"></video><p></p>`).run();
    else editor.chain().focus().insertContent(`<p><a href="${url}" download="${file.name}" class="rte-attachment">📎 ${file.name}</a></p>`).run();
    if (ref.current) ref.current.value = '';
  }

  function setLink() {
    const prev = editor.getAttributes('link').href as string;
    const url = window.prompt('Link URL', prev || 'https://');
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  return (
    <div className={`rte-wrap${compact ? ' rte-compact' : ''}`}>
      <div className="rte-toolbar">
        {/* Undo / Redo */}
        <div className="rte-group">
          <button type="button" className={btn(false)} title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>↩</button>
          <button type="button" className={btn(false)} title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>↪</button>
        </div>

        {/* Font family & size */}
        <div className="rte-group">
          <select className="rte-select" title="Font family"
            value={editor.getAttributes('textStyle').fontFamily || ''}
            onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}>
            <option value="">Font</option>
            {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <select className="rte-select" title="Font size"
            value={editor.getAttributes('textStyle').fontSize || ''}
            onChange={(e) => { if (e.target.value) (editor.commands as any).setFontSize(e.target.value); else (editor.commands as any).unsetFontSize(); }}>
            <option value="">Size</option>
            {SIZES.map((s) => <option key={s} value={s}>{s.replace('px', '')}</option>)}
          </select>
        </div>

        {/* Formatting */}
        <div className="rte-group">
          <button type="button" className={btn(editor.isActive('bold'))} title="Bold" onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
          <button type="button" className={btn(editor.isActive('italic'))} title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
          <button type="button" className={btn(editor.isActive('underline'))} title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></button>
          <button type="button" className={btn(editor.isActive('strike'))} title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></button>
          <button type="button" className={btn(editor.isActive('highlight'))} title="Highlight" onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}>🖍</button>
        </div>

        {/* Colors */}
        <div className="rte-group">
          <label className="rte-color" title="Text color">
            <span>A</span>
            <input type="color" value={editor.getAttributes('textStyle').color || '#000000'}
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} />
          </label>
          <label className="rte-color" title="Background color">
            <span>◼</span>
            <input type="color" value="#fef08a"
              onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()} />
          </label>
        </div>

        {/* Headings */}
        <div className="rte-group">
          <button type="button" className={btn(editor.isActive('heading', { level: 1 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
          <button type="button" className={btn(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
          <button type="button" className={btn(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        </div>

        {/* Alignment & lists */}
        <div className="rte-group">
          <button type="button" className={btn(editor.isActive({ textAlign: 'left' }))} title="Align left" onClick={() => editor.chain().focus().setTextAlign('left').run()}>⫷</button>
          <button type="button" className={btn(editor.isActive({ textAlign: 'center' }))} title="Center" onClick={() => editor.chain().focus().setTextAlign('center').run()}>☰</button>
          <button type="button" className={btn(editor.isActive({ textAlign: 'right' }))} title="Align right" onClick={() => editor.chain().focus().setTextAlign('right').run()}>⫸</button>
          <button type="button" className={btn(editor.isActive('bulletList'))} title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()}>•≡</button>
          <button type="button" className={btn(editor.isActive('orderedList'))} title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</button>
          <button type="button" className={btn(editor.isActive('link'))} title="Link" onClick={setLink}>🔗</button>
        </div>

        {/* Insert menu */}
        <div className="rte-group rte-insert">
          <button type="button" className={btn(false)} title="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>⊞</button>
          <button type="button" className={btn(false)} title="Insert image" onClick={() => imgRef.current?.click()}>🖼</button>
          <button type="button" className={btn(false)} title="Insert audio" onClick={() => audioRef.current?.click()}>🎵</button>
          <button type="button" className={btn(false)} title="Insert video" onClick={() => videoRef.current?.click()}>🎬</button>
          <button type="button" className={btn(false)} title="Attach file" onClick={() => attachRef.current?.click()}>📎</button>
        </div>
      </div>

      <EditorContent editor={editor} />

      <input ref={imgRef} type="file" accept="image/*" hidden onChange={() => insertFile(imgRef, 'image')} />
      <input ref={audioRef} type="file" accept="audio/*" hidden onChange={() => insertFile(audioRef, 'audio')} />
      <input ref={videoRef} type="file" accept="video/*" hidden onChange={() => insertFile(videoRef, 'video')} />
      <input ref={attachRef} type="file" hidden onChange={() => insertFile(attachRef, 'attachment')} />
    </div>
  );
}
