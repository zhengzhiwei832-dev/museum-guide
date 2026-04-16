import { motion } from 'framer-motion';

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
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.08 }}
          className="flex gap-3"
        >
          <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-brown mb-1">{item.title}</h4>
            <p className="text-sm leading-relaxed text-brown-light whitespace-pre-line">{item.content}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
