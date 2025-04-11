import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";

type Crumb = {
  label: string;
  href?: string;
};

interface Props {
  paths: Crumb[];
}

const Crumbs: React.FC<Props> = ({ paths }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {path.href ? (
                <BreadcrumbLink asChild className="hover:underline">
                  <Link href={path.href}>{path.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbLink className="text-foreground transition-colors cursor-default font-medium">{path.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < paths.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Crumbs;
