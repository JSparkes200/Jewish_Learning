import { redirect } from "next/navigation";

/** Path overview now lives on Learn — tap **i** on the Learn home carousel page. */
export default function FluencyRedirectPage() {
  redirect("/learn");
}
