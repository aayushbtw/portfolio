import Image from "next/image";
import CraftImage from "./card.jpg";

function CraftCard() {
  return (
    <div className="rounded-4xl overflow-hidden relative">
      <Image
        src={CraftImage}
        alt="person"
        className="w-90 h-[450px] object-cover"
        placeholder="blur"
        priority={true}
      />

      <div
        className="absolute inset-0 pointer-events-none rounded-4xl"
        style={{
          boxShadow: "0 0 40px 15px rgba(255,255,255,0.5) inset",
        }}
      />

      <div
        className="absolute inset-x-0 bottom-0 h-[40%] pointer-events-none"
        style={{
          backdropFilter: "blur(100px)",
          WebkitBackdropFilter: "blur(100px)",
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div className="absolute bottom-0 w-full z-10 p-4">
        <div className="mb-3">
          <h1 className="text-white font-semibold text-lg leading-6">
            Anna Roberts
          </h1>
          <p className="text-white/80 text-sm font-medium">Partner, Creative</p>
        </div>
        <button
          className="rounded-3xl bg-white w-full h-11 text-base text-background font-bold inline-flex items-center justify-center"
          type="button"
        >
          Connect Now
        </button>
      </div>
    </div>
  );
}

export { CraftCard };
