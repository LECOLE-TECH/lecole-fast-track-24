import { Skeleton } from "~/components/ui/skeleton";
import { Fragment } from "react";
import clsx from "clsx";

interface ArraySkeletonProps {
  num: number;
  component: React.ReactNode;
}

export const ArraySkeleton = ({ num, component }: ArraySkeletonProps) => {
  return (
    <>
      {Array.from({ length: num }).map((_, i) => (
        <Fragment key={i}>{component}</Fragment>
      ))}
    </>
  );
};

export const TableRowSkeleton = ({ classname }: { classname?: string }) => {
  return <Skeleton className={clsx("h-8 w-full mb-2", classname)} />;
};
