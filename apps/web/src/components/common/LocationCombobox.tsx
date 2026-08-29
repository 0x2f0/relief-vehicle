import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Compass, Check, ChevronDown, X } from 'lucide-react';
import { searchNepalPlaces, NepalLocation } from '../../lib/nepalPlaces';

interface LocationComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  name?: string;
  categories?: NepalLocation['category'][];
  className?: string;
  id?: string;
  disabled?: boolean;
  isMultiComma?: boolean;
  hasError?: boolean;
}

export const LocationCombobox: React.FC<LocationComboboxProps> = ({
  value,
  onChange,
  placeholder = 'Search district, municipality, hub, or highway…',
  required = false,
  name,
  categories,
  className = '',
  id,
  disabled = false,
  isMultiComma = false,
  hasError = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // For multi-comma inputs (e.g. checkpoints), extract the active typing token
  const getActiveQuery = (fullVal: string) => {
    if (!isMultiComma) return fullVal;
    const parts = fullVal.split(',');
    return parts[parts.length - 1]?.trim() || '';
  };

  // Get matching suggestions
  const activeToken = isMultiComma ? getActiveQuery(value) : value;
  const suggestions = searchNepalPlaces(isOpen ? (searchQuery || activeToken) : activeToken, categories, 10);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (place: NepalLocation) => {
    if (isMultiComma) {
      const parts = value.split(',').map((p) => p.trim()).filter(Boolean);
      if (parts.length > 0) {
        // Replace last element with selected place name
        parts[parts.length - 1] = place.name;
        onChange(parts.join(', ') + ', ');
      } else {
        onChange(place.name + ', ');
      }
    } else {
      onChange(place.name);
    }
    setIsOpen(false);
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % Math.max(1, suggestions.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % Math.max(1, suggestions.length));
    } else if (e.key === 'Enter') {
      if (suggestions[highlightedIndex]) {
        e.preventDefault();
        handleSelect(suggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const getCategoryBadge = (category: NepalLocation['category']) => {
    switch (category) {
      case 'District':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-[#0447AF] border border-blue-200/60">District</span>;
      case 'City / Hub':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">City / Hub</span>;
      case 'Relief Point':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-[#CC1424] border border-rose-200/60">Relief Hub</span>;
      case 'Highway':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200/60">Highway</span>;
      case 'Checkpoint':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/60">Checkpoint</span>;
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <MapPin className="w-4 h-4 text-slate-400" />
        </div>

        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          required={required}
          disabled={disabled}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setSearchQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full pl-9 pr-14 py-2.5 text-sm border rounded-lg bg-white transition-all outline-none ${
            hasError
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-slate-300 focus:border-[#0447AF] focus:ring-2 focus:ring-[#0447AF]/15'
          } ${className}`}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 gap-1">
          {value && !disabled && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setSearchQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              aria-label="Clear location"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            tabIndex={-1}
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
            aria-label="Toggle location dropdown"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#0447AF]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Autocomplete Suggestions Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white rounded-xl shadow-lg border border-slate-200/90 py-1.5 max-h-72 overflow-y-auto divide-y divide-slate-100 animate-in fade-in-50 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/80 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#0447AF]" />
              Nepal Geographic & Transit Registry
            </span>
            <span className="text-[9px] text-slate-400 lowercase font-normal">
              {suggestions.length} matched
            </span>
          </div>

          {suggestions.length > 0 ? (
            suggestions.map((place, idx) => {
              const isSelected = value.toLowerCase().includes(place.name.toLowerCase());
              const isHighlighted = idx === highlightedIndex;

              return (
                <button
                  key={`${place.name}-${idx}`}
                  type="button"
                  onClick={() => handleSelect(place)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`w-full text-left px-3.5 py-2.5 text-xs flex items-start justify-between gap-3 transition-colors ${
                    isHighlighted ? 'bg-blue-50/80 text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-[13px]">
                        {place.name}
                      </span>
                      {place.name_ne && (
                        <span className="text-[11px] font-medium text-slate-500 font-sans">
                          {place.name_ne}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 truncate">
                      {place.province && <span>{place.province}</span>}
                      {place.district && <span>• {place.district}</span>}
                      {place.description && <span className="truncate text-slate-400 text-[10px]">• {place.description}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                    {getCategoryBadge(place.category)}
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#0447AF]" />}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-4 text-center text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Custom Point Entered: "{searchQuery || activeToken}"</p>
              <p className="text-[11px] text-slate-400">
                You can submit any local ward, tole, relief tent, or landmark in Nepal.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
