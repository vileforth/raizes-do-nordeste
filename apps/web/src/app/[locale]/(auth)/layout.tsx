export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ background: 'var(--raizes-canvas-gradient)' }}
    >
      <div className="w-full max-w-md surface-card p-8">{children}</div>
    </div>
  );
}
