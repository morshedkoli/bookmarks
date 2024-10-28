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
import { useEffect, useState } from "react";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const response = await fetch("/api/category", {
      next: {
        revalidate: 60, // 1 minute
      },
    });
    const data = await response.json();
    setData(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No data</p>;

  return (
    <>
      {/* <div className="mb-5">
        <button
          onClick={() => mutate()}
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Refresh
        </button>
      </div> */}
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
