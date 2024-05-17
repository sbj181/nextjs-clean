import Link from 'next/link';

interface WelcomeProps {
  title: string;
  subtitle?: React.ReactNode; // Allow subtitle to contain HTML elements
}

export default function Welcome({ title, subtitle }: WelcomeProps) {
  return (
    <div className="welcome__container">
      <h1 className=" leading-tight text-[32px] lg:text-[52px] mb-4 font-bold text-center w-full">{title}</h1>
      {subtitle && <h2 className="subtitle font-medium text-center w-full">{subtitle}</h2>}
    </div>
  );
}
