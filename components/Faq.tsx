export const faqs = [
  {
    q: "Is this medical advice?",
    a: "No. I'm a certified holistic health coach, and sessions are wellness education and lifestyle guidance. I work alongside your GP and other professionals, never instead of them, and I'll always tell you when something needs a doctor.",
  },
  {
    q: "Do I have to be on camera?",
    a: "Not at all. Sessions can be a phone call, a WhatsApp call or a video call with your camera off. Many women join from the kitchen table while the children are at school.",
  },
  {
    q: "Are sessions private and women only?",
    a: "Yes. It's just you and me, sister to sister. Nothing you share is passed on without your permission, and your information is handled in line with UK GDPR.",
  },
  {
    q: "Is your guidance halal conscious?",
    a: "Yes. As well as checking for toxins, I look for hidden alcohol, animal derived gelatin and other ingredients that matter to Muslim families, and I build routines that fit around salah, Ramadan and family life.",
  },
  {
    q: "Will I have to throw everything out or buy expensive products?",
    a: "No. We change the few things that matter most first, at a pace and budget that suit you. I'll never push a product on you, and many swaps cost nothing at all.",
  },
  {
    q: "Can you help with a child who has autism or sensory needs?",
    a: "Yes. The family package starts with a detailed intake form covering sensory preferences, triggers, allergies and routines, so every suggestion is gentle, safe and something your child might actually enjoy.",
  },
  {
    q: "What happens after I book?",
    a: "You'll get a calendar invite straight away. For the family package, you'll also fill in the intake form at least 48 hours before we meet, so our time is spent on guidance rather than questions.",
  },
  {
    q: "What if I'm not sure which option is right?",
    a: "Book the free discovery call. We'll talk for 20 minutes, and I'll tell you honestly whether I can help and which option fits. There's no obligation to book anything else.",
  },
];

export function Faq() {
  return (
    <div className="faq">
      {faqs.map((f) => (
        <details key={f.q}>
          <summary>
            <span>{f.q}</span>
            <span className="faq-icon" aria-hidden="true" />
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
