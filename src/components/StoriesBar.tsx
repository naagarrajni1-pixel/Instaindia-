import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Plus } from 'lucide-react';

export const StoriesBar: React.FC = () => {
  const { stories, setActiveStoryIndex, currentUser, createStory } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddStory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          createStory({
            mediaUrl: event.target.result as string,
            caption: 'Monochrome Moment ✨',
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full border-b border-white/10 bg-[#080808] py-4 px-4 overflow-x-auto no-scrollbar">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAddStory}
        accept="image/*"
        className="hidden"
      />

      <div className="flex items-center gap-4 min-w-max">
        {/* User's Own Story Trigger */}
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
          <div className="relative">
            <div
              onClick={() => {
                const userStoryIndex = stories.findIndex((s) => s.userId === currentUser.id);
                if (userStoryIndex !== -1) {
                  setActiveStoryIndex(userStoryIndex);
                } else {
                  fileInputRef.current?.click();
                }
              }}
              className="w-17 h-17 rounded-full p-[2.5px] bg-gradient-to-tr from-[#FF671F] via-white to-[#046A38] group-hover:scale-105 transition-all shadow-md overflow-hidden"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#046A38] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              title="Add to story"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
          <span className="text-[11px] font-medium text-white/90 max-w-[68px] truncate group-hover:text-white transition-colors">
            Your Story
          </span>
        </div>

        {/* Stories from Indian Creators with Tricolour Rings */}
        {stories.map((story, index) => {
          if (story.userId === currentUser.id) return null;
          return (
            <div
              key={story.id}
              onClick={() => setActiveStoryIndex(index)}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div
                className={`w-17 h-17 rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 shadow-md ${
                  story.hasSeen
                    ? 'border-2 border-white/20'
                    : 'bg-gradient-to-tr from-[#FF671F] via-white to-[#046A38] shadow-[0_0_14px_rgba(255,103,31,0.35)]'
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900 border-2 border-black">
                  <img
                    src={story.user.avatar}
                    alt={story.user.username}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-white/80 max-w-[68px] truncate group-hover:text-white transition-colors">
                {story.user.username.split('.')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
