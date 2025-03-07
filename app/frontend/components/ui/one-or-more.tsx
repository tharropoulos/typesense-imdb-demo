import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "@inertiajs/react";

interface OneOrMoreProps<T extends { id: number; name: string }> {
  items: T[];
  getHref: (item: T) => string;
  dialogTitle: string;
}

function OneOrMore<T extends { id: number; name: string }>({ items, getHref, dialogTitle }: OneOrMoreProps<T>) {
  if (items.length === 0) {
    return null;
  }

  if (items.length === 1) {
    return (
      <Link href={getHref(items[0])} className="hover:underline">
        {items[0].name}
      </Link>
    );
  }

  if (items.length == 2) {
    return (
      <div className="flex items-center gap-1">
        <Link href={getHref(items[0])} className="z-10 hover:underline">
          {items[0].name}
        </Link>
        <span className="text-muted-foreground"> and </span>
        <Link href={getHref(items[1])} className="hover:underline">
          {items[1].name}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Link href={getHref(items[0])} className="hover:underline">
        {items[0].name}
      </Link>
      <Dialog>
        <p className="text-muted-foreground"> and </p>
        <DialogTrigger asChild>
          <Button variant="link" className="cursor-pointer px-0">
            {items.length - 1} others
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="flex max-h-[60vh] flex-col overflow-y-auto">
            {items.map((item) => (
              <Link key={item.id} href={getHref(item)} className="border-b py-3 last:border-b-0 hover:underline">
                {item.name}
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { OneOrMore };
