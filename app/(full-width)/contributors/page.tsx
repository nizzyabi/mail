"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Star, GitFork, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

// Add a map of special roles
const specialRoles: Record<string, string> = {
  nizzyabi: "Project Owner",
  praashh: "Maintainer",
};

export default function OpenPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [repoStats, setRepoStats] = useState({
    stars: 0,
    forks: 0,
    watchers: 0,
  });

  useEffect(() => {
    // Fetch contributors
    fetch("https://api.github.com/repos/nizzyabi/mail0/contributors")
      .then((res) => res.json())
      .then((data) => setContributors(data))
      .catch((err) => console.error("Error fetching contributors:", err));

    // Fetch repo stats
    fetch("https://api.github.com/repos/nizzyabi/mail0")
      .then((res) => res.json())
      .then((data) =>
        setRepoStats({
          stars: data.stargazers_count,
          forks: data.forks_count,
          watchers: data.watchers_count,
        }),
      )
      .catch((err) => console.error("Error fetching repo stats:", err));
  }, []);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Project Stats */}
      <div className="mb-8 rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Mail0</h2>
            <p className="text-sm text-muted-foreground">
              An open source email client built with modern technologies
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="https://github.com/nizzyabi/mail0" target="_blank" className="gap-2">
              <Github className="h-4 w-4" />
              View on GitHub
            </Link>
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1 rounded-lg border p-4">
            <div className="flex items-center justify-center gap-1">
              <GitFork className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-semibold">{repoStats.forks}</span>
            </div>
            <p className="text-sm text-muted-foreground">Forks</p>
          </div>
          <div className="space-y-1 rounded-lg border p-4">
            <div className="flex items-center justify-center gap-1">
              <Star className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-semibold">{repoStats.stars}</span>
            </div>
            <p className="text-sm text-muted-foreground">Stars</p>
          </div>
          <div className="space-y-1 rounded-lg border p-4">
            <div className="flex items-center justify-center gap-1">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-semibold">{contributors.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Contributors</p>
          </div>
        </div>
      </div>

      {/* Contributors Section */}
      <div className="space-y-4">
        <div className="mx-auto max-w-2xl flex-col items-center gap-2 text-center">
          <h1 className="text-center text-2xl font-bold tracking-tight">You are in good company</h1>
          <p className="text-lg tracking-tight text-muted-foreground">
            Meet the team members and community members
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-8 md:grid-cols-3 lg:grid-cols-4">
          {contributors.map((contributor) => (
            <Link
              key={contributor.login}
              href={contributor.html_url}
              target="_blank"
              className="group flex flex-col items-center text-center"
            >
              <Avatar className="mb-3 h-24 w-24">
                <AvatarImage
                  src={contributor.avatar_url}
                  alt={contributor.login}
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <AvatarFallback className="text-lg">
                  {contributor.login.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-medium leading-none">{contributor.login}</h3>
                <p className="text-sm text-muted-foreground">
                  {specialRoles[contributor.login] || "Contributor"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
