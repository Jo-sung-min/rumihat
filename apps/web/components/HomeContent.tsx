import Image from "next/image";

type HomeArea = {
  id: string;
  title: string;
  href: string;
  imageUrl: string;
  className: string;
  sizes: string;
  label?: string;
};

type HeroGridArea = {
  id: string;
  title: string;
  href: string;
  imageUrl: string;
};

const HERO_GRID_AREAS: HeroGridArea[] = [
  {
    id: "hero-01",
    title: "Hero grid 01",
    href: "/store",
    imageUrl: "/main1.png"
  },
  {
    id: "hero-02",
    title: "Hero grid 02",
    href: "/products/flower-navy",
    imageUrl: "/blackrumihat2.png"
  },
  {
    id: "hero-03",
    title: "Hero grid 03",
    href: "/products/light-purple",
    imageUrl: "/navyrumihat1.png"
  },
  {
    id: "hero-04",
    title: "Hero grid 04",
    href: "/products/flower-black",
    imageUrl: "/navyrumihat1.png"
  },
  {
    id: "hero-05",
    title: "Hero grid 05",
    href: "/products/corduroy-camel",
    imageUrl: "/main2.png"
  },
  {
    id: "hero-06",
    title: "Hero grid 06",
    href: "/store",
    imageUrl: "/grayrumihat3.png"
  }
];

const HOME_AREAS: HomeArea[] = [
  {
    id: "grid-01",
    title: "Rumihat editorial grid 01",
    href: "/store",
    imageUrl: "/rumihat1.png",
    className: "photo-panel home-area--grid-01",
    sizes: "33vw",
    label: "Rumihat."
  },
  {
    id: "grid-02",
    title: "Rumihat product grid 02",
    href: "/products/flower-navy",
    imageUrl: "/rumihat2.png",
    className: "photo-panel home-area--grid-02",
    sizes: "33vw",
    label: "Rumihat."
  },
  {
    id: "grid-03",
    title: "Rumihat product grid 03",
    href: "/products/light-purple",
    imageUrl: "/rumihat3.png",
    className: "photo-panel home-area--grid-03",
    sizes: "33vw",
    label: "Rumihat."
  },
  {
    id: "grid-04",
    title: "Rumihat product grid 04",
    href: "/products/flower-black",
    imageUrl: "/rumihat1.png",
    className: "photo-panel home-area--grid-04",
    sizes: "33vw",
    label: "Rumihat."
  },
  {
    id: "grid-05",
    title: "Rumihat editorial grid 05",
    href: "/store",
    imageUrl: "/rumihat2.png",
    className: "photo-panel home-area--grid-05",
    sizes: "33vw",
    label: "Rumihat."
  },
  {
    id: "grid-06",
    title: "Rumihat editorial grid 06",
    href: "/products/corduroy-camel",
    imageUrl: "/rumihat3.png",
    className: "photo-panel home-area--grid-06",
    sizes: "33vw",
    label: "Rumihat."
  },
  {
    id: "wide",
    title: "Rumihat wide campaign",
    href: "/store",
    imageUrl: "/rumihat2.png",
    className: "wide-campaign",
    sizes: "100vw"
  }
];

function HomeImage({ area, priority = false }: { area: HomeArea; priority?: boolean }) {
  return (
    <>
      <Image src={area.imageUrl} alt={area.title} fill priority={priority} sizes={area.sizes} />
      {area.label ? <span className={area.id === "hero" ? "hero-logo" : "home-area-label"}>{area.label}</span> : null}
    </>
  );
}

function HeroGridImage({ area, priority = false }: { area: HeroGridArea; priority?: boolean }) {
  return <Image src={area.imageUrl} alt={area.title} fill priority={priority} sizes="(max-width: 720px) 100vw, 33vw" />;
}

export function HomeContent() {
  const wide = HOME_AREAS.find((area) => area.id === "wide") ?? HOME_AREAS[HOME_AREAS.length - 1];
  const gridAreas = HOME_AREAS.filter((area) => area.id.startsWith("grid-"));

  return (
    <main className="home-page">
      <section className="hero-frame" aria-label="메인 캠페인 6개 링크 영역">
        <div className="hero-link-grid" aria-label="메인 캠페인 링크">
          {HERO_GRID_AREAS.map((area, index) => (
            <a href={area.href} className="hero-grid-link" aria-label={area.title} key={area.id}>
              <HeroGridImage area={area} priority={index === 0} />
            </a>
          ))}
        </div>
        <span className="hero-logo">Rumihat.</span>
      </section>

      <section className="editorial-grid" aria-label="메인 격자 링크">
        {gridAreas.map((area) => (
          <a href={area.href} className={`home-area-link ${area.className}`} aria-label={area.title} key={area.id}>
            <HomeImage area={area} />
          </a>
        ))}
      </section>

      <a href={wide.href} className={`home-area-link ${wide.className}`} aria-label={wide.title}>
        <HomeImage area={wide} />
      </a>
    </main>
  );
}
