"use client";

export default function Loader() {
    return (
        <main
            className="
        relative
        flex
        h-screen
        w-screen
        flex-col
        items-center
        justify-center
        overflow-hidden
        bg-surface-container
        font-body
        text-on-surface
      "
        >
            {/* Decorative Biophilic Background */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-30">

                <div
                    className="
            absolute
            left-1/2
            top-1/2
            h-[800px]
            w-[800px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-surface-container-low
            blur-3xl
          "
                />

                <div
                    className="
            absolute
            inset-0
            opacity-10
            mix-blend-multiply
          "
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-5 0-10 5-10 10s5 10 10 10 10-5 10-10-5-10-10-10zm0 2c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8 3.6-8 8-8z' fill='%23006c4a' fill-opacity='0.1'/%3E%3C/svg%3E\")",
                    }}
                />


                <img
                    alt="Colibris watermark"
                    className="
            absolute
            left-1/2
            top-1/2
            w-[80%]
            -translate-x-1/2
            -translate-y-1/2
            object-contain
            opacity-25
          "
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpmGV4F8i9GH94KwWvjQDavWmeDGN9cR8uJuX2V44rrKfSi42-yTI_3pM3o5YeorsmFMcT04eh7vsscDBLhaTRS2C2nhvtcFQE_YGbMN2IYg2l0ysH-SU-yVXEpo2MKIPKfCfOwrD6cGouArspEGogZNySzhi3p8HiVOfbuj-fkD78UPAVbh02WN6Hr2midM_5v_ct9EipbLBwfUacvfORz1-YSCcSZUkRkp3fh0Fo_dUdrp3iDTKSLfrnHa4tkw2fpOg"
                />

            </div>


            {/* Main Content */}
            <main className="relative z-10 flex w-full max-w-md flex-col items-center px-6">


                {/* Logo */}
                <div className="animate-fade-in-up mb-12 w-48 md:w-64">
                    <img
                        alt="Colibris Logo"
                        className="h-auto w-full object-contain drop-shadow-md"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpmGV4F8i9GH94KwWvjQDavWmeDGN9cR8uJuX2V44rrKfSi42-yTI_3pM3o5YeorsmFMcT04eh7vsscDBLhaTRS2C2nhvtcFQE_YGbMN2IYg2l0ysH-SU-yVXEpo2MKIPKfCfOwrD6cGouArspEGogZNySzhi3p8HiVOfbuj-fkD78UPAVbh02WN6Hr2midM_5v_ct9EipbLBwfUacvfORz1-YSCcSZUkRkp3fh0Fo_dUdrp3iDTKSLfrnHa4tkw2fpOg"
                    />
                </div>


                {/* Progress */}
                <div className="animate-fade-in-up flex w-full flex-col items-center">


                    {/* Loading bar */}
                    <div
                        className="
              relative
              mb-6
              h-1
              w-full
              overflow-hidden
              rounded-full
              bg-surface-container-highest
              shadow-md
            "
                    >
                        <div
                            className="
                absolute
                inset-0
                origin-left
                animate-progress
                bg-gradient-to-r
                from-primary
                to-primary-container
              "
                        />
                    </div>


                    {/* Glow indicator */}
                    <div
                        className="
              mb-4
              h-3
              w-3
              rounded-full
              bg-primary-container
              animate-pulse-glow
            "
                    />


                    <p
                        className="
              text-label-md
              uppercase
              tracking-widest
              text-on-surface-variant
              opacity-80
            "
                    >
                        Cultivating your experience...
                    </p>

                </div>

            </main>

        </main>
    );
}