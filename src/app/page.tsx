import Intro from "@/components/Intro";
import Nav from "@/components/Nav";
import Entrada from "@/components/Entrada";
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
import PulseArco from "@/components/PulseArco";
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
        {/* A entrada nova vai ANTES do hero antigo, não no lugar dele — o
            hero com o crachá 3D fica intacto até ela decidir. */}
        <Entrada />
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
        {/* O arco do PULSE entra a seguir aos clientes e ANTES da barra das
            ferramentas, como ela pediu. O projeto PULSE continua no <Work />,
            no lugar onde sempre esteve — isto é uma vitrine, não uma mudança. */}
        <PulseArco />
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
