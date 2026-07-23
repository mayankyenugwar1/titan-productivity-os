function DashboardHeader() {
  return (
    <div className="space-y-8">

      <div>

        <p className="uppercase tracking-[0.35em] text-yellow-400 text-sm font-semibold">
          Welcome Back
        </p>

        <h1 className="mt-3 text-6xl font-black tracking-tight text-white">
          Good Evening,
          <span className="text-yellow-400"> Mayank</span> 👋
        </h1>

        <p className="mt-5 text-xl text-zinc-400">
          Discipline beats motivation.
        </p>

      </div>

      <div className="rounded-3xl border border-yellow-500/20 bg-zinc-900 p-8">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-zinc-500">
              Today's Progress
            </p>

            <h2 className="mt-2 text-4xl font-bold text-white">
              82%
            </h2>

          </div>

          <div className="text-right">

            <p className="text-zinc-500">
              Completed
            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-400">
              8 / 10
            </h2>

          </div>

        </div>

        <div className="mt-8 h-4 overflow-hidden rounded-full bg-zinc-800">

          <div className="h-full w-[82%] rounded-full bg-yellow-400"></div>

        </div>

      </div>

    </div>
  )
}

export default DashboardHeader