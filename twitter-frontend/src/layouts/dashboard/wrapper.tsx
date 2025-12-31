"use client";
import dynamic from "next/dynamic";
import { SplashScreen } from "@/components/loading-screen";
import { usePathname } from "next/navigation";

const DashboardLayout = dynamic(() => import("./index"), {
  loading: () => <SplashScreen/>,
  ssr: false,
});

const publicRoutes = ["/login", "/register"];

export default function DashboardClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isPublicRoute = publicRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}