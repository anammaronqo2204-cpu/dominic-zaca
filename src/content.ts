export const EMAIL = "bookzacadominic@gmail.com";
export const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent("Booking enquiry: Dominic Zaca")}`;

export type Social = { platform: string; handle: string; href?: string };

export const SOCIALS: Social[] = [
  { platform: "TikTok", handle: "@zacadominic", href: "https://www.tiktok.com/@zacadominic" },
  { platform: "Instagram", handle: "@zaca_dominic", href: "https://www.instagram.com/zaca_dominic/" },
  { platform: "YouTube", handle: "@dominiczaca", href: "https://www.youtube.com/@dominiczaca" },
  { platform: "Facebook", handle: "Dominic Zaca" },
];

export const SCREEN = [
  {
    title: "The Way Ngingakhona",
    network: "Moja Love",
    role: "Cast member",
    detail: "LGBTQIA+ reality series",
    when: "Multiple seasons",
  },
  { title: "LLB", network: "Showmax", role: "as Thuso", detail: "Supporting role", when: "Season 1, 2024" },
  { title: "Udumo", network: "Mnet", role: "as Thoko", detail: "Supporting role", when: "2023" },
];

export const SERVICES = [
  { title: "Hosting and MC work", detail: "Award nights, launches, panels and the after-party." },
  { title: "Brand campaigns", detail: "Content partnerships across TikTok, Instagram and YouTube." },
  { title: "Red carpets and appearances", detail: "Premieres, race days, galas. Dressed accordingly." },
  { title: "Creative direction", detail: "Concept to camera, for campaigns and shoots." },
  { title: "Consulting", detail: "Business development and marketing strategy." },
  { title: "Screen work", detail: "Reality and scripted television, in English and isiZulu." },
];
