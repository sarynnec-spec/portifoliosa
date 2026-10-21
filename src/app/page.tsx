import Intro from "@/components/Intro";
import Nav from "@/components/Nav";
import Entrada from "@/components/Entrada";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import About from "@/components/About";
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

export default function Home() {
  return (
    <>
      <Intro />
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <About />
        {/*
          A entrada do baloiço vive AQUI e não no topo: em cima a página fala
          dela — quem é, o manifesto, o percurso — e é a partir deste ponto
          que começa o portefólio a sério. Foi ela que o pediu assim.

          A faixa PRETA que a entrada já traz no fim fica no lugar da barra
          LARANJA das disciplinas que aqui estava: é a mesma lista
          (`disciplines`), noutra cor, por isso a barra não se perdeu — mudou
          de dono. Daí o `Marquee` solto ter saído.
        */}
        <Entrada />
        <PostsTunnel />
        <Services />
        {/*
          O arco sobe para ANTES do «Vídeo vertical», a pedido dela — abre a
          parte do trabalho em vez de a fechar. O projeto PULSE continua no
          <Work />, no lugar onde sempre esteve: isto é uma vitrine, não uma
          mudança de sítio do projeto.
        */}
        <PulseArco />
        <Motion />
        {/* A LogoMarquee continua colada ao <Work />, que é de onde ela é. */}
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
