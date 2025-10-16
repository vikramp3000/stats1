interface StatCardProps {
  label: string;
  value: number;
  emoji?: string;
}

export default function StatCard({ label, value, emoji }: StatCardProps) {
  return (
    <div className="border-[3px] border-neutral-800 rounded-sm p-4 bg-neutral-300">
      <p className="text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold">
        {emoji && <span className="mr-2">{emoji}</span>}
        {value}
      </p>
    </div>
  );
}
