interface TopicFilterBarProps {
  topics: string[];
  active: string;
  onSelect: (topic: string) => void;
}

const TopicFilterBar = ({ topics, active, onSelect }: TopicFilterBarProps) => {
  const handleClick = (topic: string) => {
    if (topic === active) {
      onSelect("All");
    } else {
      onSelect(topic);
    }
  };

  return (
    <div className="pt-2 pb-0 mb-4 overflow-x-auto scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
      <div className="flex items-center gap-0 flex-nowrap min-w-max md:min-w-0 md:flex-wrap">
        {topics.map((topic, i) => (
          <span key={topic} className="flex items-center">
            {i > 0 && <span className="mx-2 text-[#ccc] text-[11px]">·</span>}
            <button
              onClick={() => handleClick(topic)}
              className={`text-[13px] uppercase tracking-[0.12em] transition-colors ${
                active === topic
                  ? "text-[#111] border-b-2 border-accent-orange pb-0.5"
                  : "text-[#999] hover:text-[#666]"
              }`}
            >
              {topic}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TopicFilterBar;
