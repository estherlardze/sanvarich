"use client";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

export function LinkCompat({ href, children, ...props }: any) {
  // next/link handles client navigation. We keep API simple: <Link href="/path">children</Link>
  return (
    <NextLink href={href} {...props}>
      {children}
    </NextLink>
  );
}

export function useLocation(): [string, (to: string) => void] {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const setLocation = useCallback(
    (to: string) => {
      // use push for client-side navigation
      router.push(to);
    },
    [router]
  );

  return [pathname, setLocation];
}

// export names expected by the codebase
export const Link = LinkCompat;

export default LinkCompat;
