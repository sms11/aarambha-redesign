'use client';

import { useState } from 'react';
import { iconMap, getIcon } from '@/lib/icons';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
  error?: string;
}

// Friendly display names for non-technical users
const iconLabels: Record<string, string> = {
  SparklesIcon: 'Sparkles',
  StarIcon: 'Star',
  EyeIcon: 'Eye',
  RocketLaunchIcon: 'Rocket',
  ShieldCheckIconOutline: 'Shield',
  LightBulbIconOutline: 'Light Bulb',
  HeartIcon: 'Heart',
  AcademicCapIconOutline: 'Graduation Cap',
  GlobeAltIcon: 'Globe',
  ArrowTrendingUpIcon: 'Trending Up',
  PaintBrushIcon: 'Paint Brush',
  BookOpenIcon: 'Book',
  BeakerIcon: 'Beaker',
  MusicalNoteIcon: 'Music',
  ChatBubbleLeftRightIcon: 'Chat',
  UserGroupIconOutline: 'People',
  MapPinIcon: 'Map Pin',
  PhoneIcon: 'Phone',
  EnvelopeIcon: 'Email',
  ClockIcon: 'Clock',
  PaperAirplaneIcon: 'Send',
  CheckCircleIconOutline: 'Check',
  CheckCircleIconSolid: 'Check (solid)',
  ShieldCheckIconSolid: 'Shield (solid)',
  UserGroupIconSolid: 'People (solid)',
  AcademicCapIconSolid: 'Cap (solid)',
  HandRaisedIcon: 'Hand',
  BuildingOfficeIcon: 'Building',
  LightBulbIconSolid: 'Bulb (solid)',
  PresentationChartBarIcon: 'Chart',
  ShieldCheckIcon: 'Shield',
  LightBulbIcon: 'Light Bulb',
  AcademicCapIcon: 'Graduation Cap',
  UserGroupIcon: 'People',
  CheckCircleIcon: 'Check',
  CpuChipIcon: 'Chip',
};

const allIconNames = Object.keys(iconMap);

export default function IconPicker({ value, onChange, label, error }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const SelectedIcon = value ? getIcon(value) : null;

  const filteredIcons = allIconNames.filter((name) => {
    const friendlyName = iconLabels[name] || name;
    return friendlyName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">
          {label}
        </label>
      )}

      {/* Selected icon display / trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition-all ${
          isOpen
            ? 'border-[#8B5CF6] ring-2 ring-[#8B5CF6]/20'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        {SelectedIcon ? (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100">
            <SelectedIcon className="h-5 w-5 text-[#8B5CF6]" />
          </div>
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
        )}
        <span className={value ? 'text-[#1B2A4A] font-medium' : 'text-gray-400'}>
          {value ? (iconLabels[value] || value) : 'Choose an icon...'}
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

      {/* Dropdown grid */}
      {isOpen && (
        <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg shadow-black/5">
          {/* Search */}
          <div className="mb-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icons..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
              autoFocus
            />
          </div>

          {/* Icon grid */}
          <div className="grid max-h-56 grid-cols-6 gap-1.5 overflow-y-auto">
            {filteredIcons.map((name) => {
              const Icon = getIcon(name);
              if (!Icon) return null;
              const isSelected = value === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    onChange(name);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`group relative flex h-11 w-full items-center justify-center rounded-lg transition-all ${
                    isSelected
                      ? 'bg-[#8B5CF6] text-white ring-2 ring-[#8B5CF6]/30'
                      : 'bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-[#8B5CF6]'
                  }`}
                  title={iconLabels[name] || name}
                >
                  <Icon className="h-5 w-5" />
                  {/* Tooltip */}
                  <span className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1B2A4A] px-2 py-1 text-[10px] text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                    {iconLabels[name] || name}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredIcons.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-400">No icons match your search</p>
          )}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
