@echo off
echo ==========================================
echo    DESPLIEGUE AUTOMATICO A VERCEL
echo ==========================================
echo.
echo 1. Si es la primera vez, te pedira que te loguees (pon tu email).
echo 2. Acepta todo con 'Y' (Yes) o Enter para las opciones por defecto.
echo 3. IMPORTANTE: Cuando termine, te dara una URL (link) de tu web.
echo.
echo Iniciando proceso...
echo.

call npx vercel --prod

echo.
echo ==========================================
echo    PROCESO TERMINADO
echo ==========================================
pause
