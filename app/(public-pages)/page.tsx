import { Button } from "@/components/ui/button";
import Link from "next/link";
import SmartLink from "@/components/custom/smart-link";
import { X, CircleCheckBig } from "lucide-react";

export default async function Home() {
  return (
    <div className="">
      <section className="container flex flex-col items-center py-12">
        <h1 className="mb-4 text-5xl font-bold text-center">
          The fix for walk-in queue chaos
        </h1>
        <h2 className="mb-10 text-xl font-normal text-center">
          Barbershop queueing made easy, with zero disruptions to how you
          already work
        </h2>
        <div className="flex gap-6">
          <Button asChild className="text-lg rounded-full">
            <SmartLink href={"/queue"} tenantSlug="clipmates">
              Live queue
            </SmartLink>
          </Button>
          <Button asChild className="text-lg rounded-full">
            <SmartLink href={"/admin"} tenantSlug="clipmates">
              Admin tools
            </SmartLink>
          </Button>
        </div>
      </section>
      <section className="container flex flex-col items-center py-12">
        <h2 className="mb-4 text-4xl font-semibold text-center">
          Walk-in queues burn you out?
        </h2>
        <h3 className="max-w-3xl mb-6 text-xl font-normal text-center">
          Some days it feels like total mayhem — shouting names, customers
          asking “How long?”, and you juggling cuts, complaints, and confusion.
        </h3>
        <div className="grow">
          <div className="flex gap-4 items-center mb-1">
            <X size={24} color="#ff0000" className="flex-none" />
            <p className="text-md font-normal">How long’s the wait?</p>
          </div>
          <div className="flex gap-4 items-center mb-1">
            <X size={24} color="#ff0000" className="flex-none" />
            <p className="text-md font-normal">Hey mate, write me down!</p>
          </div>
          <div className="flex gap-4 items-center mb-1">
            <X size={24} color="#ff0000" className="flex-none" />
            <p className="text-md font-normal">
              Can I request a specific barber?
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <X size={24} color="#ff0000" className="flex-none" />
            <p className="text-md font-normal">That guy just cut the queue!</p>
          </div>
        </div>
      </section>
      <section className="bg-l_purple py-12">
        <div className="container flex flex-col items-center ">
          <h2 className="mb-4 text-4xl font-semibold text-center">
            Meet MyClipmate,
          </h2>
          <h3 className="mb-6 text-xl font-normal text-center">
            digital queue for walk-in barbers that lets you focus on cutting,
            not on chaos
          </h3>
          {/* <div className="grow">
            <div className="flex gap-4 items-center mb-2">
              <CircleCheckBig color="#AA8EDB" />
              <p className="text-md font-normal">No appointments</p>
            </div>
            <div className="flex gap-4 items-center mb-2">
              <CircleCheckBig color="#AA8EDB" />
              <p className="text-md font-normal">No more yelling names</p>
            </div>
            <div className="flex gap-4 items-center mb-2">
              <CircleCheckBig color="#AA8EDB" />
              <p className="text-md font-normal">No app downloads</p>
            </div>
            <div className="flex gap-4 items-center">
              <CircleCheckBig color="#AA8EDB" />
              <p className="text-md font-normal">No BS</p>
            </div>
          </div> */}
          <div className="card-group flex flex-col gap-6 items-center mt-8">
            <div className="card w-5/6 p-8 bg-white border border-amber-200 text-center ">
              <h3 className="text-xl font-bold mb-4">No more yelling names</h3>
              <p>
                Let your customers join the line from a screen at the shop or a
                link on your socials.
              </p>
            </div>
            <div className="card w-5/6 p-8 bg-white border border-amber-200 text-center ">
              <h3 className="text-xl font-bold mb-6">Keep the queue visible</h3>
              <p>
                Your customers will see the wait time, pick their barber, and
                know when it’s their turn
              </p>
            </div>
            <div className="card w-5/6 p-8 bg-white border border-amber-200 text-center ">
              <h3 className="text-xl font-bold mb-4">
                Works how you already work
              </h3>
              <p>
                Let your customers join the line from a screen at the shop or a
                link on your socials
              </p>
            </div>
            <div className="card w-5/6 p-8 bg-white border border-amber-200 text-center ">
              <h3 className="text-xl font-bold mb-4">
                Easy setup, no tech aches
              </h3>
              <p>
                Your customers will see the wait time, pick their barber, and
                know when it’s their turn
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="container flex flex-col items-center py-12">
        <h2 className="mb-4 text-4xl font-semibold text-center">
          Start in minutes, even on your busiest day
        </h2>
        <h3 className="max-w-3xl mb-6 text-xl font-normal text-center">
          Three simple steps plan
        </h3>
        <div className="grow">
          <div className="flex gap-4 items-center mb-2">
            <div className="w-6 text-3xl text-primary font-semibold">1.</div>
            <div className="grow">
              <h4 className="text-xl font-bold">Three simple steps plan</h4>
              <p className="text-md font-normal">
                Set up your shop name and chairs.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-center mb-2">
            <div className="w-6 text-3xl text-primary font-semibold">2.</div>
            <div className="grow">
              <h4 className="text-xl font-bold">Share your link</h4>
              <p className="text-md font-normal">
                Customers join the line from a tablet, QR code, or your social
                bio.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-center mb-1">
            <div className="w-6 text-3xl text-primary font-semibold">3.</div>
            <div className="grow">
              <h4 className="text-xl font-bold">Cut with confidence</h4>
              <p className="text-md font-normal">
                Watch the stress disappear as the queue manages itself.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-l_purple py-12">
        <div className="container flex flex-col items-center">
          <h2 className="mb-4 text-4xl font-semibold text-center">
            Your walk-in shop deserves less chaos
          </h2>
          <h3 className="max-w-3xl mb-6 text-xl font-normal text-center">
            You don’t need to overhaul your system. Just give it the calm it’s
            been missing
          </h3>
          <h3 className="max-w-3xl mb-6 text-xl font-normal text-center">
            Start now — your smarter queue is waiting
          </h3>
        </div>
      </section>
      <section className="py-12">
        <div className="container flex flex-col items-center">
          <h2 className="mb-4 text-4xl font-semibold text-center">
            Still running the queue like this a year from now?
          </h2>
          <h3 className="max-w-3xl mb-6 text-xl font-normal text-center">
            Every day you wait, you're bleeding time, patience, and customers.
          </h3>
          <div className="flex flex-col gap-4">
            <div className="bg-red-100 bg-opacity-50 p-2 pl-6 rounded-lg border-l-4 border-red-500">
              <span className="text-xl font-semibold text-red-500 mr-2">!</span>
              The shouting makes you look disorganised and unprofessional.
            </div>
            <div className="bg-red-100 bg-opacity-50 p-2 pl-6 rounded-lg border-l-4 border-red-500">
              <span className="text-xl font-semibold text-red-500 mr-2">!</span>{" "}
              The frustration builds until it turns into burnout.
            </div>
            <div className="bg-red-100 bg-opacity-50 p-2 pl-6 rounded-lg border-l-4 border-red-500">
              <span className="text-xl font-semibold text-red-500 mr-2">!</span>{" "}
              The 5pm exhaustion drains the joy out of cutting.
            </div>
            <div className="bg-red-100 bg-opacity-50 p-2 pl-6 rounded-lg border-l-4 border-red-500">
              <span className="text-xl font-semibold text-red-500 mr-2">!</span>{" "}
              The walk-outs cost you money and reputation.
            </div>
            <div className="bg-red-100 bg-opacity-50 p-2 pl-6 rounded-lg border-l-4 border-red-500">
              <span className="text-xl font-semibold text-red-500 mr-2">!</span>{" "}
              The team tension turns busy days into war zones.
            </div>
            <div className="bg-red-100 bg-opacity-50 p-2 pl-6 rounded-lg border-l-4 border-red-500">
              <span className="text-xl font-semibold text-red-500 mr-2">!</span>{" "}
              The digital competitors look slick while you scramble.
            </div>
            <h3 className="max-w-3xl mt-4  text-xl text-red-900 font-bold text-center">
              Don’t wait for another messy day to push you over the edge.
            </h3>
          </div>{" "}
          <p className="mt-4 text-center">
            Start your free trial and get back to focusing on the cuts — not the
            queue.
          </p>
          <Button size="lg" className="text-lg rounded-full mt-6">
            Deal with the chaos now
          </Button>
        </div>
      </section>
    </div>
  );
}
