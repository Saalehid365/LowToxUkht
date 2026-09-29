import { redirect } from "next/navigation";
import { passwordEnabled } from "@/lib/auth";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  if (!passwordEnabled()) redirect("/admin");
  return children;
}
