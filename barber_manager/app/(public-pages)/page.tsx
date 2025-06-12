import { Button } from "@/components/ui/button";
import Link from "next/link";
import SmartLink from "@/components/custom/smart-link";

export default async function Home() {
  return (
    <div className="flex flex-col gap-6 items-center ">
      <h1 className="text-3xl text-center">
        Welcome to Barbershop Manager Demo!
      </h1>
      <div className="flex gap-6">
        <Button asChild>
          <SmartLink href={"/queue"} tenantSlug="clipmates">Live queue</SmartLink>
        </Button>
        <Button asChild>
          <SmartLink href={"/admin"} tenantSlug="clipmates">Admin tools</SmartLink>
        </Button>
      </div>
    </div>
  );
}
