import { Toaster } from 'sonner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#111118', border: '1px solid rgba(255,255,255,0.07)', color: '#e8e6f0' },
      }} />
    </>
  );
}
