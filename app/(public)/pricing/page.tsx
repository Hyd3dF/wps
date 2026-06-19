import type { Metadata } from "next";
import { PricingContent } from "./PricingContent";

export const metadata: Metadata = {
  title: "Fiyatlandırma",
  description:
    "Oroya fiyatlandırması — Free, Pro ve Ultra planları. Aylık ve yıllık abonelik seçenekleri.",
};

export default function PricingPage() {
  return <PricingContent />;
}
