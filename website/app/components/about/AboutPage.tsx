import styles from "./AboutPage.module.scss";

export default function AboutPage() {
  return (
    <main className={`${styles.main} typeset typeset-docs`}>
      <h1>Welcome to Cork Airport Dojo</h1>

      <img src="/logo.webp" />

      <p>
        Cork Airport Code Club is a great opportunity for children and teens can
        explore the exciting world of technology.
      </p>

      <p>
        Every Saturday, we provide hands-on coding experience covering a range
        of topics, from the fundamentals of website development, to cutting-edge
        topics like AI.
      </p>

      <p>
        More than just learning to code, Code Club is a safe and supportive
        space for young people to be themselves, connect with like-minded peers,
        and grow their tech skills in a fun and engaging environment.
      </p>

      <p>
        Cork Airport Code Club takes place on IBM premises in the Red Hat
        building in the Cork Airport Business Park. You will see lots of Red Hat
        branding, but don't worry, you're in the right place. The bottom floor
        is for IBM offices, where we will host classes. The office is just down
        the road from the Cork International Hotel.
      </p>

      <h3>What you need to bring</h3>

      <ul>
        <li>a laptop</li>
        <li>a lunch if you like</li>
        <li>a parent</li>
      </ul>

      <p>
        <strong>
          If your child is younger than 13, you (the parent / guardian) will
          need to stay in the building during their class(es).
        </strong>
        There is a kitchen where you can relax and have a tea or coffee and chat
        with other parents while you wait. Alternatively, you can sit in with
        the kids and take part in the class with them.
      </p>

      <p>
        Please ensure that if the laptop is using Windows, that the version is
        not version S, as this is a locked-down version of Windows, that doesn't
        allow one to install any software outside of the Windows Store.
      </p>

      <h3>Safeguarding</h3>

      <p>
        Code Club's safeguarding policy aims to protect protect children, young
        people, and vulnerable adults who take part in Code Club activities.
      </p>

      <p>
        All Cork Airport Dojo mentors will have completed Code Club's
        safeguarding module, which covers the following topics;
      </p>

      <ul>
        <li>code of behavior</li>
        <li>child disclosures</li>
        <li>online safety</li>
      </ul>

      <p>
        To see more information about Code Club's policies on safeguarding and
        child safety,{" "}
        <a href="https://help.coderdojo.com/cdkb/s/article/Safeguarding-Policy">
          click here
        </a>
        .
      </p>
    </main>
  );
}
