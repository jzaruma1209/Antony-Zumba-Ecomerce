import BeforeAfterSlider from "@/components/ui/BeforeAfterSlider";
import Link from "next/link";
import Image from "next/image";

export default function InstalacionesPage() {
  return (
    <div className="font-sans antialiased selection:bg-tz-orange selection:text-white bg-[#EFECE5] text-[#2A2A2A] min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        .link-hover-effect {
          position: relative;
          display: inline-block;
          padding-bottom: 2px;
        }
        .link-hover-effect::after {
          content: '';
          position: absolute;
          width: 100%;
          transform: scaleX(0);
          height: 1px;
          bottom: 0;
          left: 0;
          background-color: currentColor;
          transform-origin: bottom right;
          transition: transform 0.25s ease-out;
        }
        .link-hover-effect:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
      `}} />
      
      {/* Hero Section */}
      <header className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full opacity-80 mix-blend-multiply grayscale-[20%]">
           <BeforeAfterSlider 
              afterSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuCBtLyq3q98JPg10hXKNlGoIIHLQuhfiPCoNKVanJTYYoZSQASNLT4R2tGC57qjTQhuItLl9S0IRiaAJRKfm136ZWR5sbGaHKouv1tCRslasvXZco8xDNLvA6SgzwGYVpguim8UsLlxyYxLRyVpjP5K8i2EhULNuO4N2BdujpWtNF0OJjrswSluUQWQBYH5U4WGSpof70rzuY_0CAEW2CqwB2IcfIwMG-YHssizJiLGB-b1lgPMKzY"
           />
        </div>
        <div className="absolute inset-0 bg-[#EFECE5]/20 pointer-events-none"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pointer-events-none">
          <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight mb-6 drop-shadow-lg">
            Dominando el arte de la instalación en Gypsum.
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-light mb-10 max-w-2xl mx-auto">
            Transformamos tus espacios con instalaciones profesionales de gypsum, cielo raso, divisiones y paredes con acabados perfectos.
          </p>
          <a className="pointer-events-auto inline-block bg-[#F5821F] text-white px-8 py-4 text-sm uppercase tracking-widest font-semibold hover:bg-black transition-colors duration-300" href="#projects">
            Ver Nuestros Proyectos
          </a>
        </div>
      </header>

      {/* Intro / Philosophy */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-5 text-sm uppercase tracking-widest text-[#F5821F] font-semibold mb-4 md:mb-0">
          Nuestra Experiencia
        </div>
        <div className="md:col-span-7">
          <h2 className="text-3xl md:text-4xl font-serif leading-snug mb-8">
            Creemos que la base de un espacio hermoso radica en una estructura sólida y acabados impecables.
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-xl">
            En TumbadosZumba, no solo levantamos paredes; creamos el lienzo para tu estilo de vida. Nuestra dedicación a la precisión, el uso de perfilería y placas de primera calidad, garantizan que cada proyecto —desde intrincados diseños en cielo raso y tumbados, hasta divisiones comerciales expansivas— cumpla con los más altos estándares de calidad y estética.
          </p>
        </div>
      </section>

      {/* Masonry Gallery */}
      <section className="py-12 bg-white px-6" id="projects">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12">
            {/* Block 1: Text Left, Image Right */}
            <article className="flex flex-col justify-center bg-[#FAF9F6] p-10 md:p-16 border border-[#D9D3C8]/30 h-full rounded-none">
              <span className="text-xs uppercase tracking-widest text-gray-500 mb-4 block">Residencial</span>
              <h3 className="text-3xl font-serif mb-4">Cielo Raso Decorativo</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                Diseño e instalación completa de cielo raso de gypsum con integración de iluminación LED indirecta para embellecer los ambientes de tu hogar.
              </p>
              <Link className="text-xs uppercase tracking-widest font-semibold flex items-center border-b border-black w-max pb-1 group hover:text-[#F5821F] hover:border-[#F5821F] transition-colors" href="#">
                Saber Más <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </article>
            <div className="h-full min-h-[400px]">
               <BeforeAfterSlider 
                  afterSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuB8xyiR_zZAZcjnXzScxNhhQ1gElQgM_29PVUo8XO94sfw_3DWwdZ8LuQFlivfTMvMPc5e2GpQ_TJasuTUyteDUzg7wThpZmesJzOBG_IGaz5uNiC5w8OJ0NLD4C7I9qoPYp9A0Dy7ZWTT9mphTbAhzTLdDKAjRbvHltamFlxKaUZh79feafq61ROEbksAi71GAaOeQ3sstYtOh_fgHyg2k1NAHadLGQoc105rDzy50P8Ti_iBkO3o"
               />
            </div>
            
            {/* Block 2: Image Left, Text Right */}
            <div className="h-full min-h-[400px] order-4 md:order-3">
               <BeforeAfterSlider 
                  afterSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuARsWUXcv-lPSTpaWk6r-p_yghzuJKZAh6SSXG568v0ZZipp5WdjAGxhPG8jFQuVefPEpMUbP4turU2wY1AK8dLxn_roFsjfrlVwy6me7sdtP57ic4yl3vlp9YkebYSRjDTwx0eUfo-nEqOQVbooqJiMsVmj3czw76JqC4Coowc2VMSAwZTHjOrjeQ1SQQ-kv_cM0batnvXoi21aHj5RNvAKzp7JniCl9ydntuHYoU0nhrw-ILvExw"
               />
            </div>
            <article className="flex flex-col justify-center bg-[#FAF9F6] p-10 md:p-16 border border-[#D9D3C8]/30 h-full order-3 md:order-4 rounded-none">
              <span className="text-xs uppercase tracking-widest text-gray-500 mb-4 block">Comercial</span>
              <h3 className="text-3xl font-serif mb-4">Paredes y Divisiones</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                Soluciones en paredes de gypsum y divisiones acústicas diseñadas para un aislamiento óptimo de sonido, ideal para oficinas y locales comerciales.
              </p>
              <Link className="text-xs uppercase tracking-widest font-semibold flex items-center border-b border-black w-max pb-1 group hover:text-[#F5821F] hover:border-[#F5821F] transition-colors" href="#">
                Saber Más <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </article>
          </div>

          {/* Full Width Breakout */}
          <div className="mt-12 w-full h-[60vh] relative group overflow-hidden">
             <BeforeAfterSlider 
                afterSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuAMCoiaBA68MMSyql2VvsXU093qu1QVfCmE2p_L_kT995zxfslha9JvGxW3Diyi_K0YwHgtTX6fb3QbR6L5agD0yUCWacRjtr4xk8-I8x5hZtaimfoZuFvV9M2wiSjzc6G7KZ4B7_xxVpYmknItIPOpt9H0S4qrfVn6r-j8jrPC-_L0q404_9nzVJA15APyWLh6Zo7xmqo-zu_WVKX7MmOv-o4P4k_MViy4ShNhz89qZdYiF8Rg51w"
             />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none"></div>
            <div className="absolute bottom-10 left-10 text-white pointer-events-none">
              <span className="text-xs uppercase tracking-widest mb-2 block opacity-80">Proyecto Destacado</span>
              <h3 className="text-4xl font-serif">Remodelación de Locales Comerciales</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Before / After Comparison */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Del Armazón al Acabado Final</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Observa la transformación, desde la perfilería metálica estructural hasta la pared de gypsum terminada, empastada y lista.</p>
        </div>
        <div className="max-w-5xl mx-auto bg-[#D9D3C8] h-[500px]">
           <BeforeAfterSlider 
              beforeSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDayY2zm0KacWHyLLaQjtBwje3fj9UVioG-GcNrpRnyqoMuWYrYRB5YCzUg5dJG2A9dRNMItW_oUOqYIYYVWqUTxNpiYlRB-nE4UzEKRJUcaOJAu9054HPInry8kN_y77EbD8pMnNTOKym91dQdQODpOUMrcI474RBdWymPP9NIUCPEmzNqRj5oSTs3ENQiu2lASYZiQK3L_EzfyJEVkVq5NIgh-fEg-mkmXwid4d_nGgHvUkn5ZQQ"
              afterSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuC8GSR46gtdA7Ux-WA_THPeWjJO4oNYPQ58Jo0veYte2G5MYTkMzQ921slQHeV0kNVv5UELmvyCIDTtx_A32gPRmBSpdAUEIwNb4iv-8OJvsEpz_g2NinLqab7q_EZJ82KU13_M2SWFvKAcCoRzdpMg4EK78RMqhNpxCe9Bt1SYrYxkqh4wwQUX303omTfZRNlerUfStf5t-GWnowrWn-HrxkZMFj6bAcnfFz-DkGLGUddK-_dOVDw"
           />
        </div>
      </section>

      {/* Partner Logos */}
      <section className="border-y border-[#D9D3C8] bg-[#F9F8F6] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs uppercase tracking-widest text-gray-500 mb-8">Nuestros Aliados y Marcas de Confianza</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Partner Logo 1" className="h-8 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5NZ3WqrDOPiJ9XIhOoelhnK-_vApnEoF9CzGb9SIJjK2I6EgTlpNKTVF6DAudP-87BZ6hRld2c2SoqGqI0sot0joIkAbb5RyudEBeHKyqJIGCv_T41FyZRCLiKCaifQZzM5njs8JmhQjYkMojlI_EIZWNDBuev919CunrVEQn50KHK-iGwbl7JyP-F4AdtZ13ekTCCeWeQiNmo1SauSQ7v7jLyvpVLrmgTvK39drRjXK3Fwh1eeQ"/>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Partner Logo 2" className="h-8 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH9dq9clDnFpDACSjR89V8eo_bfrinopXdbvQWiEiC8LkQjgKvEOLpdsABRhxX1T3c6z3GgQz90Oof-tX9EQMe59AmbSgBjqHDIs7SohqFfLKhL5ENdaUpR_8nRP9d6vgjyZJwd-nbyiXEBJsHpUU6FWKdqa2UgZUzlH0H7nrQQlTEr6-Tlh9Bfv-rA4gRrE5jWRrmbRGulxTGflUw6q_gLu-lHCX1i_YFSWauiLEetyVyYeV1YsA"/>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Partner Logo 3" className="h-8 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBchsWRxJyNJb_ywZMR-ZtoFgP42S-aOQ3u9N3jXZm5KeO1NdGAolL6CBmFCLlHOVgCOBzRvfZBRQ07pYDTaWJGN0xWIqrZIqdwyukxJ226mXbrIKfQZVMOGW9vMYP0exF9-iJFm3wd_AtHS2v3xL3FSV6tw-W5crvDuezhu1pfbISDkUK2Ji61jp20lQiHbMXhjPe69IjLZ0j3_uJ99PQEmMoCXg_Ng30W-VTSUCkjTbCsBMP3ilw"/>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Partner Logo 4" className="h-8 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQAJMJ5cAiYjsvt2Ay6E_oY0X1HmQbuVbJ8F8AH5eU5XLyd-_jy-NziQV7I8EBQq5bu5HgzrCJA5rRwRdCVHoCtCjd3akprcWGpgxcnFQti3izKZ_UI_dsUC5WcjTUpfhGHdp0BZgGSixNHOBVglPGybQEawqCiQ4KyrW2XuIc2Nnhv_dLhvCKGfly76y3J4LjA05vjiatskUURp8-M4AXdeOlsDd4OPMHeaRcdugrbiYwficpQls"/>
          </div>
        </div>
      </section>

      {/* Formulario de Cotización y Contratación */}
      <section id="cotizar" className="py-20 bg-[#FAF9F6] border-t border-[#D9D3C8] px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-[#F5821F] font-semibold mb-2 block">
              Cotiza Tu Trabajo
            </span>
            <h2 className="text-3xl md:text-5xl font-serif mb-4">
              Solicita tu Cotización o Contrata un Proyecto
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Déjanos tus datos y las características de tu espacio. Te contactaremos inmediatamente para brindarte una asesoría personalizada y un presupuesto detallado.
            </p>
          </div>

          <form className="bg-white p-8 md:p-12 border border-[#D9D3C8]/60 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest font-semibold text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-[#FAF9F6] border border-[#D9D3C8] px-4 py-3 text-sm focus:outline-none focus:border-[#F5821F] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-semibold text-gray-700 mb-2">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. 099 123 4567"
                  className="w-full bg-[#FAF9F6] border border-[#D9D3C8] px-4 py-3 text-sm focus:outline-none focus:border-[#F5821F] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest font-semibold text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-[#FAF9F6] border border-[#D9D3C8] px-4 py-3 text-sm focus:outline-none focus:border-[#F5821F] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-semibold text-gray-700 mb-2">
                  Tipo de Proyecto *
                </label>
                <select
                  required
                  className="w-full bg-[#FAF9F6] border border-[#D9D3C8] px-4 py-3 text-sm focus:outline-none focus:border-[#F5821F] transition-colors text-gray-700"
                >
                  <option value="">Selecciona el tipo de trabajo</option>
                  <option value="cielo-raso">Instalación de Cielo Raso / Tumbados</option>
                  <option value="paredes-divisiones">Paredes o Divisiones de Gypsum</option>
                  <option value="remodelacion-comercial">Remodelación Comercial Integral</option>
                  <option value="acabados-luces">Diseño con Luces Indirectas / Falso Techo</option>
                  <option value="otro">Otro Proyecto</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-gray-700 mb-2">
                Detalles del Proyecto o Medidas Aproximadas
              </label>
              <textarea
                rows={4}
                placeholder="Cuéntanos brevemente sobre los metros cuadrados aproximados, ciudad, tipo de inmueble o cualquier especificación relevante..."
                className="w-full bg-[#FAF9F6] border border-[#D9D3C8] p-4 text-sm focus:outline-none focus:border-[#F5821F] transition-colors"
              ></textarea>
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full md:w-auto inline-block bg-[#F5821F] text-white px-10 py-4 text-sm uppercase tracking-widest font-semibold hover:bg-black transition-colors duration-300"
              >
                Enviar Solicitud de Cotización
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer / Contact CTA */}
      <footer className="bg-[#1A1A1A] text-[#EFECE5] py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white">Comienza tu proyecto hoy.</h2>
            <p className="text-gray-400 mb-10 max-w-md leading-relaxed">
              Confía en TumbadosZumba para la mejor mano de obra en instalaciones de gypsum, paredes y cielo raso. Contáctanos para cotizar tus requerimientos.
            </p>
            <a className="text-[#F5821F] text-2xl font-serif hover:text-white transition-colors block mb-4" href="mailto:info@tumbadoszumba.com">
              info@tumbadoszumba.com
            </a>
            <p className="text-gray-400">+593 99 123 4567</p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="uppercase tracking-widest text-gray-500 mb-4 font-semibold">Ubicación</h4>
              <p className="text-gray-300 leading-relaxed">
                Av. de los Shyris<br/>
                Edificio Zura, Of 401<br/>
                Quito, Ecuador
              </p>
            </div>
            <div>
              <h4 className="uppercase tracking-widest text-gray-500 mb-4 font-semibold">Social</h4>
              <ul className="space-y-2">
                <li><Link className="text-gray-300 hover:text-[#F5821F] transition-colors" href="#">Instagram</Link></li>
                <li><Link className="text-gray-300 hover:text-[#F5821F] transition-colors" href="#">LinkedIn</Link></li>
                <li><Link className="text-gray-300 hover:text-[#F5821F] transition-colors" href="#">Facebook</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-gray-800 text-xs text-gray-500 flex justify-between items-center">
          <p>© 2023 TumbadosZumba. All rights reserved.</p>
          <div className="space-x-4">
            <Link className="hover:text-gray-300" href="#">Políticas de Privacidad</Link>
            <Link className="hover:text-gray-300" href="#">Términos de Servicio</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
