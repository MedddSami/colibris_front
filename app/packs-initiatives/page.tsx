'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useEffect, useState } from 'react';
import { packService } from '@/services/packService';
import { Action, Pack } from '@/types/api';
import { RootState } from '@/store/store';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from "next/navigation";
import { adminService } from '@/services/adminService';
import { useToast } from "@/hooks/use-toast";


export default function BookingPage() {

  const [packs, setPacks] = useState<Pack[]>([]);
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loadingPackId, setLoadingPackId] = useState<string | null>(null);

  const [actions, setActions] = useState<Action[]>([]);
  const [loadingActions, setLoadingActions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const router = useRouter();

  const { user, isAuthenticated, isInitialized } = useAppSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const loadPacks = async () => {
      try {
        const data = await packService.getDisplayedPacks();
        setPacks(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadPacks();
  }, []);

  const fetchActions = async () => {
    try {
      setLoadingActions(true);

      const data = await adminService.getActions();

      setActions(data.actions ?? data);

    } catch (err) {
      console.error(err);
      setError("Failed to load actions");
    } finally {
      setLoadingActions(false);
    }
  };


  useEffect(() => {
    fetchActions();
  }, []);

  const handlePackAction = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description:
          "Access your account to explore and purchase membership packs.",
      });

      router.push("/auth/signin");
      return;
    }

    if (
      user.role === "entreprise" ||
      user.role === "particulier"
    ) {
      toast({
        title: "Redirecting...",
        description:
          "Access your dashboard to complete your membership purchase.",
      });

      router.push("/dashboard/packs");
      return;
    }
  };

  const handleActionDonate = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description:
          "Access your account to support this impact initiative.",
      });

      router.push("/auth/signin");
      return;
    }

    if (
      user.role === "entreprise" ||
      user.role === "particulier"
    ) {
      toast({
        title: "Redirecting...",
        description:
          "Access your dashboard to donate your Eco Points to this initiative.",
      });

      router.push("/dashboard/packs");
      return;
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24">

        {/* ================= HERO SECTION ================= */}

        <section className="relative mx-auto max-w-7xl overflow-hidden px-8 py-16 md:py-24">

          <div className="grid items-center gap-12 md:grid-cols-2">

            <div className="z-10">

              <span className="mb-6 inline-block rounded-full bg-primary-fixed px-4 py-1.5 text-label-md font-medium text-on-primary-fixed">
                Circular Ecosystem
              </span>

              <h1 className="mb-6 text-[3.5rem] leading-none font-bold tracking-tight text-on-surface">
                Packs &
                <br />
                <span className="text-primary">
                  Impact Actions
                </span>
              </h1>

              <p className="mb-8 max-w-md text-body-lg leading-relaxed text-on-surface-variant">
                Invest in nature and secure your place in the Colibris community.
                Every action you take here directly contributes to a regenerative
                future.
              </p>

              <div className="flex gap-4">

                <a
                  href="#membership-packs"
                  className="rounded-full bg-primary px-8 py-4 font-bold text-on-primary transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                  Explore Packs
                </a>

                <a
                  href="#impact-initiatives"
                  className="rounded-full bg-surface-container-high px-8 py-4 font-bold text-primary transition-all hover:bg-surface-container-highest"
                >
                  Impact Map
                </a>
              </div>
            </div>


            <div className="relative">

              <div className="aspect-square w-full overflow-hidden bg-primary-container/20 asymmetric-mask">
                <img
                  src="packs.webp"
                  alt="Green ecosystem"
                  className="h-full w-full object-cover mix-blend-multiply opacity-90"
                />

              </div>

              <div className="absolute -bottom-8 -left-8 max-w-[200px] rounded-xl bg-surface-container-lowest p-6 shadow-xl shadow-on-surface/5">

                <div className="mb-2 flex items-center gap-2">

                  <span className="material-symbols-outlined text-primary">
                    eco
                  </span>

                  <span className="text-title-lg font-bold">
                    5k+
                  </span>

                </div>

                <p className="text-label-md text-on-surface-variant">
                  Members powering a regenerative future.
                </p>
              </div>
            </div>
          </div>
        </section>



        {/* ================= MEMBERSHIP PACKS ================= */}
        <section
          id="membership-packs"
          className="bg-surface-container-low/50 px-8 py-24"
        >
          <div className="mx-auto max-w-7xl">

            <div className="mb-16 flex flex-col items-end justify-between gap-4 md:flex-row">
              <div>
                <h2 className="mb-4 text-[2rem] font-bold text-on-surface">
                  Membership Packs
                </h2>

                <p className="max-w-sm text-on-surface-variant">
                  Choose a pack that matches your impact goals and supports a circular future.
                </p>
              </div>
            </div>


            <div className="grid gap-8 md:grid-cols-3">

              {packs.length === 0 ? (

                <div className="col-span-full flex flex-col items-center justify-center rounded-xl bg-surface-container-lowest px-8 py-16 text-center">

                  <span className="material-symbols-outlined mb-4 text-5xl text-primary">
                    inventory_2
                  </span>

                  <h3 className="mb-2 text-xl font-bold text-on-surface">
                    No membership packs available
                  </h3>

                  <p className="max-w-md text-on-surface-variant">
                    We are preparing new impact packs. Check back soon and join our
                    regenerative community.
                  </p>

                </div>

              ) : (

                packs.map((pack) => {

                  const featured = pack.name?.toLowerCase().includes("guardian");

                  const features = [
                    `${pack.collecteNumber} Free Collections`,
                    `${pack.points} Eco Points Included`,
                    "Access to Shop & Refill Products",
                    `Valid for ${pack.period} month${pack.period > 1 ? "s" : ""}`,
                  ];


                  return (

                    <div
                      key={pack._id}
                      className={
                        featured
                          ? "relative overflow-hidden rounded-xl bg-primary p-8 text-on-primary shadow-2xl shadow-primary/20"
                          : "impact-card-hover group rounded-xl border border-transparent bg-surface-container-lowest p-8 hover:border-primary/10"
                      }
                    >

                      {featured && (
                        <div className="absolute right-0 top-0 rounded-bl-xl bg-primary-container p-4 text-label-md font-bold text-on-primary-container">
                          POPULAR
                        </div>
                      )}


                      {/* PACK NAME */}
                      <div className="mb-8">

                        <span
                          className={
                            featured
                              ? "text-label-md font-bold uppercase tracking-widest opacity-80"
                              : "text-label-md font-bold uppercase tracking-widest text-primary"
                          }
                        >
                          {pack.name}
                        </span>


                        {/* PRICE */}
                        <div className="mt-2 text-[2.5rem] font-bold">
                          {pack.price} DT

                          <span
                            className={
                              featured
                                ? "text-label-md opacity-70"
                                : "text-label-md text-on-surface-variant"
                            }
                          >
                            /mo
                          </span>
                        </div>


                        {pack.description && (
                          <p
                            className={
                              featured
                                ? "mt-3 text-sm opacity-80"
                                : "mt-3 text-sm text-on-surface-variant"
                            }
                          >
                            {pack.description}
                          </p>
                        )}

                      </div>



                      {/* FEATURES */}
                      <ul className="mb-10 space-y-4">

                        {features.map((item) => (

                          <li
                            key={item}
                            className={
                              featured
                                ? "flex items-start gap-3"
                                : "flex items-start gap-3 text-on-surface-variant"
                            }
                          >

                            <span
                              className={
                                featured
                                  ? "material-symbols-outlined text-primary-fixed-dim"
                                  : "material-symbols-outlined text-primary"
                              }
                            >
                              check_circle
                            </span>

                            {item}

                          </li>

                        ))}

                      </ul>



                      {/* BUTTON */}
                      <button
                        onClick={() => handlePackAction(pack._id)}
                        disabled={loadingPackId === pack._id}
                        className={
                          featured
                            ? "w-full rounded-xl bg-white py-4 font-bold text-primary shadow-md transition-all hover:bg-primary-fixed disabled:opacity-50"
                            : "w-full rounded-xl bg-primary py-4 font-bold text-on-primary transition-all hover:bg-primary/90 disabled:opacity-50"
                        }
                      >
                        {loadingPackId === pack._id
                          ? "Processing..."
                          : "Select Pack"}
                      </button>

                    </div>

                  );

                }))}

            </div>

          </div>
        </section>

        {/* ================= IMPACT INITIATIVES ================= */}
        <section
          id="impact-initiatives"
          className="mx-auto max-w-7xl px-8 py-24"
        >
          <div className="mb-16">

            <h2 className="mb-2 text-[2rem] font-bold text-on-surface">
              Impact Initiatives
            </h2>

            <p className="text-on-surface-variant">
              Direct contributions to specific environmental restoration projects.
            </p>

          </div>


          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">

            {/* EMPTY */}
            {actions.length === 0 && (

              <div className="col-span-full rounded-xl bg-surface-container-lowest p-12 text-center">

                <span className="material-symbols-outlined mb-4 text-5xl text-primary">
                  eco
                </span>

                <h3 className="mb-2 text-xl font-bold text-on-surface">
                  No impact initiatives available
                </h3>

                <p className="mx-auto max-w-md text-on-surface-variant">
                  New environmental projects will appear here once they are launched.
                </p>

              </div>
            )}

            {/* ACTION CARDS */}
            {!loadingActions &&
              !error &&
              actions.map((action, index) => {


                const progress = Math.min(
                  100,
                  Math.round(
                    (action.currentPoints / action.targetPoints) * 100
                  )
                );


                const deadline = new Date(
                  action.deadline
                ).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                );


                const icons = [
                  "eco",
                  "water_drop",
                  "energy_savings_leaf",
                  "park",
                ];


                const colors = [
                  "bg-primary-container",
                  "bg-secondary-container",
                  "bg-tertiary-container",
                ];


                return (

                  <div
                    key={action._id}
                    className="group flex flex-col"
                  >


                    {/* IMAGE / VISUAL */}
                    <div
                      className={`
                relative mb-6 aspect-[4/5]
                overflow-hidden rounded-2xl
                ${colors[index % colors.length]}
              `}
                    >
                      {action.image ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}${action.image}`}
                          alt={action.title}
                          className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-700
                            group-hover:scale-105
                          "
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="material-symbols-outlined text-7xl text-primary">
                            {icons[index % icons.length]}
                          </span>
                        </div>
                      )}

                      {/* STATUS */}
                      <div className="absolute left-6 top-6">

                        <span className="
                          rounded-full
                          bg-white/80
                          px-4
                          py-2
                          text-xs
                          font-bold
                          uppercase
                          tracking-widest
                          text-primary
                          backdrop-blur
                        ">
                          {action.status}
                        </span>

                      </div>

                      {/* OVERLAY */}
                      <div className="
                        absolute
                        inset-0
                        flex
                        flex-col
                        justify-end
                        bg-gradient-to-t
                        from-black/60
                        to-transparent
                        p-8
                        text-white
                      ">
                        <h3 className="mb-2 text-2xl font-bold">
                          {action.title}
                        </h3>

                        <p className="text-sm opacity-90">
                          {action.description}
                        </p>
                      </div>
                    </div>

                    {/* PROGRESS */}
                    <div className="px-2">
                      <div className="
                        mb-3
                        flex
                        justify-between
                        text-sm
                        text-on-surface-variant
                      ">

                        <span>
                          {action.currentPoints} pts raised
                        </span>


                        <span>
                          {action.targetPoints} pts goal
                        </span>

                      </div>

                      <div className="
                        h-2
                        overflow-hidden
                        rounded-full
                        bg-surface-container-high
                      ">
                        <div
                          className="
                            h-full
                            rounded-full
                            bg-primary
                            transition-all
                          "
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>

                      <div className="
                        mt-4
                        flex
                        justify-between
                        text-xs
                        text-on-surface-variant
                      ">
                        <span>
                          {progress}% completed
                        </span>
                        <span>
                          Ends {deadline}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleActionDonate()}
                      className="
                        mt-6
                        w-full
                        rounded-xl
                        bg-primary
                        py-3
                        font-bold
                        text-on-primary
                        transition-all
                        hover:bg-primary/90
                        active:scale-95
                      "
                    >
                      Donate to Action
                    </button>
                  </div>
                );
              })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
};
