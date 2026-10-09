export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 px-4 py-5 text-center text-xs text-slate-500 sm:px-8">
      © {new Date().getFullYear()} SecureBank. Portfolio demonstration only.
    </footer>
  );
}