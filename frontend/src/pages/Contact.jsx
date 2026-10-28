export default function Contact() {
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL
  return <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8"><p className="eyebrow">We are here to help</p><h1 className="font-display text-5xl">Contact RentEase</h1>
    <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/65">Questions about how the platform works? Reach out to the RentEase team.</p>
    {supportEmail ? <div className="mt-8 rounded-3xl bg-white p-7 shadow-card"><h2 className="font-display text-2xl">Email our team</h2><p className="mt-2 text-sm text-ink/60">For account or listing concerns, include the relevant listing or booking reference and avoid sharing passwords or payment details.</p><a href={`mailto:${supportEmail}`} className="mt-5 inline-block rounded-full bg-ink px-6 py-3 font-bold text-white">{supportEmail}</a></div> :
      <div className="mt-8 rounded-3xl bg-white p-7 shadow-card"><h2 className="font-display text-2xl">Support contact not configured</h2><p className="mt-2 leading-7 text-ink/60">The platform operator can add a support email using the <code>VITE_SUPPORT_EMAIL</code> frontend environment variable.</p></div>}
  </section>
}
