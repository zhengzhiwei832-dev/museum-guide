interface InfoItem {
  icon: string;
  title: string;
  content: string;
}

interface InfoBlockProps {
  items: InfoItem[];
}

export default function InfoBlock({ items }: InfoBlockProps) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex gap-3 items-start"
        >
          <span className="text-xl flex-shrink-0 leading-none pt-0.5">{item.icon}</span>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-brown mb-1">{item.title}</h4>
            <p className="text-sm leading-relaxed text-brown-light whitespace-pre-line">{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
