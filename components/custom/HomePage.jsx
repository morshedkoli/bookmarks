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
import { Button } from "../ui/button";
import LoadingSpinner from "../LoadingSpinner";

export default function HomePage() {
  const fetcher = (url) => fetch(url, {
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
}).then((res) => res.json());
  const { data, error, isLoading, mutate } = useSWR("/api/category", fetcher, {
    revalidateOnMount: true,
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 0,
    focusThrottleInterval: 0
  });

  const handleRefresh = () => {
    mutate(); // Revalidate data
  };

  if (isLoading) return <LoadingSpinner/>;
  if (!data) return <p>No data</p>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((category) => (
          <div key={category.id} className="mb-6">
            <Card className="w-full rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-0 hover:scale-[1.02] transform-gpu dark:bg-gray-800/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-br from-blue-50/70 to-white/50 dark:from-gray-800 dark:to-gray-900/80 rounded-t-xl p-8 pb-4">
                <CardTitle className="text-3xl font-extrabold tracking-tighter text-gray-900 dark:text-blue-100">{category.name} </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-2 space-y-4">
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {category.websites?.map((website) => (
                    <AccordionItem
                      key={website.id}
                      value={website.id}
                      className="group rounded-xl border border-gray-200/50 hover:border-blue-200/50 dark:border-gray-700 dark:hover:border-blue-800/50 transition-all duration-200"
                    >
                      <AccordionTrigger className="px-6 py-3 text-lg font-medium [&[data-state=open]]:text-blue-700 dark:[&[data-state=open]]:text-blue-300 hover:no-underline group-hover:bg-blue-50/30 dark:group-hover:bg-blue-900/20 transition-colors duration-200">
                        <span className="truncate text-base">{website.name.slice(0,20)}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-3 pt-1 text-sm text-gray-600/90 dark:text-gray-300">
                        {website.useFor}
                      </AccordionContent>
                      <AccordionContent className="px-6 pb-3">
                        <Button
                          asChild
                          className="w-full text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-blue-500/20 dark:from-blue-800 dark:to-blue-700"
                        >
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
