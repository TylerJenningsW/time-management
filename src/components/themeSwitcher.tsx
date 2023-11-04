import { Button, Card, CardHeader, Divider, Spacer } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Card className="flex w-full items-center">
      <CardHeader>The current theme is: {theme}</CardHeader>
      <Divider></Divider>
      <Spacer />
      <Button
        className="w-1/4 gap-4"
        size="md"
        onClick={() => setTheme("light")}
      >
        Light Mode
      </Button>
      <Spacer />
      <Button
        className="w-1/4 gap-4 space-y-2.5"
        size="md"
        onClick={() => setTheme("dark")}
      >
        Dark Mode
      </Button>
      <Spacer />
    </Card>
  );
}
