import Link from "next/link";
export default function LandingPage() {
  return (
    <div className="grid place-items-center h-screen w-full">
      <div className="space-y-4">
      <p>Homepage</p>
      <Link href="/collections">Studio</Link>
</div>
    </div>
  );
}
