import Nav from "@/app/Nav";
import Footer from "@/app/Footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <main className="min-h-screen flex flex-col items-center">
        <div className="w-full flex flex-col gap-10 items-center">
          <Nav />
          <div className="w-full lg:w-5/6 mx-auto px-5 sm:px-6 md:px-8 flex flex-col ">
            {children}
          </div>
        </div>
      </main>
      <p className="py-12"></p>
      <Footer />
    </div>
  );
}
