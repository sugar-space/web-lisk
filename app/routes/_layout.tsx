import { Outlet } from "react-router";
import { Header } from "~/components/layouts/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}
