"use client";

import DashboardLayoutView from "./dashboard-layout";

type Props = {
  children: React.ReactNode;
};

export default function DashBoardLayout({ children }: Props) {

  return (
    <DashboardLayoutView>{children}</DashboardLayoutView>
  );
}