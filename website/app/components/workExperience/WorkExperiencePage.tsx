import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import styles from "./WorkExperiencePage.module.scss";

export function WorkExperiencePage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Transition Year Work Experience</h1>
                <p className={styles.subtitle}>
                    Everything you need to know about applying for work experience during Transition Year.
                </p>
            </header>

            <Card className={styles.section}>
                <CardHeader>
                    <CardTitle>What is TY Work Experience?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        As part of Transition Year, students are given the chance to spend time in a real
                        workplace to get a feel for what different jobs and careers actually look like day
                        to day. It's a great opportunity to build confidence, pick up new skills, and figure
                        out what you might (or might not!) want to do after school.
                    </p>
                </CardContent>
            </Card>

            <Card className={styles.section}>
                <CardHeader>
                    <CardTitle>When Does It Take Place?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        Please check with your school directly for the exact dates, as these can vary
                        year to year.
                    </p>
                </CardContent>
            </Card>

            <Card className={styles.section}>
                <CardHeader>
                    <CardTitle>How to Apply</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        Applying is simple, but there are a few steps you'll need to follow before a
                        placement can be confirmed:
                    </p>
                    <ol className={styles.list}>
                        <li>
                            <strong>Get in touch with us first.</strong> Reach out to let us know you're
                            interested in a work experience placement. We'll talk you through what's
                            involved and answer any questions you have.
                        </li>
                        <li>
                            <strong>Send us your CV.</strong> This isn't about having loads of experience
                            it just helps us understand your current level of knowledge and skills, so we
                            can make the placement as useful as possible for you.
                        </li>
                        <li>
                            <strong>Get a letter from your school.</strong> Your school needs to confirm
                            that you're insured for the duration of your placement. This is a requirement
                            before any placement can go ahead.
                        </li>
                    </ol>
                    <p>
                        Once we have all of this, we'll be in touch to confirm the details of your
                        placement.
                    </p>
                </CardContent>
            </Card>

            <Card className={styles.section}>
                <CardHeader>
                    <CardTitle>About IBM</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        IBM (International Business Machines) is one of the world's longest-running and
                        best-known technology companies. Founded in 1911, IBM has grown from making early
                        computing and office equipment into a global leader in areas like cloud computing,
                        artificial intelligence, enterprise software, consulting, and research.
                    </p>
                    <p>
                        IBM operates in over 170 countries and works with businesses and governments
                        across almost every industry from banking and healthcare to manufacturing and
                        retail helping them solve complex problems using technology.
                    </p>
                </CardContent>
            </Card>

            <Card className={styles.section}>
                <CardHeader>
                    <CardTitle>Why Apply Here?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        A placement with us gives you a genuine look at how a large, global technology
                        organisation actually works. You'll get to see how different teams collaborate,
                        how technology is used to solve real problems, and how the work you might study in
                        school connects to what happens in the working world.
                    </p>
                    <p>
                        It's a chance to ask questions, observe real projects, and get a sense of the
                        skills that are valued in a modern workplace whether or not technology ends up
                        being the path you choose.
                    </p>
                </CardContent>
            </Card>

            <Card className={styles.section}>
                <CardHeader>
                    <CardTitle>IBM on a Global Scale</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        Because IBM operates internationally, the work carried out in any single office is
                        often part of something much bigger. Projects and technologies developed by IBM
                        are used by organisations all over the world, meaning the skills and processes
                        you'll be exposed to during your placement reflect how a truly global company
                        operates not just how a local office runs.
                    </p>
                </CardContent>
            </Card>

            <Card className={styles.section}>
                <CardHeader>
                    <CardTitle>Ready to Apply?</CardTitle>
                </CardHeader>
                <CardContent className={styles.ctaContent}>
                    <p>
                        Get in touch with us to start the process. We look forward to hearing from you!
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}