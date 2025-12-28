const Home = () => {
  return (
    <div className="w-full bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col gap-24 pt-20 md:pt-32">
      {/* Hero */}
      <section className="pt-52 md:pt-64 pb-16 md:pb-24">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className=" mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left */}
            <div className="text-center lg:text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                Welcome to <span className="text-green-600">LifeTrack</span>
              </h1>

              <p className="mt-4 text-lg md:text-2xl text-gray-700 font-light">
                Your companion to achieve your daily goals
              </p>
            </div>

            {/* Right (visual mock / preview box) */}
            <div className="hidden lg:block">
              <div className="w-full max-w-xl ml-auto">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-lg p-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-semibold text-gray-900">Today</div>
                    <div className="text-sm text-gray-500">
                      Streak: 7 days 🔥
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Drink water", done: true },
                      { label: "Read 15 min", done: true },
                      { label: "Workout", done: false },
                      { label: "Meditate", done: false },
                    ].map((h) => (
                      <div
                        key={h.label}
                        className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3"
                      >
                        <span className="text-gray-800">{h.label}</span>
                        <span
                          className={
                            h.done
                              ? "text-green-600 font-semibold"
                              : "text-gray-400 font-semibold"
                          }
                        >
                          {h.done ? "Done" : "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 p-4">
                    <div className="text-sm text-gray-600">Weekly progress</div>
                    <div className="mt-2 h-2 w-full rounded-full bg-white border border-gray-100 overflow-hidden">
                      <div className="h-full w-2/3 bg-green-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Right */}
          </div>
        </div>
      </section>
      {/* Features */}
      <section className="pt-32 md:pt-40 pb-10 md:pb-14">
        <div className="max-w-8xl mx-auto px-6">
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900">
              Why LifeTrack?
            </h2>
            <div className="flex justify-center">
              <p className="text-lg text-gray-600 text-center max-w-2xl">
                Everything you need to build better habits — simple, clear, and
                consistent.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-8xl mx-auto">
              {[
                {
                  icon: "📊",
                  title: "Track your Progress",
                  desc: "See your progress day by day with a clean, visual overview.",
                },
                {
                  icon: "🔥",
                  title: "Maintain your Streaks",
                  desc: "Keep motivation high by following your streak and personal record.",
                },
                {
                  icon: "🎯",
                  title: "Achieve your Goals",
                  desc: "Set clear goals and move forward with daily actions.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="bg-white/80 backdrop-blur rounded-3xl p-12 md:p-16 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center flex flex-col items-center justify-center min-h-[320px]"
                >
                  <div className="mx-auto mb-6 flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 text-4xl md:text-5xl shadow-md">
                    {f.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                    {f.title}
                  </h3>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed text-center max-w-sm mt-6">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
