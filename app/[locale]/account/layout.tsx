import Navigation from '@/components/Navigation';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen'>
      <Navigation />
      <main>{children}</main>
    </div>
  );
}
