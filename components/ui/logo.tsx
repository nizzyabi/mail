"use client";
import { SidebarLink } from "./sidebar-links";
import mail0 from "@/public/mail0.png";
import Image from "next/image";

export const Logo = () => {
  return (
    <div>
      <SidebarLink
        isLogo
        link={{
          label: "Mail0",
          href: "/",
          icon: (
            <Image
              src={mail0}
              className="h-7 w-7 flex-shrink-0 rounded-xl"
              width={50}
              height={50}
              alt="Avatar"
            />
          ),
        }}
      />
    </div>
  );
};
