import { SiteNav } from '@/components/site/SiteNav';
import { SiteFooter } from '@/components/site/SiteFooter';
import { WhatsAppFloat } from '@/components/site/WhatsAppFloat';
import { SiteBodyClass } from '@/components/site/SiteBodyClass';
import { CookieConsent } from '@/components/site/CookieConsent';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteBodyClass />
      <SiteNav />
      {children}
      <SiteFooter />
      <WhatsAppFloat />
      <CookieConsent />
    </>
  );
}
