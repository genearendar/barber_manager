import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex flex-col gap-6 items-center ">
      <h1 className="text-3xl text-center">Welcome to Barbershop Manager Demo!</h1>
      <div className="flex gap-6">
        <Button asChild>
          <Link href={"rollestonhaircuts/queue"}>Live queue</Link>
        </Button>
        <Button asChild>
          <Link href={"rollestonhaircuts/admin"}>Admin tools</Link>
        </Button>
      </div>
    </div>
  );
}
