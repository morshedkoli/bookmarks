"use client";
import useSWR from "swr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Button } from "../ui/button";

export default function HomePage() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error } = useSWR("/api/category", fetcher);
  console.log("data", data);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.data?.map((category) => (
        <div key={category.id} className="mb-4">
          <Card className="w-full rounded-md shadow-md">
            {" "}
            {/* Added shadow styling */}
            <CardHeader>
              <CardTitle>{category?.name} related websites are here</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.websites.map((website) => (
                  <AccordionItem key={website.id} value={website.id}>
                    <AccordionTrigger>{website.name}</AccordionTrigger>
                    <AccordionContent>{website.useFor}</AccordionContent>
                    <AccordionContent>
                      <Button asChild>
                        <Link href={website.link}>Visit</Link>
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
