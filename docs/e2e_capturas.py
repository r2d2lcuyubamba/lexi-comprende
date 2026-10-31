"""Prueba de extremo a extremo + capturas (ejecutar desde la raíz tras npm run build: python3 docs/e2e_capturas.py)."""
import subprocess, time, sys, pathlib
from playwright.sync_api import sync_playwright

OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "capturas"); OUT.mkdir(exist_ok=True)
srv = subprocess.Popen(["npx", "vite", "preview", "--port", "4173", "--strictPort"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(3)
errores = []
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 420, "height": 860}, device_scale_factor=2)
        pg.on("console", lambda m: m.type == "error" and errores.append(m.text))
        pg.on("pageerror", lambda e: errores.append(str(e)))
        pg.goto("http://localhost:4173"); pg.wait_for_timeout(800)

        pg.fill("#codigo", "ZZZZ"); pg.click("text=Lucía"); pg.click("text=¡Entrar!")
        assert pg.is_visible("text=Ese código no existe"), "falta mensaje de código inválido"
        pg.fill("#codigo", "4b7k"); pg.wait_for_timeout(200)
        pg.screenshot(path=OUT / "app_01_ingreso.png")
        pg.click("text=¡Entrar!"); pg.wait_for_timeout(500)
        pg.screenshot(path=OUT / "app_02_inicio.png")

        pg.click("text=Comenzar"); pg.wait_for_timeout(300)
        pg.screenshot(path=OUT / "app_03_lector.png")
        pg.click("text=Ya leí"); pg.wait_for_timeout(300)

        # Lectura nivel 2 (El cóndor): Q1 ok, Q2 ok, Q3 error -> pista -> ok, Q4 ok, Q5 ok
        pg.click("text=Porque tenía miedo"); pg.wait_for_timeout(250)
        pg.screenshot(path=OUT / "app_04_feedback_ok.png")
        pg.click("text=Siguiente"); pg.click("text=Una pluma de su madre"); pg.click("text=Siguiente")
        pg.click("text=Muy feliz y tranquilo"); pg.wait_for_timeout(250)
        pg.screenshot(path=OUT / "app_05_pista.png")
        pg.click("text=Intentar de nuevo"); pg.click("text=Con ganas, pero asustado"); pg.click("text=Siguiente")
        pg.click("text=Que el viento lo ayudó a mantenerse arriba"); pg.click("text=Siguiente")
        pg.click("text=Querer ayudar a su madre"); pg.click("text=Ver mi resultado"); pg.wait_for_timeout(500)
        pg.screenshot(path=OUT / "app_06_resultado.png", full_page=True)
        texto_res = pg.inner_text("body")

        pg.click("text=Ver cómo decidió el motor"); pg.wait_for_timeout(300)
        pg.set_viewport_size({"width": 1100, "height": 900})
        pg.click("text=Ejecutar pruebas"); pg.wait_for_timeout(300)
        pg.screenshot(path=OUT / "app_07_panel_pruebas_v1.png", full_page=True)
        resumen_v1 = pg.inner_text("section >> nth=0")
        for i, nombre in enumerate(["app_pruebas_v1", "app_simulador", "app_registro", "app_calculadora"]):
            pg.locator("section").nth(i).screenshot(path=OUT / f"{nombre}.png")
        pg.click("text=v1.1 · propuesta HU-13b"); pg.click("text=Ejecutar pruebas"); pg.wait_for_timeout(300)
        resumen_v11 = pg.locator("section").nth(0).inner_text()
        pg.locator("section").nth(0).screenshot(path=OUT / "app_08_pruebas_v11.png")
        b.close()
finally:
    srv.terminate()

print("Errores de consola:", errores or "ninguno")
print("--- Resultado ---"); print(texto_res[:400])
print("--- v1 ---"); print(resumen_v1[:300])
print("--- v1.1 ---"); print(resumen_v11[:200])
