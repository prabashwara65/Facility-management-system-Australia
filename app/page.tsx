import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import {
  ShieldCheck,
  Flag,
  BadgeCheck,
  Star,
  Recycle,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#243453] text-white">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[calc(100vh-82px)] overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/cleaning-hero.jpg')",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#1d2d4d]/90" />

        {/* Content */}
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-82px)] max-w-[1600px] items-center px-6 py-12 lg:px-10">
          <div className="max-w-[680px]">
            {/* Badge */}
            <div className="mb-7 inline-flex rounded-full border border-[#c99a32] bg-[#263856]/60 px-4 py-2">
              <span className="text-xs font-semibold tracking-[0.08em] text-[#d4a438]">
                MELBOURNE'S MOST TRUSTED
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-[42px] font-medium leading-[1.02] tracking-tight sm:text-[48px] md:text-[56px] lg:text-[64px]">
              A Home That Feels
              <span className="mt-1 block italic text-[#d2a037]">
                Truly Clean.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-[590px] text-[15px] font-medium leading-[1.75] text-white/75 sm:text-base">
              Professional end-of-lease, deep, and regular cleaning across
              Melbourne — backed by our 100% bond-back guarantee and 48-hour
              re-clean promise.
            </p>

            {/* Buttons */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-md bg-[#d0a037] px-8 py-3 text-[15px] font-bold text-white transition-all hover:-translate-y-1 hover:bg-[#dfae45]">
                Book Now
              </button>

              <button className="rounded-md border-2 border-white/40 px-8 py-3 text-[15px] font-bold text-white transition-all hover:bg-white/10">
                Call Us Now
              </button>
            </div>
          </div>
        </div>

        {/* TRUST BAR */}
        <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/15 bg-[#30405f]/85">
          <div className="mx-auto grid max-w-[1600px] grid-cols-2 lg:grid-cols-5">
            <TrustItem
              icon={<ShieldCheck size={22} />}
              title="100% Satisfaction"
              subtitle="Guaranteed"
            />
            <TrustItem
              icon={<Flag size={21} />}
              title="Fully Insured"
              subtitle="& Bonded"
            />
            <TrustItem
              icon={<BadgeCheck size={22} />}
              title="Police-Checked"
              subtitle="Team Members"
            />
            <TrustItem
              icon={<Star size={22} />}
              title="4.9 / 5 Stars"
              subtitle="1,200+ Reviews"
            />
            <TrustItem
              icon={<Recycle size={22} />}
              title="Eco-Friendly"
              subtitle="Products Used"
            />
          </div>
        </div>

        {/* Chat */}
        <button
          className="absolute bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#d0a037] shadow-xl"
          aria-label="Open chat"
        >
          <div className="flex h-6 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-[#243453]">
            ...
          </div>
        </button>
      </section>

      {/* SERVICES SECTION - Imported Component */}
      <Services />
    </main>
  );
}

function TrustItem({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-2.5 border-r border-white/10 px-4 py-4 last:border-r-0 lg:px-6">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#d0a037] text-[#d0a037]">
        {icon}
      </div>

      <div>
        <div className="whitespace-nowrap text-xs font-bold text-white sm:text-sm">
          {title}
        </div>

        <div className="text-xs text-white/55">
          {subtitle}
        </div>
      </div>
    </div>
  );
}