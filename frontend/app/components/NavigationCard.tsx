import Link from "next/link";

interface NavigationCardProps {
  href: string;
  bgColor: string;
  hoverColor: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export default function NavigationCard({
  href,
  bgColor,
  hoverColor,
  icon,
  title,
  description,
  features,
}: NavigationCardProps) {
  return (
    <Link href={href}>
      <div
        className={`${bgColor} ${hoverColor} border-[3px] border-neutral-800 rounded-sm p-6 hover:transition-colors h-full`}
      >
        <div className="bg-neutral-100 border-[3px] border-neutral-800 rounded-sm h-40 mb-4 flex items-center justify-center">
          <div className="text-6xl">{icon}</div>
        </div>

        <h3 className="text-2xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-white/90 mb-3">{description}</p>

        <div className="space-y-1 text-sm text-white/80">
          {features.map((feature, index) => (
            <p key={index}>• {feature}</p>
          ))}
        </div>
      </div>
    </Link>
  );
}
