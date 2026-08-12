'use client'

import { adminService } from "@/services/adminService";
import { Chiffre } from "@/types/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StatsConfigDashboard() {

  const [chiffres, setChiffres] = useState<Chiffre[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchChiffres();
  }, []);


  const fetchChiffres = async () => {
    try {
      const data = await adminService.getChiffres();

      setChiffres(
        Array.isArray(data)
          ? data
          : data.chiffres ?? []
      );

    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateChiffre = async (
    chiffre: Chiffre
  ) => {
    try {
      setSavingId(chiffre._id);

      const updated = await adminService.updateChiffre(
        String(chiffre.id),
        {
          valeur: chiffre.valeur,
          label: chiffre.label,
          numericValue: chiffre.numericValue,
          suffix: chiffre.suffix,
        }
      );

      setChiffres((prev) =>
        prev.map((item) =>
          item._id === updated.chiffre._id
            ? updated.chiffre
            : item
        )
      );

    } catch (error) {
      console.error(
        "Update failed",
        error
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleValueChange = (
    id: string,
    value: number
  ) => {

    setChiffres((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
            ...item,
            numericValue: value,
            valeur: value.toLocaleString()
          }
          : item
      )
    );

  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-surface">
        {/* Configuration Section */}
        <div className="p-2 max-w-12xl mx-auto space-y-12">
          {/* Page Header */}
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h2 className="text-display-lg font-bold tracking-tight text-on-surface leading-none">Chiffres d'Affaire
              </h2>
              <p className="text-body-lg text-on-surface-variant max-w-xl">Configure the metrics and key performance
                indicators visible to the public on the homepage. Align real data with strategic visibility.</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-outline-variant/30 text-secondary font-semibold hover:bg-surface-container-low transition-all"
              >
                <span
                  className="material-symbols-outlined"
                  data-icon="visibility"
                >
                  visibility
                </span>

                Preview Homepage Stats
              </Link>
              {/*<button
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-on-primary font-bold shadow-lg hover:shadow-primary/20 transition-all">
                <span className="material-symbols-outlined" data-icon="save">save</span>
                Save Changes
              </button>*/}
            </div>
          </div>
          {/* Bento Grid of Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {
              chiffres.map((chiffre, index) => (
                <div
                  key={chiffre._id}
                  className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_12px_32px_rgba(20,29,32,0.06)] flex flex-col justify-between h-64 group hover:translate-y-[-4px] transition-transform duration-300"
                >
                  <div className="flex justify-between items-start">
                    {/*<div
                      className={`
                        p-3 rounded-xl
                        ${index % 2 === 0
                          ? "bg-primary-container/10 text-primary"
                          : "bg-secondary-container/10 text-secondary"
                        }
                      `}
                    >
                      {/*<img
                        src={`/icons/${chiffre.iconName}`}
                        className="w-8 h-8"
                      />
                    </div>*/}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        defaultChecked
                        className="sr-only peer"
                        type="checkbox"
                      />
                      <div
                        className="w-11 h-6 bg-surface-container-high rounded-full peer peer-checked:bg-primary"
                      />
                    </label>
                  </div>
                  <div>
                    <p className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                      {chiffre.label}
                    </p>
                    <h3 className="text-headline-lg font-bold text-on-surface">
                      {chiffre.numericValue.toLocaleString()}
                      {chiffre.suffix}
                    </h3>
                    <div className="mt-4 flex items-center gap-2">
                      <input
                        className="w-full bg-surface-container-low border-none rounded-lg text-body-lg px-3 py-2 focus:ring-1 focus:ring-primary/20 transition-all"
                        type="number"
                        value={chiffre.numericValue}
                        onChange={(e) =>
                          handleValueChange(
                            chiffre._id,
                            Number(e.target.value)
                          )
                        }
                      />
                      <button
                        disabled={savingId === chiffre._id}
                        onClick={() =>
                          handleUpdateChiffre(chiffre)
                        }
                        className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold disabled:opacity-50"
                      >
                        {
                          savingId === chiffre._id
                            ? "..."
                            : "Save"
                        }
                      </button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          {/* Detailed Management Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Advanced Controls *1/}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-surface-container-low rounded-2xl p-8">
                <h3 className="text-headline-md font-bold text-on-surface mb-6">Advanced Logic</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl">
                    <div>
                      <p className="font-bold text-on-surface">Auto-Sync Real-time Data</p>
                      <p className="text-label-md text-on-surface-variant">Syncs values with database every 60
                        minutes.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked className="sr-only peer" type="checkbox" />
                      <div
                        className="w-14 h-7 bg-surface-container-high rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary">
                      </div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl">
                    <div>
                      <p className="font-bold text-on-surface">Inflation Percentage</p>
                      <p className="text-label-md text-on-surface-variant">Add a display buffer to live
                        metrics (+%).</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        className="w-20 bg-surface-container-low border-none rounded-lg text-center font-bold text-primary"
                        type="number" defaultValue={0} />
                      <span className="font-bold text-on-surface-variant">%</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Visual Customization
              <div className="bg-surface-container-low rounded-2xl p-8">
                <h3 className="text-headline-md font-bold text-on-surface mb-6">Display Style</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button className="p-4 bg-primary text-on-primary rounded-xl flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined" data-icon="grid_view">grid_view</span>
                    <span className="text-label-md font-bold">Standard Cards</span>
                  </button>
                  <button
                    className="p-4 bg-surface-container-lowest text-on-surface-variant rounded-xl flex flex-col items-center gap-2 hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined" data-icon="show_chart">show_chart</span>
                    <span className="text-label-md font-bold">Trend Graphs</span>
                  </button>
                  <button
                    className="p-4 bg-surface-container-lowest text-on-surface-variant rounded-xl flex flex-col items-center gap-2 hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined" data-icon="counter">counter_1</span>
                    <span className="text-label-md font-bold">Ticker Bar</span>
                  </button>
                </div>
              </div>*1/}
            </div> */}
            {/* Preview Sidebar *1/}
            <div className="space-y-6">
              <div
                className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl overflow-hidden shadow-xl sticky top-28">
                <div className="bg-primary px-6 py-4 flex justify-between items-center">
                  <span className="text-on-primary font-bold">Live Preview</span>
                  {/*<span
                    className="text-[10px] bg-white/20 text-white px-2 py-1 rounded-full uppercase tracking-tighter">Mobile
                    View</span>*1/}
                </div>
                <div className="p-8 space-y-8 bg-[#f8fdff]">
                  <div className="h-4 w-24 bg-surface-container-high rounded mb-6"></div>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/5">
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Active Users
                      </p>
                      <p className="text-2xl font-extrabold text-on-surface">12.4k</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/5">
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Plastics
                        Collected</p>
                      <p className="text-2xl font-extrabold text-on-surface">45.2 t</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/5">
                      <p className="text-[10px] text-tertiary font-bold uppercase tracking-widest">CO2
                        Captured</p>
                      <p className="text-2xl font-extrabold text-on-surface">128 t</p>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-outline-variant/10">
                    <p className="text-[10px] text-on-surface-variant italic text-center">Stats are updated
                      every hour automatically.</p>
                  </div>
                </div>
                {/* Decorative Abstract Graphic 
                <div
                  className="h-32 w-full bg-gradient-to-tr from-primary to-secondary opacity-10 relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20">
                  </div>
                </div>
                
              </div>
            </div>*/}
          </div>
        </div>
      </main>
    </div>
  );
}