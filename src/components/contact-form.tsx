"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, Download } from "lucide-react";
import { useCart } from "./cart-provider";
import { formatPrice, getProduct } from "@/lib/products";
import "./commerce.css";

type FormValues = { name: string; email: string; subject: string; message: string };
type FieldErrors = Partial<Record<keyof FormValues, string>>;
type Receipt = FormValues & { createdAt: string; saved: boolean };
const topics = ["Styling advice", "Product details", "Order enquiry", "Something else"];

export function ContactForm({ initialSubject = "" }: { initialSubject?: string }) {
  const { items, subtotal } = useCart();
  const [values, setValues] = useState<FormValues>({ name: "", email: "", subject: topics.includes(initialSubject) ? initialSubject : initialSubject ? "Product details" : "Styling advice", message: initialSubject && !topics.includes(initialSubject) ? `I would like to know more about ${initialSubject}.` : "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  function update(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }
  function includeBag() {
    const selection = items.map((item) => `${getProduct(item.productId)?.name ?? item.productId} (${getProduct(item.productId)?.shade}) × ${item.quantity}`).join("\n");
    update("message", `I would like to enquire about this selection:\n\n${selection}\n\nIllustrative subtotal: ${formatPrice(subtotal)}\n\n`);
    update("subject", "Order enquiry");
    formRef.current?.querySelector<HTMLTextAreaElement>("textarea")?.focus();
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    if (values.name.trim().length < 2) nextErrors.name = "Please enter your name (at least 2 characters).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) nextErrors.email = "Please enter a valid email address.";
    if (values.message.trim().length < 20) nextErrors.message = "Tell us a little more (at least 20 characters).";
    setErrors(nextErrors);
    const firstField = Object.keys(nextErrors)[0];
    if (firstField) { formRef.current?.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus(); return; }
    const draft = { ...values, name: values.name.trim(), email: values.email.trim(), message: values.message.trim(), createdAt: new Date().toISOString() };
    let saved = false;
    try { localStorage.setItem("nr-studios:inquiry:v1", JSON.stringify(draft)); saved = true; } catch { /* Download remains available when browser storage is disabled. */ }
    setReceipt({ ...draft, saved });
    requestAnimationFrame(() => receiptRef.current?.focus());
  }
  function download() {
    if (!receipt) return;
    const content = `NR STUDIOS — ENQUIRY DRAFT\nSaved locally; this enquiry has not been sent.\n\nName: ${receipt.name}\nEmail: ${receipt.email}\nSubject: ${receipt.subject}\nDate: ${receipt.createdAt}\n\n${receipt.message}\n`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nr-studios-enquiry.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  if (receipt) return <div className="contact-receipt" ref={receiptRef} tabIndex={-1}><Check size={28} strokeWidth={1} aria-hidden="true" /><p className="commerce-kicker">Your thoughts, kept safe</p><h2>{receipt.saved ? "Your enquiry is saved." : "Your enquiry is ready."}</h2><p>{receipt.saved ? "Your draft has been saved on this device only." : "This browser could not save your draft. Download a copy to keep it."} No message has been sent; this preview is not connected to an inbox.</p><dl><div><dt>For</dt><dd>{receipt.name}</dd></div><div><dt>About</dt><dd>{receipt.subject}</dd></div></dl><button type="button" onClick={download} className="commerce-button">Download your enquiry <Download size={17} aria-hidden="true" /></button><button type="button" className="commerce-inline-link" onClick={() => setReceipt(null)}>Edit your draft <ArrowRight size={15} aria-hidden="true" /></button></div>;
  return <form ref={formRef} onSubmit={submit} className="contact-form" noValidate>
    <div className="contact-field"><label htmlFor="inquiry-name">Your name <span>(required)</span></label><input id="inquiry-name" name="name" autoComplete="name" value={values.name} onChange={(event) => update("name", event.target.value)} maxLength={100} required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} placeholder="How should we address you?" />{errors.name && <p id="name-error" className="field-error" role="alert">{errors.name}</p>}</div>
    <div className="contact-field"><label htmlFor="inquiry-email">Email address <span>(required)</span></label><input id="inquiry-email" name="email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={(event) => update("email", event.target.value)} maxLength={254} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} placeholder="you@example.com" />{errors.email && <p id="email-error" className="field-error" role="alert">{errors.email}</p>}</div>
    <div className="contact-field"><label htmlFor="inquiry-subject">A conversation about</label><select id="inquiry-subject" name="subject" value={values.subject} onChange={(event) => update("subject", event.target.value)}>{topics.map((topic) => <option key={topic}>{topic}</option>)}</select></div>
    <div className="contact-field"><label htmlFor="inquiry-message">Your message <span>(required)</span></label><textarea id="inquiry-message" name="message" rows={5} value={values.message} onChange={(event) => update("message", event.target.value)} minLength={20} maxLength={2000} required aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : "message-hint"} placeholder="An occasion, a colour, a saree you can’t stop thinking about…" />{errors.message ? <p id="message-error" className="field-error" role="alert">{errors.message}</p> : <p id="message-hint" className="field-hint">20–2,000 characters <span>{values.message.length}/2,000</span></p>}</div>
    {items.length > 0 && <button type="button" className="commerce-inline-link contact-include-bag" onClick={includeBag}>Include my bag in the message <ArrowRight size={15} aria-hidden="true" /></button>}
    <p className="contact-privacy">Portfolio preview: this form saves your latest draft in this browser. It does not send email. You can download your enquiry after saving.</p>
    <button type="submit" className="commerce-button">Save enquiry draft <ArrowRight size={17} aria-hidden="true" /></button>
  </form>;
}
