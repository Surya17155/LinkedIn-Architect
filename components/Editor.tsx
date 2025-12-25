
import React, { useState, useRef, useEffect } from 'react';
import { applyStyleToText, toggleStyle } from '../utils/textConverter';
import { TextStyle } from '../types';
import FloatingToolbar from './FloatingToolbar';
import { Paperclip, Copy, Check, Undo, Redo } from 'lucide-react';

interface EditorProps {
  content: string;
  setContent: (text: string) => void;
  onMediaUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mediaCount: number;
}

const Editor: React.FC<EditorProps> = ({ content, setContent, onMediaUpload, mediaCount }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Undo/Redo History State
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isUndoable = historyIndex > 0;
  const isRedoable = historyIndex < history.length - 1;

  const timeoutRef = useRef<number | null>(null);

  const charCount = content.length;
  const percentage = Math.min((charCount / 3000) * 100, 100);

  const updateContentWithHistory = (newContent: string, immediate = false) => {
    setContent(newContent);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (immediate) {
         const newHistory = history.slice(0, historyIndex + 1);
         newHistory.push(newContent);
         setHistory(newHistory);
         setHistoryIndex(newHistory.length - 1);
    } else {
        timeoutRef.current = window.setTimeout(() => {
            setHistory(prev => {
                const newHistory = prev.slice(0, historyIndex + 1);
                newHistory.push(newContent);
                return newHistory;
            });
            setHistoryIndex(prev => prev + 1);
        }, 500);
    }
  };

  const handleUndo = () => {
    if (isUndoable) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setContent(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (isRedoable) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setContent(history[newIndex]);
    }
  };

  // Handle Text Selection logic
  const handleSelect = () => {
    const el = textareaRef.current;
    if (!el) return;

    // Save selection range for formatting application
    if (el.selectionStart !== el.selectionEnd) {
      setSelectionRange({ start: el.selectionStart, end: el.selectionEnd });
    } else {
      setSelectionRange(null);
    }
  };

  const toggleList = (start: number, end: number, bulletChar: string = '•') => {
      const before = content.substring(0, start);
      const selected = content.substring(start, end);
      const after = content.substring(end);

      // Split selected text into lines
      // We look back to find the start of the line for the selection
      const fullTextBefore = content.substring(0, start);
      const lastNewLine = fullTextBefore.lastIndexOf('\n');
      const lineStart = lastNewLine === -1 ? 0 : lastNewLine + 1;
      
      // We also look forward to find the end of the line
      const fullTextAfter = content.substring(end);
      const nextNewLine = fullTextAfter.indexOf('\n');
      const lineEnd = nextNewLine === -1 ? content.length : end + nextNewLine;

      const expandedBefore = content.substring(0, lineStart);
      const expandedSelected = content.substring(lineStart, lineEnd);
      const expandedAfter = content.substring(lineEnd);
      
      const lines = expandedSelected.split('\n');
      
      // Check if lines already have THIS specific bullet
      const allHaveBullet = lines.every(line => line.trim().startsWith(bulletChar));

      const newLines = lines.map(line => {
          if (line.trim() === '') return line;
          
          if (allHaveBullet) {
              // Remove the specific bullet
              // Escape regex special chars
              const escapedBullet = bulletChar.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
              const regex = new RegExp(`^\\s*${escapedBullet}\\s?`);
              return line.replace(regex, '');
          } else {
              // Remove any existing other bullets first if simplistic replacement is desired,
              // or just prepend. Let's prepend to be safe or replace known bullets.
              // For simplicity, we prepend the new bullet.
              const knownBullets = [
                '•', '◦', '▪', '1.', '—', '-', '–',
                '✦', '➡️', '➤', '➜', '⬅️', '➝', '⤴', '⤵', '⤷', '⇨', '↔', '➔', 
                '⟶', '↩', '↓', '↕', '↺', '↻', '↗', '↴', '⇢', '↬', 
                '☑', '✔️', '✓', '➳', '⇄', '✨', '✅', '♻️', '➕', '⭐', '★', 
                '🔴', '🟢', '❌', '🔥', '👉', '⇒'
              ];
              
              let cleanLine = line;
              for(const b of knownBullets) {
                  if(cleanLine.trim().startsWith(b)) {
                      // rough removal
                       const escapedB = b.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
                       cleanLine = cleanLine.replace(new RegExp(`^\\s*${escapedB}\\s?`), '');
                       break;
                  }
              }
              return `${bulletChar} ${cleanLine.trimStart()}`;
          }
      });
      
      const newSelected = newLines.join('\n');
      const newContent = expandedBefore + newSelected + expandedAfter;
      
      updateContentWithHistory(newContent, true);
      
      setTimeout(() => {
        if(textareaRef.current) {
            textareaRef.current.focus();
            // Try to keep selection logical
            textareaRef.current.setSelectionRange(lineStart, lineStart + newSelected.length);
        }
      }, 0);
  };

  const applyStyle = (style: TextStyle, extraArg?: string) => {
    const el = textareaRef.current;
    // If we have a stored selection range, use it. If not (e.g. clicking static toolbar without active selection state), try current selection
    const range = selectionRange || (el && el.selectionStart !== el.selectionEnd ? { start: el.selectionStart, end: el.selectionEnd } : null);

    if (!el || !range) {
        // Allow list toggling even without selection (applies to current line)
        if(style === TextStyle.LIST && el) {
             toggleList(el.selectionStart, el.selectionEnd, extraArg);
        }
        return;
    }

    if (style === TextStyle.LIST) {
        toggleList(range.start, range.end, extraArg);
        return;
    }

    const before = content.substring(0, range.start);
    const selected = content.substring(range.start, range.end);
    const after = content.substring(range.end);

    let transformed = '';
    if (style === TextStyle.BOLD || style === TextStyle.ITALIC || style === TextStyle.UNDERLINE || style === TextStyle.STRIKETHROUGH) {
        transformed = toggleStyle(selected, style);
    } else {
        transformed = applyStyleToText(selected, style);
    }
    
    const newContent = before + transformed + after;

    updateContentWithHistory(newContent, true);
    
    // Keep selection range updated and focus
    setTimeout(() => {
        el.focus();
        el.setSelectionRange(range.start, range.start + transformed.length);
        setSelectionRange({ start: range.start, end: range.start + transformed.length });
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        if (e.key === 'z') { e.preventDefault(); handleUndo(); return; }
        if (e.key.toLowerCase() === 'b') { e.preventDefault(); applyStyle(TextStyle.BOLD); return; }
        if (e.key.toLowerCase() === 'i') { e.preventDefault(); applyStyle(TextStyle.ITALIC); return; }
        if (e.key.toLowerCase() === 'u') { e.preventDefault(); applyStyle(TextStyle.UNDERLINE); return; }
    }
    if (((e.ctrlKey || e.metaKey) && e.key === 'y') || ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        handleRedo();
        return;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div ref={containerRef} className="flex flex-col h-full bg-white/70 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden relative transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      
      {/* Header with Undo/Redo/Copy AND Toolbar */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100/50 min-h-[60px] relative z-20">
        
        {/* Left: Undo/Redo */}
        <div className="flex gap-2 text-gray-400 z-10 relative">
             <button onClick={handleUndo} disabled={!isUndoable} className={`p-1.5 rounded-lg transition-colors ${isUndoable ? 'hover:bg-gray-100 text-gray-600' : 'opacity-50 cursor-not-allowed'}`} title="Undo (Ctrl+Z)">
                 <Undo size={16} />
             </button>
             <button onClick={handleRedo} disabled={!isRedoable} className={`p-1.5 rounded-lg transition-colors ${isRedoable ? 'hover:bg-gray-100 text-gray-600' : 'opacity-50 cursor-not-allowed'}`} title="Redo (Ctrl+Y)">
                 <Redo size={16} />
             </button>
        </div>

        {/* Center: Toolbar */}
        <FloatingToolbar 
            visible={true} 
            onApplyStyle={applyStyle} 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />

        {/* Right: Copy */}
        <div className="flex gap-2 z-10 relative">
            <button onClick={copyToClipboard} className="text-gray-500 hover:text-black flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors px-3 py-1 rounded-full hover:bg-gray-100">
                {copySuccess ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
                {copySuccess ? "Copied" : "Copy"}
            </button>
        </div>
      </div>

      <div className="relative flex-1 p-0 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => updateContentWithHistory(e.target.value)}
          onSelect={handleSelect}
          onKeyDown={handleKeyDown}
          onKeyUp={handleSelect}
          onMouseUp={handleSelect}
          spellCheck="false"
          className="w-full h-full resize-none outline-none text-lg leading-relaxed text-gray-900 placeholder-gray-300 font-sans bg-transparent px-6 pt-6 pb-6"
          placeholder="Start writing your masterpiece here... (Select text to format)"
        />
      </div>

      {/* Action Bar */}
      <div className="px-6 py-4 border-t border-gray-100/50 bg-white/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <label className={`cursor-pointer p-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100 ${mediaCount > 0 ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500'}`}>
                <input type="file" accept="image/*,application/pdf" onChange={onMediaUpload} className="hidden" multiple />
                <Paperclip size={18} />
                {mediaCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full border border-white">{mediaCount}</span>
                )}
           </label>
           <span className="text-xs text-gray-400 font-medium">Add Media (Img/PDF)</span>
        </div>
        <div className="flex items-center gap-3">
             <div className="relative w-6 h-6 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                     <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-gray-200" />
                     <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="transparent" strokeDasharray={2 * Math.PI * 10} strokeDashoffset={2 * Math.PI * 10 * (1 - percentage / 100)} className="text-black transition-all duration-300" />
                 </svg>
             </div>
             <span className="text-xs font-semibold text-gray-400">{charCount} characters</span>
        </div>
      </div>
    </div>
  );
};

export default Editor;
