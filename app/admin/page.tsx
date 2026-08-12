"use client"

import { utilService } from "@/services/utilService";
import { Metrics } from "@/types/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const stats = [
  {
    title: "Total Users",
    value: "12,482",
    change: "+12.4%",
    icon: "group",
    bg: "bg-surface-container-lowest",
  },
  {
    title: "Collections Completed",
    value: "4,891",
    subtitle: "Target: 5,000 this month",
    icon: "eco",
    bg: "bg-primary text-on-primary",
  },
  {
    title: "Pending Reservations",
    value: "142",
    icon: "schedule",
    bg: "bg-surface-container-lowest",
  },
];

const activities = [
  {
    title: "Date de passage pour collecte confirmed",
    description:
      "Residential Zone A-12 • Scheduled for Tomorrow, 09:00 AM",
    icon: "local_shipping",
    color: "text-primary",
    time: "2 mins ago",
  },
  {
    title: "Collecte successfully completed",
    description:
      "Commercial Plaza B-4 • 450kg Bio-waste processed",
    icon: "history",
    color: "text-secondary",
    time: "45 mins ago",
  },
  {
    title: "Date de passage rescheduled",
    description:
      "Park District C-1 • Moved to Oct 28 due to maintenance",
    icon: "warning",
    color: "text-error",
    time: "2 hours ago",
  },
];


export default function AdminDashboardPage() {

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  const chartGreen = "#1B8A4B";
  const chartGreenLight = "#6FCF97";
  const chartGreenSoft = "#CDEFD9";
  const chartNeutral = "#E6ECE8";

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);

      const data = await utilService.getMetrics();
      setMetrics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = metrics
    ? [
      {
        title: "Registered Users",
        value: metrics.totalUsers.toLocaleString(),
        subtitle: "Community members",
        icon: "groups",
        bg: "bg-surface-container-high",
      },
      {
        title: "Reservations",
        value: metrics.totalReservations.toLocaleString(),
        subtitle: "Reserved pickup",
        icon: "event_available",
        bg: "bg-secondary-container",
      },
      {
        title: "Collections",
        value: metrics.totalCollections.toLocaleString(),
        subtitle: "Scheduled pickups",
        icon: "recycling",
        bg: "bg-surface-container-low",
      },
      {
        title: "Impact Actions",
        value: metrics.totalActions.toLocaleString(),
        subtitle: "Available campaigns",
        icon: "eco",
        bg: "bg-primary-container",
      },
      {
        title: "Donated Points",
        value: metrics.donatedPoints.toLocaleString(),
        subtitle: "Points contributed",
        icon: "volunteer_activism",
        bg: "bg-tertiary-container",
      },
      {
        title: "Shop Revenue",
        value: `${metrics.shopRevenue.toLocaleString()} TND`,
        subtitle: "Confirmed orders",
        icon: "payments",
        bg: "bg-secondary-container/40",
      },
    ]
    : [];

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">

      {/* Main */}
      <main className="flex-1 p-6 lg:p-12²">

        {/* Content */}
        <div className="space-y-12">
          {/* Hero */}
          <section className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="mb-2 text-5xl font-bold tracking-tight">
                Platform Overview
              </h2>

              <p className="max-w-2xl text-on-surface-variant">
                Real-time overview of Colibris sustainability
                impact and operational status.
              </p>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`${stat.bg} relative overflow-hidden rounded-3xl p-8 shadow-sm`}
              >
                <div className="relative">
                  <span className="material-symbols-outlined absolute right-0 top-0 text-[7rem] opacity-60 pointer-events-none">
                    {stat.icon}
                  </span>

                  <p className="relative z-10 mb-2 text-sm font-semibold uppercase tracking-widest">
                    {stat.title}
                  </p>
                </div>

                <h3 className="text-5xl font-bold">
                  {stat.value}
                </h3>

                {stat.change && (
                  <div className="mt-4 flex items-center gap-2 font-bold text-primary">
                    <span className="material-symbols-outlined text-sm">
                      trending_up
                    </span>

                    {stat.change}
                  </div>
                )}

                {stat.subtitle && (
                  <p className="mt-4 opacity-80">
                    {stat.subtitle}
                  </p>
                )}
              </div>
            ))}
          </section>

          {/* ===================== METRICS VISUALIZATIONS ===================== */}
          {metrics && (
            <section className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-on-surface">
                  Metrics Visualizations
                </h2>

                <p className="mt-2 text-on-surface-variant">
                  A quick overview of platform activity and environmental impact.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">

                {/* Activity */}
                <div className="rounded-3xl border border-outline-variant/20 bg-surface-container p-6 shadow-sm">

                  <div className="mb-6">
                    <h3 className="font-semibold text-on-surface">
                      Platform Activity
                    </h3>

                    <p className="mt-1 text-sm text-on-surface-variant">
                      Registered users, reservations and completed collections.
                    </p>
                  </div>

                  <div className="h-64">
                    <Bar
                      data={{
                        labels: ["Users", "Reservations", "Collections"],
                        datasets: [
                          {
                            data: [
                              metrics.totalUsers,
                              metrics.totalReservations,
                              metrics.totalCollections,
                            ],
                            backgroundColor: [
                              chartGreen,
                              chartGreenLight,
                              chartGreenSoft,
                            ],
                            borderRadius: 12,
                            maxBarThickness: 40,
                          },
                        ],
                      }}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          x: {
                            grid: {
                              display: false,
                            },
                            border: {
                              display: false,
                            },
                          },
                          y: {
                            beginAtZero: true,
                            border: {
                              display: false,
                            },
                            ticks: {
                              precision: 0,
                            },
                            grid: {
                              color: "#EEF2EF",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Revenue */}
                <div className="rounded-3xl border border-outline-variant/20 bg-surface-container p-6 shadow-sm">

                  <div className="mb-6">
                    <h3 className="font-semibold text-on-surface">
                      Revenue vs Donated Points
                    </h3>

                    <p className="mt-1 text-sm text-on-surface-variant">
                      Distribution between generated revenue and donated Eco Points.
                    </p>
                  </div>

                  <div className="mx-auto h-64 max-w-[240px]">
                    <Pie
                      data={{
                        labels: [
                          "Shop Revenue",
                          "Donated Points",
                        ],
                        datasets: [
                          {
                            data: [
                              metrics.shopRevenue,
                              metrics.donatedPoints,
                            ],
                            backgroundColor: [
                              chartGreen,
                              chartGreenSoft,
                            ],
                            borderWidth: 0,
                          },
                        ],
                      }}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: {
                              usePointStyle: true,
                              boxWidth: 10,
                              padding: 18,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Overview */}
                <div className="rounded-3xl border border-outline-variant/20 bg-surface-container p-6 shadow-sm">

                  <div className="mb-6">
                    <h3 className="font-semibold text-on-surface">
                      Overall Metrics
                    </h3>

                    <p className="mt-1 text-sm text-on-surface-variant">
                      Comparison between the platform's primary indicators.
                    </p>
                  </div>

                  <div className="h-64">
                    <Line
                      data={{
                        labels: [
                          "Users",
                          "Reservations",
                          "Collections",
                          "Revenue",
                          "Points",
                          "Actions",
                        ],
                        datasets: [
                          {
                            data: [
                              metrics.totalUsers,
                              metrics.totalReservations,
                              metrics.totalCollections,
                              metrics.shopRevenue / 100,
                              metrics.donatedPoints / 100,
                              metrics.totalActions,
                            ],
                            borderColor: chartGreen,
                            backgroundColor: "rgba(27,138,75,.08)",
                            fill: true,
                            tension: 0.45,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            pointBackgroundColor: chartGreen,
                            pointBorderWidth: 0,
                          },
                        ],
                      }}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          x: {
                            grid: {
                              display: false,
                            },
                            border: {
                              display: false,
                            },
                          },
                          y: {
                            beginAtZero: true,
                            border: {
                              display: false,
                            },
                            ticks: {
                              precision: 0,
                            },
                            grid: {
                              color: "#EEF2EF",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="rounded-3xl border border-outline-variant/20 bg-surface-container p-6 shadow-sm">

                  <div className="mb-6">
                    <h3 className="font-semibold text-on-surface">
                      Impact Actions
                    </h3>

                    <p className="mt-1 text-sm text-on-surface-variant">
                      Current contribution towards environmental initiatives.
                    </p>
                  </div>

                  <div className="mx-auto h-64 max-w-[220px]">
                    <Doughnut
                      data={{
                        labels: [
                          "Actions",
                          "Remaining",
                        ],
                        datasets: [
                          {
                            data: [
                              metrics.totalActions,
                              Math.max(100 - metrics.totalActions, 0),
                            ],
                            backgroundColor: [
                              chartGreen,
                              chartNeutral,
                            ],
                            borderWidth: 0,
                            cutout: "72%",
                          },
                        ],
                      }}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: {
                              usePointStyle: true,
                              boxWidth: 10,
                              padding: 18,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* Eco Points 
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-3xl bg-surface-container-low p-8 lg:col-span-2">
              <p className="mb-2 text-sm uppercase tracking-widest text-on-surface-variant">
                Eco-Points Distributed
              </p>

              <h3 className="text-6xl font-bold">{metrics?.donatedPoints.toLocaleString()}</h3>

              <p className="mt-4 text-on-surface-variant">
                Rewards contributed to environmental actions.
              </p>

              <div className="mt-8 h-2 overflow-hidden rounded-full bg-outline-variant/20">
                <div className="h-full w-[78%] rounded-full bg-primary" />
              </div>
            </div>

            <div className="relative h-80 overflow-hidden rounded-3xl">
              <Image
                src="/images/dashboard-chart.jpg"
                alt="Analytics"
                fill
                className="object-cover"
              />
            </div>
          </section>*/}

          {/* Activity 
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-bold">
                Collecte Activity Log
              </h3>

              <button className="font-bold text-primary hover:underline">
                View All Notifications
              </button>
            </div>

            <div className="overflow-hidden rounded-3xl bg-surface-container-lowest shadow-sm">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-6 border-b border-outline-variant/10 p-6 last:border-none hover:bg-surface-container-low"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high ${activity.color}`}
                  >
                    <span className="material-symbols-outlined">
                      {activity.icon}
                    </span>
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold">
                      {activity.title}
                    </p>

                    <p className="text-sm text-on-surface-variant">
                      {activity.description}
                    </p>
                  </div>

                  <p className="text-sm text-on-surface-variant">
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA *1/}
          <div className="flex justify-end">
            <button className="flex items-center gap-3 rounded-full bg-primary px-8 py-4 font-bold text-on-primary shadow-xl transition-all hover:scale-[1.02] active:scale-95">
              <span className="material-symbols-outlined">
                analytics
              </span>

              Generate Ecosystem Insight Report
            </button>
          </div>*/}
        </div>
      </main>
    </div>
  );
}