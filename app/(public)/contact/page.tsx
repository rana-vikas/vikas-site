import { FadeIn } from "@/components/animations/FadeIn";
import { ContactForm } from "@/components/contact/ContactForm";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-24 pt-32">
      <FadeIn>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Contact
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Reach out for career opportunities, fitness questions, cricket, or
          anything else.
        </p>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="mt-10">
          <ContactForm />
        </div>
      </FadeIn>
    </section>
  );
}
