import Intro from "@/components/Intro";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import About from "@/components/About";
import Marquee from "@/components/Marquee";
import PostsTunnel from "@/components/PostsTunnel";
import Services from "@/components/Services";
import LogoMarquee from "@/components/LogoMarquee";
import Work from "@/components/Work";
import Motion from "@/components/Motion";
import Vitrine from "@/components/Vitrine";
import Clientes from "@/components/Clientes";
import Competencias from "@/components/Competencias";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { disciplines } from "@/content/profile";

export default function Home() {
  return (
    <>
      <Intro />
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <About />
        <Marquee items={disciplines} />
        <PostsTunnel />
        <Services />
        <Motion />
        {/* Logo a seguir ao Motion, como ela pediu. A LogoMarquee continua
            colada ao <Work />, que é de onde ela é. */}
        <Vitrine />
        <Clientes />
        <LogoMarquee />
        <Work />
        <Competencias />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
