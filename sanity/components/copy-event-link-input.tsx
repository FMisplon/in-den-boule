import { useMemo, useState } from "react";
import { Box, Button, Card, Flex, Stack, Text, TextInput } from "@sanity/ui";
import { useFormValue, type StringInputProps } from "sanity";

const siteUrl =
  process.env.SANITY_STUDIO_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://antiquewhite-chough-834597.hostingersite.com";

export function CopyEventLinkInput(props: StringInputProps) {
  const slugValue = useFormValue(["slug", "current"]);
  const listingVisibility = useFormValue(["listingVisibility"]);
  const accessMode = useFormValue(["accessMode"]);
  const [copied, setCopied] = useState(false);

  const directUrl = useMemo(() => {
    const slug = typeof slugValue === "string" ? slugValue.trim() : "";

    if (!slug) {
      return "";
    }

    return `${siteUrl.replace(/\/$/, "")}/${slug}`;
  }, [slugValue]);

  async function handleCopy() {
    if (!directUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(directUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("[Sanity] Could not copy event link", error);
    }
  }

  return (
    <Stack space={3}>
      <Text size={1} muted>
        Gebruik deze link voor directe promotie van het event.
      </Text>

      <Card padding={3} radius={2} border tone="transparent">
        <Flex gap={2} align="center">
          <Box flex={1}>
            <TextInput value={directUrl || "Sla eerst een slug op om de link te genereren."} readOnly />
          </Box>
          <Button
            mode="ghost"
            text={copied ? "Gekopieerd" : "Kopieer link"}
            onClick={handleCopy}
            disabled={!directUrl}
          />
        </Flex>
      </Card>

      <Text size={1} muted>
        {listingVisibility === "private"
          ? "Dit event verschijnt niet op de events-pagina, maar is wel bereikbaar via deze rechtstreekse link."
          : accessMode === "password"
            ? "Bezoekers met deze link zien eerst nog een wachtwoordscherm."
            : "Dit event is publiek en ook via deze rechtstreekse link bereikbaar."}
      </Text>

      {props.renderDefault ? (
        <Box style={{ display: "none" }}>{props.renderDefault(props)}</Box>
      ) : null}
    </Stack>
  );
}
