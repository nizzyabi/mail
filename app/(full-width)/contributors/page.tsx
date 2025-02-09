"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Github, Star, GitFork, MessageCircle, FileCode, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

interface TimelineData {
  date: string;
  stars: number;
  forks: number;
}

interface ActivityData {
  date: string;
  commits: number;
  issues: number;
  pullRequests: number;
}

const specialRoles: Record<string, string> = {
  nizzyabi: "Project Owner",
  praashh: "Maintainer",
};

// Generate sample timeline data
const generateTimelineData = (days: number): TimelineData[] => {
  const data: TimelineData[] = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      stars: Math.floor(Math.random() * 50) + 100,
      forks: Math.floor(Math.random() * 30) + 50,
    });
  }
  return data;
};

// Generate sample activity data
const generateActivityData = (days: number): ActivityData[] => {
  const data: ActivityData[] = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      commits: Math.floor(Math.random() * 20) + 1,
      issues: Math.floor(Math.random() * 10),
      pullRequests: Math.floor(Math.random() * 5),
    });
  }
  return data;
};

export default function OpenPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [repoStats, setRepoStats] = useState({
    stars: 0,
    forks: 0,
    watchers: 0,
    issues: 0,
  });
  const [timelineData] = useState(() => generateTimelineData(7));
  const [activityData] = useState(() => generateActivityData(7));

  useEffect(() => {
    fetch("https://api.github.com/repos/nizzyabi/mail0/contributors")
      .then((res) => res.json())
      .then((data) => setContributors(data))
      .catch((err) => console.error("Error fetching contributors:", err));

    fetch("https://api.github.com/repos/nizzyabi/mail0")
      .then((res) => res.json())
      .then((data) =>
        setRepoStats({
          stars: data.stargazers_count,
          forks: data.forks_count,
          watchers: data.watchers_count,
          issues: data.open_issues_count,
        }),
      )
      .catch((err) => console.error("Error fetching repo stats:", err));
  }, []);

  const maxContributions = Math.max(...contributors.map((c) => c.contributions));

  return (
    <div className="min-h-screen w-full text-white">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Project Stats */}
        <div className="mb-8 rounded-lg border border-neutral-800 bg-neutral-900/50 p-6">
          <div className="flex items-center justify-between">
            <div className="w-full space-y-1">
              <div className="flex justify-between">
                <h2 className="text-2xl font-semibold text-white">Mail0</h2>
                <Button
                  asChild
                  variant="outline"
                  className="border-neutral-800 bg-transparent text-white hover:bg-neutral-800 sm:hidden"
                >
                  <Link href="https://github.com/nizzyabi/mail0" target="_blank" className="gap-2">
                    <Github className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-neutral-400">
                An open source email app built with modern technologies
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="mt-6 hidden border-neutral-800 bg-transparent text-white hover:bg-neutral-800 sm:flex"
            >
              <Link href="https://github.com/nizzyabi/mail0" target="_blank" className="gap-2">
                <Github className="h-4 w-4" />
                View on GitHub
              </Link>
            </Button>
          </div>

          <Separator className="my-4 bg-neutral-800" />

          <div className="mb-6 flex flex-wrap gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-neutral-400" />
              <span className="text-lg font-medium">{repoStats.stars}</span>
              <span className="text-neutral-400">stars</span>
            </div>
            <div className="flex items-center gap-2">
              <GitFork className="h-5 w-5 text-neutral-400" />
              <span className="text-lg font-medium">{repoStats.forks}</span>
              <span className="text-neutral-400">forks</span>
            </div>
            <div className="flex items-center gap-2">
              <Github className="h-5 w-5 text-neutral-400" />
              <span className="text-lg font-medium">{repoStats.watchers}</span>
              <span className="text-neutral-400">watchers</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-neutral-400" />
              <span className="text-lg font-medium">{repoStats.issues}</span>
              <span className="text-neutral-400">open issues</span>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {/* Stars & Forks Timeline */}
            <Card className="border-neutral-800 bg-neutral-900/50 p-4">
              <h3 className="mb-4 text-sm font-medium text-neutral-400">Stars & Forks</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={timelineData} className="-mx-5 mt-2">
                  <XAxis
                    dataKey="date"
                    stroke="#525252"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-neutral-400" />
                                <span className="text-sm text-neutral-400">Stars:</span>
                                <span className="font-medium text-white">{payload[0].value}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <GitFork className="h-4 w-4 text-neutral-400" />
                                <span className="text-sm text-neutral-400">Forks:</span>
                                <span className="font-medium text-white">{payload[1].value}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="stars"
                    stroke="#FFFFFF"
                    fill="#FFFFFF"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="forks"
                    stroke="#A0A0A0"
                    fill="#A0A0A0"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Commit Activity */}
            <Card className="border-neutral-800 bg-neutral-900/50 p-4">
              <h3 className="mb-4 text-sm font-medium text-neutral-400">Commit Activity</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={activityData} className="-mx-5 mt-2">
                  <XAxis
                    dataKey="date"
                    stroke="#525252"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-2 shadow-sm">
                            <div className="flex items-center gap-1">
                              <FileCode className="h-4 w-4 text-neutral-400" />
                              <span className="text-sm text-neutral-400">Commits:</span>
                              <span className="font-medium text-white">{payload[0].value}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="commits"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Issues & Pull Requests */}
            <Card className="border-neutral-800 bg-neutral-900/50 p-4">
              <h3 className="mb-4 text-sm font-medium text-neutral-400">Issues & PRs</h3>
              <ResponsiveContainer width="100%" height={240} className="-mx-5 mt-2">
                <BarChart data={activityData}>
                  <XAxis
                    dataKey="date"
                    stroke="#525252"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-2 shadow-sm">
                            <div className="grid gap-1">
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4 text-neutral-400" />
                                <span className="text-sm text-neutral-400">Issues:</span>
                                <span className="font-medium text-white">{payload[0].value}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <GitFork className="h-4 w-4 text-neutral-400" />
                                <span className="text-sm text-neutral-400">PRs:</span>
                                <span className="font-medium text-white">{payload[1].value}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="issues" fill="#FFFFFF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pullRequests" fill="#A0A0A0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>

        {/* Contributors Section */}
        <div className="space-y-4">
          <h1 className="mt-20 text-center text-3xl font-semibold text-white">
            Meet the Contributors
          </h1>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contributors
              .sort((a, b) => {
                const roleA = specialRoles[a.login.toLowerCase()] || "Contributor";
                const roleB = specialRoles[b.login.toLowerCase()] || "Contributor";

                const roleOrder: Record<"Project Owner" | "Maintainer" | "Contributor", number> = {
                  "Project Owner": 1,
                  Maintainer: 2,
                  Contributor: 3,
                };

                if (
                  roleOrder[roleA as keyof typeof roleOrder] !==
                  roleOrder[roleB as keyof typeof roleOrder]
                ) {
                  return (
                    roleOrder[roleA as keyof typeof roleOrder] -
                    roleOrder[roleB as keyof typeof roleOrder]
                  );
                }

                return b.contributions - a.contributions;
              })
              .map((contributor) => {
                const role = specialRoles[contributor.login.toLowerCase()] || "Contributor";
                const roleColor =
                  role === "Project Owner"
                    ? "text-yellow-400"
                    : role === "Maintainer"
                      ? "text-blue-400"
                      : "text-neutral-400";

                return (
                  <Link
                    key={contributor.login}
                    href={contributor.html_url}
                    target="_blank"
                    className="group rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 transition-colors hover:bg-neutral-800/50"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 rounded-xl">
                        <AvatarImage
                          src={contributor.avatar_url}
                          alt={contributor.login}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-lg">
                          {contributor.login.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-white">{contributor.login}</h3>
                          <div className="flex items-center gap-1 text-sm text-neutral-400">
                            {contributor.contributions} contributions
                          </div>
                        </div>
                        <p className={`text-sm font-semibold ${roleColor}`}>{role}</p>
                        <div className="pt-2">
                          <Progress
                            value={(contributor.contributions / maxContributions) * 100}
                            className="h-1.5 bg-neutral-800"
                            indicatorClassName="bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
