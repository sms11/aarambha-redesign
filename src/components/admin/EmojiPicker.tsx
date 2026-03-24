'use client';

import { useState } from 'react';

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  label?: string;
  error?: string;
}

const emojiCategories = [
  {
    label: 'School',
    emojis: ['🎓', '📚', '✏️', '📖', '🏫', '🎒', '📝', '🔬', '🧪', '🔭', '🧮', '🗺️', '🌍', '📐', '📏', '🖊️', '🖋️', '📌'],
  },
  {
    label: 'People',
    emojis: ['👥', '👨‍🏫', '👩‍🏫', '👨‍🎓', '👩‍🎓', '🧑‍🤝‍🧑', '👋', '🤝', '🙌', '👏', '💪', '🧒', '👦', '👧', '👶'],
  },
  {
    label: 'Activities',
    emojis: ['⚽', '🏀', '🎨', '🎵', '🎭', '🎪', '🏃', '🏊', '🚴', '🧘', '🎯', '♟️', '🎲', '🎤', '🎸', '🥁'],
  },
  {
    label: 'Nature',
    emojis: ['🌱', '🌿', '🌳', '🌻', '🌈', '☀️', '🌙', '⭐', '🦋', '🐝', '🌸', '🍀', '🍎', '🌺'],
  },
  {
    label: 'Symbols',
    emojis: ['✨', '💡', '🔥', '💫', '⚡', '🎯', '🏆', '🥇', '🏅', '🎖️', '❤️', '💙', '💜', '💚', '🧡', '💛', '✅', '⭕', '🔑', '🛡️'],
  },
  {
    label: 'Objects',
    emojis: ['💻', '📱', '🖥️', '⌨️', '🔧', '🔨', '⚙️', '🧩', '📊', '📈', '📋', '📦', '🎁', '🏠', '🚌', '✈️', '🚀', '💼'],
  },
  {
    label: 'Hands',
    emojis: ['👍', '✌️', '🤞', '🫶', '🙏', '👐', '🤲', '💝', '🎉', '🎊', '🥳', '😊', '😃', '🤗', '🫡'],
  },
];

export default function EmojiPicker({ value, onChange, label, error }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">
          {label}
        </label>
      )}

      {/* Selected emoji trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition-all ${
          isOpen
            ? 'border-[#FF6B35] ring-2 ring-[#FF6B35]/20'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-xl">
          {value || '➕'}
        </span>
        <span className={value ? 'text-[#1B2A4A] font-medium' : 'text-gray-400'}>
          {value ? `${value}  Selected` : 'Choose an emoji...'}
        </span>
        <svg
          className={`ml-auto h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg shadow-black/5">
          {/* Category tabs */}
          <div className="mb-3 flex flex-wrap gap-1">
            {emojiCategories.map((cat, i) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => setActiveCategory(i)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  activeCategory === i
                    ? 'bg-[#FF6B35] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-[#FF6B35]'
                }`}
              >
                {cat.emojis[0]} {cat.label}
              </button>
            ))}
          </div>

          {/* Emoji grid */}
          <div className="grid grid-cols-8 gap-1">
            {emojiCategories[activeCategory].emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onChange(emoji);
                  setIsOpen(false);
                }}
                className={`flex h-10 w-full items-center justify-center rounded-lg text-xl transition-all ${
                  value === emoji
                    ? 'bg-[#FF6B35] ring-2 ring-[#FF6B35]/30 scale-110'
                    : 'hover:bg-orange-50 hover:scale-110'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
