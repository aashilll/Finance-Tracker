import { Header } from "@/components/Header";
import { PageTransition } from "@/components/PageTransition";

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 overflow-x-hidden">
      <Header />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-full">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}


