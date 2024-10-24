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

  const { data, error } = useSWR("/api/category", fetcher, {
    revalidateOnFocus: true,
  });

  if (error) return <div>Error fetching data: {error.message}</div>;

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((category) => (
          <div key={category.id} className="mb-4">
            <Card className="w-full rounded-md shadow-md">
              <CardHeader>
                <CardTitle>{category.name} এর সকল লিংক এইখানে</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.websites?.map((website) => (
                    <AccordionItem key={website.id} value={website.id}>
                      <AccordionTrigger>{website.name}</AccordionTrigger>
                      <AccordionContent>{website.useFor}</AccordionContent>
                      <AccordionContent>
                        <Button asChild className="w-full text-2xl">
                          <a target="_blank" href={website.link}>
                            ওয়েব সাইটে যান 👆
                          </a>
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
    </>
  );
}
