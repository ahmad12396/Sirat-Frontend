import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Component Preview — Sirat",
  robots: { index: false, follow: false },
};

const buttonVariants = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const;

const buttonSizes = ["sm", "default", "lg", "icon"] as const;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border-b border-border pb-10">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

export default function PreviewPage() {
  return (
    <div className="min-h-full">
      <Header />

      <main className="mx-auto max-w-4xl space-y-10 px-4 py-10 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold">Component Preview</h1>
          <p className="text-muted-foreground">
            Phase 0 deliverable — every base component, every state, both
            themes. Not a real page; excluded from search indexing.
          </p>
        </div>

        <Section title="Buttons — variants">
          {buttonVariants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </Section>

        <Section title="Buttons — sizes">
          {buttonSizes.map((size) => (
            <Button key={size} size={size}>
              {size === "icon" ? "＋" : size}
            </Button>
          ))}
        </Section>

        <Section title="Buttons — disabled">
          <Button disabled>Default</Button>
          <Button variant="outline" disabled>
            Outline
          </Button>
          <Button variant="destructive" disabled>
            Destructive
          </Button>
        </Section>

        <Section title="Card">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Al-Fatihah</CardTitle>
              <CardDescription>The Opening — 7 ayahs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Placeholder card content — mocked data only.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Read</Button>
            </CardFooter>
          </Card>

          <Card className="glass w-full max-w-sm border-0">
            <CardHeader>
              <CardTitle>Glass surface</CardTitle>
              <CardDescription>Reserved for accent surfaces</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Uses the `.glass` utility — translucent + blurred.
              </p>
            </CardContent>
          </Card>
        </Section>

        <Section title="Input">
          <Input placeholder="Search the Quran..." className="max-w-xs" />
          <Input placeholder="Disabled" disabled className="max-w-xs" />
          <Input defaultValue="With a value" className="max-w-xs" />
        </Section>

        <Section title="Modal (Dialog)">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open modal</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reading settings</DialogTitle>
                <DialogDescription>
                  Placeholder modal content — mocked, not wired to real settings
                  yet.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Section>

        <Section title="Skeleton loader">
          <div className="w-full max-w-sm space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Section>

        <Section title="Toggle (dark / light)">
          <div className="flex items-center gap-2">
            <Switch id="preview-switch" />
            <label htmlFor="preview-switch" className="text-sm">
              Notifications
            </label>
          </div>
          <span className="text-sm text-muted-foreground">
            (Theme toggle itself is in the top nav above)
          </span>
        </Section>

        <Section title="Tabs">
          <Tabs defaultValue="translation" className="w-full max-w-sm">
            <TabsList>
              <TabsTrigger value="translation">Translation</TabsTrigger>
              <TabsTrigger value="tafsir">Tafsir</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
            </TabsList>
            <TabsContent value="translation" className="text-sm">
              Placeholder translation content.
            </TabsContent>
            <TabsContent value="tafsir" className="text-sm">
              Placeholder tafsir content.
            </TabsContent>
            <TabsContent value="audio" className="text-sm">
              Placeholder audio player.
            </TabsContent>
          </Tabs>
        </Section>
      </main>
    </div>
  );
}
