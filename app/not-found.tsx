import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CustomerLayout } from "@/components/layout/customer-layout";

export default function NotFound() {
  return (
    <CustomerLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found</p>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </CustomerLayout>
  );
}
