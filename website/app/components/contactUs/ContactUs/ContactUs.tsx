import { useState } from "react";
import { Mail, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import emailjs from "@emailjs/browser";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "~/components/ui/dialog";
import { RailCardHeader } from "~/components/common/RailCardHeader/RailCardHeader";
import styles from "./ContactUs.module.scss";

const CONTACT_EMAIL = "thomas.daniel.galligan@ibm.com";
const CONTACT_LOCATION = "IBM, Building 6700\n" +
    "Avenue 6000\n" +
    "Lehenagh More\n" +
    "T12XR60";

const CONTACT_MAPS_URL =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("IBM, Building 6700 Avenue 6000 Lehenagh More T12XR60");

const EMAILJS_SERVICE_ID = "service_8dvqmne";
const EMAILJS_TEMPLATE_ID = "template_6998p1s";

type ContactFormData = {
    firstName: string;
    email: string;
    subject: string;
    message: string;
};

type ContactStatus = "idle" | "loading" | "complete" | "error";

const initialForm: ContactFormData = {
    firstName: "",
    email: "",
    subject: "",
    message: "",
};

export function ContactUs() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<ContactFormData>(initialForm);
    const [touched, setTouched] = useState<Set<keyof ContactFormData>>(new Set());
    const [status, setStatus] = useState<ContactStatus>("idle");

    const updateField = (field: keyof ContactFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const markTouched = (field: keyof ContactFormData) => {
        setTouched((prev) => new Set(prev).add(field));
    };

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);

        if (!nextOpen) {
            setFormData(initialForm);
            setTouched(new Set());
            setStatus("idle");
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setStatus("loading");

        try {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData);

            setStatus("complete");
            setFormData(initialForm);
            setTouched(new Set());

            setTimeout(() => {
                setStatus("idle");
                setOpen(false);
            }, 1500);
        } catch (err) {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 5000);
        }
    };

    const isLoading = status === "loading";
    const isComplete = status === "complete";
    const isError = status === "error";

    return (
        <Card className={styles.sidebarCard}>
            <CardHeader className={styles.cardHeader}>
                <RailCardHeader
                    title="Contact Us"
                    icon={<Mail size={18} />}
                />
            </CardHeader>

            <CardContent className={styles.cardBody}>
                <div className={styles.contactList}>
                    <div className={styles.contactItem}>
                        <Mail size={15} className={styles.contactIcon} />
                        <span>{CONTACT_EMAIL}</span>
                    </div>

                    <div className={styles.contactItem}>
                        <MapPin size={15} className={styles.contactIcon} />
                        <span className={styles.contactLocation}><a
                            href={CONTACT_MAPS_URL}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.contactLocation}
                        >
        {CONTACT_LOCATION}
    </a></span>
                    </div>
                </div>

                <Dialog open={open} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button className={styles.contactButton}>
                            Send us a message
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Contact Us</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className={styles.contactForm}>
                            <div className={styles.formField}>
                                <Label htmlFor="contact-first-name">First Name</Label>
                                <Input
                                    id="contact-first-name"
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={(e) => updateField("firstName", e.target.value)}
                                    onBlur={() => markTouched("firstName")}
                                    placeholder="Jane"
                                    aria-invalid={touched.has("firstName") && !formData.firstName}
                                />
                            </div>

                            <div className={styles.formField}>
                                <Label htmlFor="contact-email">Email</Label>
                                <Input
                                    id="contact-email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    onBlur={() => markTouched("email")}
                                    placeholder="you@example.com"
                                    aria-invalid={touched.has("email") && !formData.email}
                                />
                            </div>

                            <div className={styles.formField}>
                                <Label htmlFor="contact-subject">Subject</Label>
                                <Input
                                    id="contact-subject"
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => updateField("subject", e.target.value)}
                                    onBlur={() => markTouched("subject")}
                                    placeholder="How can we help?"
                                    aria-invalid={touched.has("subject") && !formData.subject}
                                />
                            </div>

                            <div className={styles.formField}>
                                <Label htmlFor="contact-message">Message</Label>
                                <Textarea
                                    id="contact-message"
                                    required
                                    value={formData.message}
                                    onChange={(e) => updateField("message", e.target.value)}
                                    onBlur={() => markTouched("message")}
                                    placeholder="Write your message..."
                                    rows={5}
                                    aria-invalid={touched.has("message") && !formData.message}
                                />
                            </div>

                            {isComplete && (
                                <div className={styles.statusMessage}>
                                    <CheckCircle2 size={15} />
                                    <span>Message sent! We&apos;ll be in touch soon.</span>
                                </div>
                            )}

                            {isError && (
                                <div className={`${styles.statusMessage} ${styles.statusError}`}>
                                    <AlertCircle size={15} />
                                    <span>Something went wrong. Please try again.</span>
                                </div>
                            )}

                            <DialogFooter>
                                <Button type="submit" disabled={isLoading || isComplete}>
                                    <Send size={15} />
                                    {isLoading ? "Sending..." : isComplete ? "Sent" : "Send Message"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}