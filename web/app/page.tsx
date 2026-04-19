import { auth } from "@clerk/nextjs/server";
import { HomePageClient } from "./HomePageClient";

export default async function HomePage() {
  const { userId } = await auth();
  return <HomePageClient serverSignedIn={Boolean(userId)} />;
}
