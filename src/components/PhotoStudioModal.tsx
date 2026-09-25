import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Upload,
  Sliders,
  MapPin,
  Sparkles,
  Crop,
  Check,
  Image as ImageIcon,
} from 'lucide-react';

export const PhotoStudioModal: React.FC = () => {
  const { isCreateModalOpen, setIsCreateModalOpen, createPost } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample presets for quick testing
  const samplePresets = [
    {
      name: 'Vibrant Holi',
      url: '/src/assets/images/instaindia_holi_celebration_1790315680476.jpg',
    },
    {
      name: 'Jaipur Sunset',
      url: '/src/assets/images/instaindia_jaipur_hawa_mahal_1790315697763.jpg',
    },
    {
      name: 'Kerala Palms',
      url: '/src/assets/images/instaindia_kerala_backwaters_1790315713531.jpg',
    },
    {
      name: 'Varanasi Aarti',
      url: '/src/assets/images/instaindia_varanasi_ganga_aarti_1790315729228.jpg',
    },
  ];

  const [selectedImage, setSelectedImage] = useState<string>(samplePresets[0].url);
  const [selectedFilter, setSelectedFilter] = useState('filter-vibrant-holi');
  const [aspectRatio, setAspectRatio] = useState<'square' | 'portrait' | 'landscape'>('square');
  const [brightness, setBrightness] = useState(105);
  const [contrast, setContrast] = useState(115);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('Vrindavan, Mathura');
  const [tags, setTags] = useState<string[]>(['#InstaIndia', '#VibrantColors', '#IncredibleIndia']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCreateModalOpen) return null;

  const filters = [
    { id: 'filter-normal', name: 'Original', class: 'filter-normal' },
    { id: 'filter-vibrant-holi', name: 'Holi Colors', class: 'filter-vibrant-holi' },
    { id: 'filter-jaipur-pink', name: 'Jaipur Pink', class: 'filter-jaipur-pink' },
    { id: 'filter-kerala-emerald', name: 'Kerala Emerald', class: 'filter-kerala-emerald' },
    { id: 'filter-saffron-sunset', name: 'Saffron Glow', class: 'filter-saffron-sunset' },
    { id: 'filter-bollywood-glam', name: 'Bollywood Glam', class: 'filter-bollywood-glam' },
    { id: 'filter-varanasi-golden', name: 'Varanasi Gold', class: 'filter-varanasi-golden' },
    { id: 'filter-mumbai-neon', name: 'Mumbai Neon', class: 'filter-mumbai-neon' },
    { id: 'filter-kashmir-cool', name: 'Kashmir Chill', class: 'filter-kashmir-cool' },
  ];

  const locations = [
    'City Palace, Udaipur',
    'Colaba & Kala Ghoda, Mumbai',
    'Lutyens, New Delhi',
    'Amer Fort, Jaipur',
    'Ghats of Varanasi',
    'Indiranagar, Bengaluru',
    'Victoria Memorial, Kolkata',
    'Fontainhas, Goa',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      createPost({
        mediaUrl: selectedImage,
        mediaType: 'image',
        caption: caption.trim() || 'A study in Indian monochrome. Captured for InstaIndia.',
        location,
        filter: selectedFilter,
        aspectRatio,
        tags,
      });
      setIsSubmitting(false);
      setIsCreateModalOpen(false);
      // Reset
      setCaption('');
    }, 400);
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const suggestedTags = ['#InstaIndia', '#Monochrome', '#Heritage', '#Architecture', '#Couture', '#Mumbai'];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-2 md:p-4 select-none">
      <div
        className="absolute inset-0"
        onClick={() => setIsCreateModalOpen(false)}
      />

      <div className="relative z-10 w-full max-w-4xl bg-[#0c0c0c] border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        {/* Header (Mobile) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#080808]">
          <h2 className="text-sm font-semibold text-white tracking-wide">Photo Studio</h2>
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="p-1 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LEFT COLUMN: Media Preview & Presets */}
        <div className="flex-1 bg-black flex flex-col justify-between overflow-hidden border-r border-white/10">
          {/* Main Visual Display */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden p-4 min-h-[300px] md:min-h-[440px]">
            <div
              className={`relative overflow-hidden rounded-xl border border-white/10 shadow-2xl transition-all ${
                aspectRatio === 'square'
                  ? 'aspect-square w-full max-w-[400px]'
                  : aspectRatio === 'portrait'
                  ? 'aspect-[4/5] w-full max-w-[360px]'
                  : 'aspect-video w-full max-w-[440px]'
              }`}
            >
              <img
                src={selectedImage}
                alt="Upload preview"
                className={`w-full h-full object-cover transition-all duration-200 ${selectedFilter}`}
                style={{
                  filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                }}
              />
            </div>
          </div>

          {/* Quick Presets & Upload Trigger Bar */}
          <div className="p-3 bg-[#0a0a0a] border-t border-white/10 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
            </div>

            {/* Preset Thumbnails */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 uppercase tracking-wider shrink-0 hidden sm:inline">
                Presets:
              </span>
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(preset.url)}
                  className={`w-8 h-8 rounded-lg overflow-hidden border shrink-0 transition-transform ${
                    selectedImage === preset.url
                      ? 'border-white scale-110 ring-1 ring-white/50'
                      : 'border-white/20 opacity-70 hover:opacity-100'
                  }`}
                  title={preset.name}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-full object-cover grayscale"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Controls, Filters & Details */}
        <div className="w-full md:w-80 lg:w-96 flex flex-col justify-between bg-[#0e0e0e] overflow-y-auto luxury-scrollbar">
          {/* Desktop Close */}
          <div className="hidden md:flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white/80" />
              <span>Curation & Studio</span>
            </h2>
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="p-1 rounded-full text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-5 flex-1">
            {/* Aspect Ratio Selector */}
            <div>
              <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block mb-2">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['square', 'portrait', 'landscape'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-1.5 px-3 rounded-lg text-xs capitalize transition-colors ${
                      aspectRatio === ratio
                        ? 'bg-white text-black font-semibold'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {ratio === 'square' ? '1:1 Square' : ratio === 'portrait' ? '4:5 Portrait' : '16:9 Wide'}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Carousel */}
            <div>
              <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block mb-2">
                Monochrome & Editorial Filters
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto luxury-scrollbar p-1">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFilter(f.class)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      selectedFilter === f.class
                        ? 'border-white bg-white/15 text-white shadow-sm'
                        : 'border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:border-white/30'
                    }`}
                  >
                    <span className="block text-[11px] font-medium truncate">
                      {f.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fine-Tuning Sliders */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div>
                <div className="flex items-center justify-between text-[11px] text-white/60 mb-1">
                  <span>Brightness</span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="140"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-white h-1 bg-white/20 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] text-white/60 mb-1">
                  <span>Contrast</span>
                  <span>{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="170"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-white h-1 bg-white/20 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Caption Textarea */}
            <div className="pt-2 border-t border-white/5">
              <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block mb-1.5">
                Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write an architectural or luxury description..."
                rows={3}
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40 resize-none transition-colors"
              />
            </div>

            {/* Location Tag */}
            <div>
              <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Location</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 rounded-xl bg-[#141414] border border-white/15 text-xs text-white focus:outline-none focus:border-white/40"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc} className="bg-[#141414] text-white">
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Hashtag Suggestions */}
            <div>
              <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider block mb-1.5">
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {suggestedTags.map((tag) => {
                  const isActive = tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-[10px] px-2.5 py-1 rounded-full border transition-colors ${
                        isActive
                          ? 'bg-white text-black border-white font-medium'
                          : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="p-4 border-t border-white/10 bg-[#080808]">
            <button
              onClick={handlePublish}
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
            >
              {isSubmitting ? (
                <span>Publishing to Feed...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish to InstaIndia</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
