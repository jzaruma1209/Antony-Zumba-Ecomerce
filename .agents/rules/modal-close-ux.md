# Estándares de Ergonomía y Accesibilidad para Modales y Popups

1. **Visibilidad y Área Táctil del Botón de Cierre:**
   * El botón de cierre (<kbd>X</kbd>) no debe quedar encajonado ni pasar desapercibido.
   * Dimensión mínima de área táctil: `36x36px` a `40x40px` (`w-9 h-9` o `w-10 h-10`).
   * Tamaño de icono estándar según Design System: `20px` (`w-5 h-5` con `strokeWidth={1.75}`).

2. **Posición Exterior (Flotante) en Fondos Oscuros o Densos:**
   * Si el modal posee fondos oscuros o tarjetas con gran densidad de información, el botón debe ubicarse flotante por fuera del marco del modal (`absolute -top-11 right-0 sm:-right-12 sm:top-0`), utilizando un wrapper contenedor sin `overflow-hidden` para evitar que el botón sea recortado.
   * Usar hover distintivo con color de acento o de marca (`hover:bg-[#f25c05]`).

3. **Accesibilidad WAI-ARIA y Salida:**
   * Implementar siempre listener de teclado para la tecla `Escape`.
   * Permitir cierre al hacer clic sobre el backdrop exterior (`onClick={onClose}`).
   * Bloquear el scroll del body mientras el modal esté abierto (`document.body.style.overflow = "hidden"`).
