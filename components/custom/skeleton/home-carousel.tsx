import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CarouselSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 dark:bg-primary/30 dark:border-border/80">
      <div className="relative">
        {/* Main card skeleton with pulse animation */}
        <div className="overflow-hidden rounded-xl bg-background border-2  border-border/80">
          <div className="p-4 sm:p-6 md:p-8 h-[300px] md:h-[350px]">
            <div className="flex flex-col md:flex-row md:items-center justify-between h-full gap-6">
              {/* Left content - more pronounced skeleton */}
              <div className="flex-1 space-y-4">
                <Skeleton className="h-6 w-32 rounded-full bg-primary/20" />
                <div className="space-y-3">
                  <Skeleton className="h-8 w-full max-w-[400px] bg-primary/20" />
                  <Skeleton className="h-5 w-full max-w-[350px] bg-primary/20" />
                  <Skeleton className="h-5 w-3/4 max-w-[300px] bg-primary/20" />
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <Skeleton className="h-10 w-32 rounded-full bg-primary/20" />
                  <Skeleton className="h-4 w-16 bg-primary/20" />
                </div>
              </div>

              {/* Right image - more distinct placeholder */}
              <div className="relative w-full md:w-[300px] h-[200px] md:h-[250px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="h-20 w-20 rounded-full bg-primary/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons - more visible */}
        <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
          <Skeleton className="h-10 w-10 rounded-full bg-primary/20" />
          <Skeleton className="h-10 w-10 rounded-full bg-primary/20" />
        </div>
      </div>

      {/* Dot indicators - more prominent */}
      <div className="flex justify-center gap-3 mt-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-3 rounded-full bg-primary/20",
              i === 0 ? "w-8" : "w-3"
            )}
          />
        ))}
      </div>
    </div>
  );
}
