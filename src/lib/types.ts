export interface S1Header {
  menuItems: string[];
  ctaText: string;
}

export interface S2Hero {
  mainCopy: string;
  subCopy: string;
  ctaText: string;
  secondaryCtaText: string;
  trustBadges: string[];
}

export interface S3Message {
  heading: string;
  body: string;
}

export interface ProblemCard {
  iconHint: string;
  heading: string;
  description: string;
}

export interface S4Problems {
  sectionHeading: string;
  cards: ProblemCard[];
}

export interface FeatureCard {
  pointLabel: string;
  title: string;
  description: string;
  imageHint: string;
}

export interface S5Features {
  sectionHeading: string;
  cards: FeatureCard[];
}

export interface CategoryCard {
  name: string;
  subText: string;
  imageHint: string;
}

export interface S6Categories {
  sectionHeading: string;
  cards: CategoryCard[];
  cta1: string;
  cta2: string;
}

export interface CaseCard {
  companyName: string;
  imageHint: string;
  summary: string;
}

export interface S7CaseStudies {
  sectionHeading: string;
  cards: CaseCard[];
  linkText: string;
  cta1: string;
  cta2: string;
}

export interface FlowStep {
  stepLabel: string;
  iconHint: string;
  title: string;
  description: string;
}

export interface S8Flow {
  sectionHeading: string;
  steps: FlowStep[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select';
  placeholder: string;
  required: boolean;
  options?: string[];
}

export interface FormConfig {
  fields: FormField[];
  submitLabel: string;
  actionUrl: string;
  adminEmail: string;
  ccEmail: string;
  privacyLabel: string;
  successMessage: string;
}

export interface S9FormFaq {
  faqs: FaqItem[];
  formHeading: string;
  formConfig: FormConfig;
}

export interface S10Closing {
  microCopy: string;
  cta1: string;
  cta2: string;
}

export interface S11Footer {
  links: string[];
  copyright: string;
}

export type SectionKey = 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8' | 's9' | 's10' | 's11';
export type ColorPalette = "A" | "B" | "C";

export const DEFAULT_SECTION_ORDER: SectionKey[] = ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11'];

export type LayoutIndex = 0 | 1 | 2 | 3;
export type SectionLayouts = Record<SectionKey, LayoutIndex>;
export const DEFAULT_SECTION_LAYOUTS: SectionLayouts = {
  s1: 0, s2: 0, s3: 0, s4: 0, s5: 0,
  s6: 0, s7: 0, s8: 0, s9: 0, s10: 0, s11: 0,
};

export interface StockedLP {
  id: string;
  name: string;
  savedAt: string;
  data: LPData;
  sectionOrder: SectionKey[];
  hiddenSections: SectionKey[];
  sectionLayouts: SectionLayouts;
}

export interface LPData {
  s1: S1Header;
  s2: S2Hero;
  s3: S3Message;
  s4: S4Problems;
  s5: S5Features;
  s6: S6Categories;
  s7: S7CaseStudies;
  s8: S8Flow;
  s9: S9FormFaq;
  s10: S10Closing;
  s11: S11Footer;
  images: Record<string, string>;
}
