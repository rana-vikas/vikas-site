// Centralized source for the homepage's dev-placeholder imagery.
//
// These are stock photographs (Unsplash, license permits this use), chosen
// only to establish the intended cinematic mood — none are real photos of
// Vikas, Indus Knights, or his actual workplace. Swap the `src` values below
// for real photography later; every homepage component reads from here
// rather than hardcoding a path, so that's a one-file change.

export type HomepageImage = {
  src: string;
  alt: string;
};

export const homepageImages = {
  hero: {
    src: "/images/homepage/hero.jpg",
    alt: "Placeholder cinematic backdrop — replace with a real photo of Vikas",
  },
  career: {
    src: "/images/homepage/career.jpg",
    alt: "Placeholder — modern workspace",
  },
  fitness: {
    src: "/images/homepage/fitness.jpg",
    alt: "Placeholder — training space",
  },
  cricket: {
    src: "/images/homepage/cricket.jpg",
    alt: "Placeholder — cricket ground at dusk",
  },
} satisfies Record<string, HomepageImage>;
