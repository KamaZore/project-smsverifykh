import {
  SiTelegram, SiWhatsapp, SiInstagram, SiFacebook, SiTiktok,
  SiViber, SiDiscorddotjs, SiNetflix, SiSpotify, SiTwitch,
  SiUber, SiAirbnb, SiSteamworks, SiSnapchat,
  SiPaypal, SiShopify, SiBinance, SiCoinbase,
  SiKlarna, SiRevolut, SiLyft, SiStarbucks, SiMcdonalds, SiKfc,
  SiBurgerking, SiNike, SiZara,
  SiAliexpress, SiEbay,
  SiReddit, SiPinterest, SiYoutubetv,
  SiBadoo, SiOkcupid,
  SiRobloxstudio, SiEpicgames, SiUbisoft,
  SiWechat, SiSignal, SiZoom,
  SiNotion, SiFigma, SiVercel, SiNetlify,
  SiRefinedgithub, SiWordpress,
  SiCashapp, SiTinder,
  SiBookingdotcom,
  SiUdemy, SiDuolingo,
  SiDocker, SiFirebase, SiSupabase,
  SiAlipay, SiMastercard, SiVisa,
  SiShopee, SiSamsung, SiXiaomi, SiNaver, SiBilibili,
  SiGrab, SiGojek, SiDeliveroo, SiJusteat, SiDoordash, SiGlovo,
  SiFiverr, SiUpwork, SiFreelancermap, SiIndeed,
  SiPostman, SiGitlab, SiBitbucket, SiOpenaigym,
  SiZelle, SiVenmo, SiPayoneer, SiSupercell, SiHostinger,
  SiMercadopago, SiPhonepe, SiZiggo,
} from "react-icons/si";

const AppleIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const SiAdobe = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M14.5 3h5.5L15 21H9.5L14.5 3zM3 21l7-18h4l-7 18H3z"/>
  </svg>
);

const SiLinkedin = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GenericIcon = (letter, bg) => (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <rect width="24" height="24" rx="6" fill={bg || "currentColor"}/>
    <text x="12" y="17" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fff">{letter}</text>
  </svg>
);

const SiMicrosoft = GenericIcon("M", "#00A4EF");
const SiAmazon = GenericIcon("a", "#FF9900");
const SiWalmart = GenericIcon("W", "#0071CE");
const SiSlack = GenericIcon("S", "#4A154B");
const SiSkype = GenericIcon("S", "#00AFF0");
const SiBolt = GenericIcon("B", "#34D058");
const SiIndriver = GenericIcon("i", "#00B14F");
const SiCareem = GenericIcon("C", "#00B14F");
const SiWolt = GenericIcon("W", "#00B14F");
const SiRappi = GenericIcon("R", "#FF4400");
const SiBlablacar = GenericIcon("B", "#00AFF0");
const SiOlx = GenericIcon("O", "#191919");
const SiCarousell = GenericIcon("C", "#E51B37");
const SiDepop = GenericIcon("D", "#000000");
const SiTokopedia = GenericIcon("T", "#42B549");
const SiLazada = GenericIcon("L", "#0F146D");
const SiDisney = GenericIcon("D", "#0057B8");
const SiGetir = GenericIcon("G", "#60D338");
const SiLine = GenericIcon("L", "#00B900");
const SiMatch = GenericIcon("M", "#E31E52");

const iconMap = {
  go: SiZiggo,
  tg: SiTelegram,
  wa: SiWhatsapp,
  ig: SiInstagram,
  fb: SiFacebook,
  lf: SiTiktok,
  vi: SiViber,
  ds: SiDiscorddotjs,
  am: SiAmazon,
  nf: SiNetflix,
  alj: SiSpotify,
  hb: SiTwitch,
  adobe: SiAdobe,
  ub: SiUber,
  uk: SiAirbnb,
  mt: SiSteamworks,
  fu: SiSnapchat,
  wx: AppleIcon,
  mm: SiMicrosoft,
  ts: SiPaypal,
  hw: SiAlipay,
  oi: SiTinder,
  vm: SiOkcupid,
  aiw: SiRobloxstudio,
  blm: SiEpicgames,
  ahb: SiUbisoft,
  wb: SiWechat,
  bw: SiSignal,
  ano: SiShopify,
  aon: SiBinance,
  re: SiCoinbase,
  afz: SiKlarna,
  ij: SiRevolut,
  tu: SiLyft,
  sr: SiStarbucks,
  ry: SiMcdonalds,
  fz: SiKfc,
  ip: SiBurgerking,
  ew: SiNike,
  bnl: SiReddit,
  pi: SiPinterest,
  yo: SiYoutubetv,
  qv: SiBadoo,
  zk: SiDeliveroo,
  bpz: SiJusteat,
  ac: SiDoordash,
  aq: SiGlovo,
  abq: SiUpwork,
  cn: SiFiverr,
  gq: SiFreelancermap,
  brk: SiIndeed,
  tn: SiLinkedin,
  pp: SiPostman,
  gm: SiGitlab,
  bx: SiBitbucket,
  dr: SiOpenaigym,
  afz: SiKlarna,
  nc: SiPayoneer,
  ij: SiRevolut,
  bbq: SiCashapp,
  gf: SiZelle,
  yy: SiVenmo,
  gs: SiSamsung,
  yu: SiXiaomi,
  nv: SiNaver,
  zs: SiBilibili,
  jg: SiGrab,
  ni: SiGojek,
  ka: SiShopee,
  abn: SiBinance,
  st: SiSpotify,
  yr: SiYoutubetv,
  ane: SiSupercell,
  bwa: SiHostinger,
  bbg: GenericIcon("S", "#000"),
  bbj: SiMastercard,
  bbf: SiVisa,
  bbm: SiMercadopago,
  asp: SiPhonepe,
  amb: SiVercel,
  ex: SiHostinger,
  bbl: SiAdobe,

  byh: SiAdobe,
  fr: SiLine,
  me: SiLine,
  dl: SiLazada,
  xd: SiTokopedia,
  agl: SiBolt,
  rl: SiIndriver,
  ls: SiCareem,
  rr: SiWolt,
  aba: SiRappi,
  ua: SiBlablacar,
  sn: SiOlx,
  xy: SiDepop,
  oz: SiCarousell,
  zm: SiGetir,
  bxf: SiDisney,
  mo: SiMatch,
  qv: SiBadoo,
};

export const getIconComponent = (code) => {
  return iconMap[code] || null;
};

export const getServiceColor = (code) => {
  const colors = {
    go: "#4285F4", tg: "#26A5E4", wa: "#25D366", ig: "#E4405F", fb: "#1877F2",
    tw: "#000000", lf: "#000000", vi: "#7360FF", ds: "#5865F2", mm: "#00A4EF",
    am: "#FF9900", nf: "#E50914", ub: "#000000", tn: "#0A66C2",
    fu: "#FFFC00", wx: "#A2AAAD", hw: "#FF6A00", oi: "#FE3C72",
    mt: "#1B2838", ts: "#003087", me: "#00B900", bw: "#3A76F0",
    bbq: "#00C853", gs: "#1428A0", dr: "#10A37F", alj: "#1DB954",
    hb: "#9146FF", bnl: "#FF4500", vz: "#FF3366", mo: "#FFC629",
    vm: "#0077B5", aiw: "#6236FF", ahb: "#000000", blm: "#2F2F2F",
    re: "#0052FF", aon: "#F0B90B", afz: "#FFB3C7", ij: "#0075EB",
    ry: "#FFC72C", sr: "#00704A", fz: "#E4002B", ip: "#DA291C",
    ew: "#111111", yo: "#FF0000", pi: "#E60023", hx: "#E62E04",
    dl: "#0F146D", ka: "#EE4D2D", xd: "#42B549", jg: "#00B14F",
    ni: "#00B14F", dh: "#E53238", wr: "#0071CE", sn: "#191919",
    sg: "#CB11AB", uu: "#CB11AB", yn: "#FF6600", rc: "#00AFF0",
    uk: "#FF5A5F", tx: "#34D058", rl: "#00B14F",
    zk: "#00CCBC", rr: "#00B14F", ul: "#FF6600", aba: "#FF4400",
    ac: "#FF3008", ls: "#00B14F", bpz: "#00AA13", aq: "#00B14F",
    qv: "#0088CC", aez: "#222222", nc: "#2890D4",
    vk: "#4680C2", zs: "#00A1D6", tl: "#1A73E8", byh: "#FF0000",
    ge: "#00BAF2", asp: "#5F259F", ji: "#004DAF", bbm: "#00B14F",
    bbj: "#EB001B", bbf: "#1A1F71", stk: "#FF0000", tv: "#9146FF",
    tu: "#FF00BF", ani: "#00B14F", qe: "#FF6600", kk: "#FF6600",
    xt: "#2874F0", ve: "#FF6600",
    dy: "#E23744", jx: "#FC8019", adp: "#00B14F", dt: "#00B14F",
    aor: "#F0B90B", bbg: "#000000", bbl: "#FF0000",
    abk: "#EA4335", asj: "#EA4335", pm: "#003B73", mb: "#6001D2",
    agl: "#00B14F", vd: "#00247D", cw: "#006633", st: "#1DB954",
    yr: "#FF0000", ane: "#00ADEF", bwa: "#6739B6", afz: "#FFB3C7",
    abn: "#F0B90B", nc: "#2890D4", ti: "#002868", aoi: "#002868",
    aed: "#003580", nq: "#FF6600", fr: "#00B900",
    ik: "#E42527", bbj: "#EB001B", bbf: "#1A1F71", bpq: "#FF0000",
  };
  if (colors[code]) return colors[code];
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = code.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 65%, 50%)`;
};
