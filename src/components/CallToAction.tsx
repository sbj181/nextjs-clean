import Link from 'next/link';

interface CTAProps {
  title: string;
  subtitle?: React.ReactNode; // Allow subtitle to contain HTML elements
}

export default function CallToAction({ title, subtitle }: CTAProps) {
  return (
    <div className="ctaWrap border-2 rounded-xl bg-slate-50 border-slate-50 bg-opacity-50 p-6 mt-auto">
      
      <div className='flex gap-4 items-center'>
        <div className='text-3xl mb-4'>👋</div>
        <h2 className="text-xl leading-tight mb-4 font-bold w-full">{title}</h2>
      </div>
      {subtitle && <p className="subtitle text-sm text-center w-full">{subtitle}</p>}
          <Link href="https://thegrovery.com">
            <div className="cardDetailsBtn w-unset text-center mt-4">
              Contact us
            </div>
          </Link>
    </div>
  );
}
