import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

import { PageShell, Eyebrow } from "@/components/aura/PageShell";
import { Petals } from "@/components/aura/Petals";
import { AURA_QA } from "@/lib/aura-qa";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "Aura — Your Bridal Concierge" }] }),
  component: Assistant,
});

type Msg = { role: "user" | "aura"; text: string };

const PROMPTS = [
  "How do I prepare my skin 3 months before my wedding?",
  "Best bridal salons in T Nagar?",
  "What is HD makeup?",
  "How much does bridal makeup cost in Chennai?",
];

const seed: Msg[] = [
  { role: "aura", text: "Welcome. I'm Aura — your bridal beauty concierge. Ask me about skin prep, makeup, salons, sarees, jewellery or planning." },
];

// ---- simple keyword / exact matcher (no AI) ----
const STOPWORDS = new Set([
  "the","a","an","is","are","was","were","be","been","being","do","does","did",
  "i","you","my","me","we","us","our","your","of","for","to","in","on","at","by",
  "with","and","or","but","if","then","so","than","that","this","these","those",
  "how","what","when","where","why","which","who","whom","whose","can","could",
  "should","would","will","shall","may","might","have","has","had","get","got",
  "about","into","from","it","its","as","up","out","over","under","just","also",
]);

const GREETINGS: Record<string, string> = {
  hi: "Hi! I'm Aura. Ask me anything about bridal skincare, makeup, salons, sarees or wedding planning. 💐",
  hello: "Hello! Lovely to meet you. What would you like to plan first — skin, makeup, or your wedding timeline?",
  hey: "Hey there! Ready when you are — try asking about HD makeup, muhurtham looks, or bridal budgets.",
  hola: "Hola! I'm Aura, your bridal beauty concierge. Ask me anything about your big day.",
  namaste: "Namaste! How can I help with your bridal journey today?",
  vanakkam: "Vanakkam! Ask me about muhurtham looks, Kanjivaram drapes, or top Chennai salons.",
  "good morning": "Good morning! Hope your wedding prep is going beautifully. What can I help with?",
  "good evening": "Good evening! Ready to plan? Ask me about reception looks, salons, or skincare.",
  "good afternoon": "Good afternoon! What would you like to plan — makeup, hair, or your timeline?",
  thanks: "You're so welcome! Anything else I can help with? 💖",
  "thank you": "My pleasure! I'm here whenever you need bridal advice.",
  bye: "Goodbye — wishing you a magical wedding! Come back anytime. ✨",
  goodbye: "Take care! Aura is always here when you need bridal guidance.",
  ok: "Got it! Any other questions I can help with?",
  okay: "Got it! Any other questions I can help with?",
  yes: "Lovely! What would you like to explore next?",
  no: "No worries — ask me anything whenever you're ready.",
};

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function tokens(s: string): string[] {
  return normalize(s).split(" ").filter((w) => w && !STOPWORDS.has(w));
}

function reply(q: string): string {
  const norm = normalize(q);
  if (!norm) return "Could you rephrase that? I can help with skincare, makeup, salons, sarees or wedding planning.";

  // greetings / pleasantries
  for (const key of Object.keys(GREETINGS)) {
    const re = new RegExp(`(^|\\s)${key}(\\s|$)`);
    if (re.test(norm)) return GREETINGS[key];
  }

  // exact match
  const exact = AURA_QA.find((qa) => normalize(qa.question) === norm);
  if (exact) return exact.answer;

  // keyword scoring
  const qTokens = tokens(q);
  if (qTokens.length === 0) {
    return "Tell me a bit more — are you asking about skin, makeup, hair, sarees, jewellery, salons or planning?";
  }

  let best = { score: 0, answer: "" };
  for (const qa of AURA_QA) {
    const aTokens = new Set(tokens(qa.question));
    let score = 0;
    for (const t of qTokens) if (aTokens.has(t)) score += 1;
    // bonus for substring of question
    if (normalize(qa.question).includes(norm) && norm.length > 4) score += 2;
    if (score > best.score) best = { score, answer: qa.answer };
  }

  if (best.score >= 2) return best.answer;
  if (best.score === 1) {
    return best.answer + "\n\nIf that's not quite what you meant, try rephrasing — e.g. 'bridal makeup cost', 'muhurtham look', or 'salons in Mylapore'.";
  }

  return "I don't have an exact answer for that yet. Try asking about skincare timelines, HD vs airbrush makeup, salons in T Nagar / Mylapore / Alwarpet, sarees, jewellery, mehendi or your wedding timeline.";
}

function Assistant() {
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 1e9, behavior: "smooth" });
  }, [msgs, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    setMsgs((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setTyping(true);
    const answer = reply(t);
    window.setTimeout(() => {
      setMsgs((m) => [...m, { role: "aura", text: answer }]);
      setTyping(false);
    }, 450);
  };

  return (
    <PageShell>
      <div className="relative mx-auto max-w-4xl px-6 pt-28">
        <Petals count={10} opacity={0.3} />
        <div className="text-center">
          <Eyebrow>Aura · Bridal Concierge</Eyebrow>
          <h1 className="mt-4 font-display text-5xl tracking-tight text-noir md:text-6xl">
            Ask me <em className="text-gradient-rose font-light not-italic">anything</em>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm font-light text-noir/60">
            Skincare timelines, salon matches, sarees, jewellery & ritual planning.
          </p>
        </div>

        <div className="glass mt-10 overflow-hidden rounded-[2rem]">
          <div ref={scrollerRef} className="max-h-[58vh] space-y-5 overflow-y-auto p-8">
            {msgs.map((m, i) => <Bubble key={i} m={m} />)}
            {typing && (
              <div className="flex items-center gap-2 text-xs text-noir/50">
                <Sparkles className="h-3 w-3 animate-pulse text-rose-gold" /> Aura is composing…
              </div>
            )}
          </div>

          <div className="border-t border-rose-gold/15 bg-white/40 p-5 backdrop-blur-xl">
            <div className="mb-3 flex flex-wrap gap-2">
              {PROMPTS.map((p) => (
                <button key={p} onClick={() => send(p)}
                  className="rounded-full border border-rose-gold/25 bg-white/60 px-3 py-1.5 text-[11px] text-noir/70 transition hover:bg-rose-gold/10 hover:text-rose-gold">
                  {p}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3"
            >
              <input
                value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Whisper your question…"
                className="flex-1 bg-transparent text-sm text-noir placeholder:text-noir/40 focus:outline-none"
              />
              <button type="submit" className="grid h-10 w-10 place-items-center rounded-full text-white transition hover:scale-105"
                style={{ background: "var(--gradient-rose)" }}>
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Bubble({ m }: { m: Msg }) {
  const isUser = m.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[78%] whitespace-pre-line rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${isUser ? "rounded-br-md text-white" : "rounded-bl-md bg-white/70 text-noir"}`}
        style={isUser ? { background: "var(--gradient-rose)" } : undefined}>
        {!isUser && <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-rose-gold">Aura</p>}
        {m.text}
      </div>
    </motion.div>
  );
}
