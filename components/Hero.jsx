"use client";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-purple-200 via-pink-100 to-purple-300 dark:from-black dark:via-black dark:to-black py-20 px-6 overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-20 -left-20 w-60 h-60 bg-purple-400/30 dark:bg-purple-700/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 -right-20 w-72 h-72 bg-pink-400/30 dark:bg-pink-700/30 rounded-full blur-3xl" />

      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 relative z-10">
        {/* Left Content */}
        <div className="max-w-lg text-center md:text-left">
          <p className="uppercase tracking-widest text-purple-700 dark:text-purple-300 mb-4 font-semibold">
            Start a Happy Life
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-purple-950 dark:text-white leading-tight drop-shadow-sm">
            Discover the{" "}
            <span className="text-purple-700 dark:text-purple-300">
              Power of Yoga
            </span>
          </h1>
          <p className="mt-6 text-purple-900/90 dark:text-gray-300/90 text-lg">
            Balance your mind and body with our expert trainers. Join us today
            and unlock a healthier lifestyle.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-700 to-purple-900 dark:from-purple-600 dark:to-purple-700 text-white font-semibold shadow-lg hover:scale-105 transition-all">
              Get Started
            </button>
            <button className="px-8 py-3 rounded-2xl border border-purple-800/50 dark:border-purple-600/50 text-purple-900 dark:text-gray-300 font-semibold backdrop-blur-md hover:bg-purple-100/60 dark:hover:bg-purple-800/40 transition-all">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative mt-10 md:mt-0">
          <div className="rounded-3xl overflow-hidden shadow-2xl transform hover:rotate-1 hover:scale-105 transition duration-500">
            <img
              alt="Yoga Pose"
              className="w-[700px] h-[500px] object-cover"
              src="https://images.unsplash.com/photo-1526718583451-e88ebf774771?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fHlvZ2F8ZW58MHx8MHx8fDA%3D"
            />
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 -z-10 bg-purple-400/30 dark:bg-purple-700/20 blur-2xl rounded-full" />
        </div>
      </div>
    </section>
  );
}
