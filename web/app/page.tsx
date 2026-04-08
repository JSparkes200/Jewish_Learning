import { auth } from "@clerk/nextjs/server";
import { HomePageClient } from "./HomePageClient";

export default async function HomePage() {
  const { userId } = await auth();
  return (
    <div className="mx-auto max-w-lg pb-20 pt-2">
      <HomePageClient serverSignedIn={Boolean(userId)} />
    </div>
  );
}
