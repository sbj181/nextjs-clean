import Link from 'next/link';

interface WelcomeProps {
  title: string;
  subtitle?: React.ReactNode; // Allow subtitle to contain HTML elements
}

export default function Welcome({ title, subtitle }: WelcomeProps) {
  return (
    <div className="welcome__container text-center md:text-left my-4 !px-0">
      <h1 className="leading-tight text-[32px] lg:text-[42px] mb-2 font-bold  w-full">{title}</h1>
      {subtitle && <h2 className="subtitle font-medium w-full">{subtitle}</h2>}
    </div>
  );
}
