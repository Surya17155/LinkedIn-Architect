
import React, { useState, useEffect, useRef } from 'react';
import { Bold, Italic, Underline, Strikethrough, Type, List, ChevronDown } from 'lucide-react';
import { TextStyle } from '../types';

interface FloatingToolbarProps {
  visible: boolean;
  onApplyStyle: (style: TextStyle, arg?: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ visible, onApplyStyle, style, className }) => {
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
  const [listDropdownOpen, setListDropdownOpen] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setFontDropdownOpen(false);
        setListDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!visible) return null;

  const fontOptions = [
    { label: 'Normal', style: TextStyle.NORMAL, preview: 'Normal Text' },
    { label: 'Serif Bold', style: TextStyle.SERIF_BOLD, preview: '𝐒𝐞𝐫𝐢𝐟 𝐁𝐨𝐥𝐝' },
    { label: 'Serif Italic', style: TextStyle.SERIF_ITALIC, preview: '𝑆𝑒𝑟𝑖𝑓 𝐼𝑡𝑎𝑙𝑖𝑐' },
    { label: 'Script', style: TextStyle.SCRIPT, preview: '𝒮𝒸𝓇𝒾𝓅𝓉' },
    { label: 'Bold Script', style: TextStyle.BOLD_SCRIPT, preview: '𝓑𝓸𝓵𝓭 𝓢𝓬𝓻𝓲𝓹𝓽' },
    { label: 'Fraktur', style: TextStyle.FRAKTUR, preview: '𝔉𝔯𝔞𝔨𝔱𝔲𝔯' },
    { label: 'Bold Fraktur', style: TextStyle.BOLD_FRAKTUR, preview: '𝕭𝖔𝖑𝖉 𝕱𝖗𝖆𝖐𝖙𝖚𝖗' },
    { label: 'Double Struck', style: TextStyle.DOUBLE_STRUCK, preview: '𝔻𝕠𝕦𝕓𝕝𝕖 𝕊𝕥𝕣𝕦𝕔𝕜' },
    { label: 'Monospace', style: TextStyle.MONOSPACE, preview: '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎', className: 'font-mono' },
    { label: 'Circled', style: TextStyle.CIRCLED, preview: 'Ⓒⓘⓡⓒⓛⓔⓓ' },
    { label: 'Squared', style: TextStyle.SQUARED, preview: '🆂ﻖ🆄🅰🆁🅴🅳' },
  ];

  const listOptions = [
      // Row 1
      { char: '•', label: 'Bullet' },
      { char: '1.', label: 'Number' },
      { char: '✦', label: 'Star 4-point' },
      { char: '—', label: 'Em Dash' },
      { char: '-', label: 'Hyphen' },
      { char: '➡️', label: 'Blue Arrow Right' },
      { char: '➤', label: 'Arrow Head' },
      { char: '➜', label: 'Heavy Arrow' },

      // Row 2
      { char: '⬅️', label: 'Blue Arrow Left' },
      { char: '➝', label: 'Arrow Right' },
      { char: '⤴', label: 'Curve Up' },
      { char: '⤵', label: 'Curve Down' },
      { char: '⤷', label: 'Curve Down Right' },
      { char: '⇨', label: 'Hollow Arrow' },
      { char: '↔', label: 'Left Right' },
      { char: '➔', label: 'Thick Arrow' },

      // Row 3
      { char: '⟶', label: 'Long Arrow' },
      { char: '↩', label: 'Return' },
      { char: '↓', label: 'Down' },
      { char: '↕', label: 'Up Down' },
      { char: '↺', label: 'CCW' },
      { char: '↻', label: 'CW' },
      { char: '↗', label: 'Up Right' },
      { char: '⇒', label: 'Double Arrow' }, // Added to fill row

      // Row 4
      { char: '↴', label: 'Down Left' },
      { char: '⇢', label: 'Dotted' },
      { char: '➜', label: 'Heavy Arrow' },
      { char: '↬', label: 'Loop' },
      { char: '☑', label: 'Check Box' },
      { char: '✔️', label: 'Check Emoji' },
      { char: '✓', label: 'Check' },
      { char: '✅', label: 'Green Check' },

      // Row 5
      { char: '➳', label: 'Teardrop Arrow' },
      { char: '⇄', label: 'Swap' },
      { char: '✨', label: 'Sparkles' },
      { char: '♻️', label: 'Recycle' },
      { char: '➕', label: 'Plus' },
      { char: '⭐', label: 'Star' },
      { char: '★', label: 'Black Star' },
      { char: '👉', label: 'Finger' },
      
      // Row 6
      { char: '🔴', label: 'Red Circle' },
      { char: '🟢', label: 'Green Circle' },
      { char: '❌', label: 'Cross' },
      { char: '🔥', label: 'Fire' },
      { char: '▪', label: 'Square' },
      { char: '◦', label: 'Hollow Bullet' },
  ];

  return (
    <div 
      ref={toolbarRef}
      className={`z-50 flex flex-col items-center animate-in fade-in zoom-in duration-200 ${className || ''}`}
      style={style}
      onMouseDown={(e) => e.preventDefault()} // Prevent losing focus from textarea
    >
      <div className="flex items-center gap-1 px-3 py-2 bg-white/80 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] text-gray-700 ring-1 ring-black/5">
        
        {/* BOLD */}
        <button 
            onClick={() => onApplyStyle(TextStyle.BOLD)} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 hover:text-black transition-all active:scale-95" 
            title="Bold"
        >
            <Bold size={16} strokeWidth={2.5} />
        </button>

        {/* ITALIC */}
        <button 
            onClick={() => onApplyStyle(TextStyle.ITALIC)} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 hover:text-black transition-all active:scale-95" 
            title="Italic"
        >
            <Italic size={16} />
        </button>

        {/* UNDERLINE */}
        <button 
            onClick={() => onApplyStyle(TextStyle.UNDERLINE)} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 hover:text-black transition-all active:scale-95" 
            title="Underline"
        >
            <Underline size={16} />
        </button>

        {/* STRIKETHROUGH */}
        <button 
            onClick={() => onApplyStyle(TextStyle.STRIKETHROUGH)} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 hover:text-black transition-all active:scale-95" 
            title="Strikethrough"
        >
            <Strikethrough size={16} />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 mx-1"></div>

        {/* FONT DROPDOWN (Aa) */}
        <div className="relative">
            <button 
                onClick={() => {
                    setFontDropdownOpen(!fontDropdownOpen);
                    setListDropdownOpen(false);
                }}
                className={`flex items-center gap-1 pl-2 pr-1 h-8 rounded-full hover:bg-black/5 hover:text-black transition-all ${fontDropdownOpen ? 'bg-black/5 text-black' : ''}`}
                title="Font Styles"
            >
                <Type size={16} />
                <ChevronDown size={12} className="opacity-50" />
            </button>
            
            {fontDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl overflow-y-auto max-h-[300px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] w-[220px] flex flex-col p-1.5 z-[1001] animate-in fade-in zoom-in-95 duration-150 scrollbar-hide">
                    {fontOptions.map((opt) => (
                        <button 
                            key={opt.style}
                            onClick={() => { onApplyStyle(opt.style); setFontDropdownOpen(false); }} 
                            className={`px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-black/5 rounded-lg transition-colors flex items-center justify-between group ${opt.className || ''}`}
                        >
                            <span className="text-base truncate">{opt.preview}</span>
                            {opt.style === TextStyle.NORMAL && <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Reset</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 mx-1"></div>

        {/* LIST DROPDOWN */}
        <div className="relative">
            <button 
                onClick={() => {
                    setListDropdownOpen(!listDropdownOpen);
                    setFontDropdownOpen(false);
                }} 
                className={`flex items-center gap-1 pl-2 pr-1 h-8 rounded-full hover:bg-black/5 hover:text-black transition-all ${listDropdownOpen ? 'bg-black/5 text-black' : ''}`}
                title="List Styles"
            >
                <List size={16} />
                <ChevronDown size={12} className="opacity-50" />
            </button>

            {listDropdownOpen && (
                <div className="absolute top-full right-0 mt-3 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] w-[320px] p-2 z-[1001] animate-in fade-in zoom-in-95 duration-150">
                    <div className="grid grid-cols-8 gap-1">
                        {listOptions.map((opt, i) => (
                             <button
                                key={i}
                                onClick={() => { onApplyStyle(TextStyle.LIST, opt.char); setListDropdownOpen(false); }}
                                className="aspect-square flex flex-col items-center justify-center rounded-lg hover:bg-black/5 text-gray-800 transition-colors group"
                                title={opt.label}
                             >
                                 <span className="text-lg font-medium leading-none">{opt.char}</span>
                             </button>
                        ))}
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default FloatingToolbar;
