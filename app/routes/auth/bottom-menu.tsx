import { Icon } from "@sugar/icon";
import type { IconName } from "@sugar/icons/name";
import React, { type JSX } from "react";
import { cn } from "~/utils/cn";
import { Link, useLocation } from "react-router";

type PanelMenuReturn = {
  icon: IconName;
  to: string;
  text: string;
  role: string[];
};
function PanelMenu(role: string): PanelMenuReturn[] {
  const general: PanelMenuReturn[] = [
    {
      icon: "home",
      to: "/dashboard",
      text: "Dashboard",
      role: ["admin", "writer"],
    },
    {
      icon: "desktop",
      to: "/overlays",
      text: "Overlays",
      role: ["admin", "writer"],
    },
    {
      icon: "history",
      to: "/history",
      text: "History",
      role: ["admin", "writer"],
    },
    {
      icon: "profile",
      to: "/profile",
      text: "Profile",
      role: ["admin", "writer"],
    },
  ];

  const admin: PanelMenuReturn[] = [
    {
      icon: "cake",
      to: "/cms/article",
      text: "Lorem",
      role: ["admin"],
    },
    {
      icon: "cake",
      to: "/cms/article",
      text: "Cupcake",
      role: ["admin"],
    },
  ];

  if (role === "admin") return [...general, ...admin];
  if (role === "writer") return [...general];

  return [...general];
}

type BottomMenuProps = {
  role?: string;
} & JSX.IntrinsicElements["div"];

export function BottomMenu({ className, role = "writer" }: BottomMenuProps) {
  const location = useLocation();

  const PANEL_MENU = PanelMenu(role);

  return (
    <div className="fixed bottom-10 flex items-center justify-center w-full">
      <div
        className={cn(
          "relative flex flex-row rounded-xl border-2 border-foreground text-foreground backdrop-blur-lg w-max"
        )}
      >
        {PANEL_MENU.map((menu, i) => (
          <React.Fragment key={i}>
            {menu.role.includes(role) && (
              <Link
                to={menu.to}
                className={cn(
                  "group py-5 px-8 cursor-pointer flex flex-col items-center gap-y-2",
                  "hover:bg-foreground hover:text-background",
                  i === 0 && "rounded-l-lg",
                  i === PANEL_MENU.length - 1 && "rounded-r-lg",
                  location.pathname === menu.to && "bg-foreground text-background"
                )}
              >
                <Icon
                  name={menu.icon}
                  size="md"
                  className={cn(
                    "opacity-100 group-hover:opacity-0 transition-opacity duration-500",
                    location.pathname === menu.to && "opacity-0"
                  )}
                />
                <p
                  className={cn(
                    "absolute opacity-0 text-xs transition-all duration-500",
                    `group-hover:opacity-100`,
                    // i % 2 === 0 ? "group-hover:-skew-y-6" : "group-hover:skew-y-6",
                    location.pathname === menu.to && "opacity-100"
                  )}
                >
                  {menu.text}
                </p>
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
