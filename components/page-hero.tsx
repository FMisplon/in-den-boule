import { ReactNode } from "react";
import Image from "next/image";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  imageUrl?: string | null;
  imageAlt?: string;
  children?: ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  intro,
  imageUrl,
  imageAlt = "",
  children
}: PageHeroProps) {
  return (
    <>
      {imageUrl ? (
        <section className="page-hero-banner" aria-hidden={imageAlt ? undefined : true}>
          <Image src={imageUrl} alt={imageAlt} fill sizes="100vw" priority />
        </section>
      ) : null}

      <section className="page-hero">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-intro">{intro}</p>
        {children ? <div className="page-hero-extra">{children}</div> : null}
      </section>
    </>
  );
}
