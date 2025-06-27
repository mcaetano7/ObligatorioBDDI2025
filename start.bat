@echo off
setlocal EnableDelayedExpansion

:: ===== 1. Pedir contraseña de MySQL root (oculto con PowerShell) =====
for /f "delims=" %%p in ('powershell -Command "$pword = Read-Host 'Ingrese la contraseña de MySQL (root)' -AsSecureString; [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pword))"') do set MYSQL_ROOT_PASSWORD=%%p

:: ===== 2. Verificar si existe la base de datos CafesMarloy =====
echo Verificando si la base de datos existe...
mysql -u root -p%MYSQL_ROOT_PASSWORD% -e "USE CafesMarloy;" 2>NUL

IF ERRORLEVEL 1 (
    echo Base de datos no encontrada. Ejecutando script.sql para crearla...
    mysql -u root -p%MYSQL_ROOT_PASSWORD% < backend\script.sql
) ELSE (
    echo La base de datos CafesMarloy ya existe.
    :: Verificar si la tabla 'roles' tiene registros
    for /f %%A in ('mysql -u root -p%MYSQL_ROOT_PASSWORD% -D CafesMarloy -N -e "SELECT COUNT(*) FROM roles;"') do (
        set COUNT=%%A
    )

    setlocal enabledelayedexpansion
    if "!COUNT!"=="0" (
        echo La base de datos está vacía. Ejecutando inserts.sql...
        mysql -u root -p%MYSQL_ROOT_PASSWORD% CafesMarloy < backend\inserts.sql
    ) else (
        echo La base de datos ya contiene datos.
    )
    endlocal
)

:: ===== 3. Actualizar archivo .env con la contraseña =====
echo MYSQL_ROOT_PASSWORD=%MYSQL_ROOT_PASSWORD% > backend\.env
echo Archivo .env actualizado en backend\

:: ===== 4. Iniciar backend =====
cd backend

IF NOT EXIST "venv" (
    echo Creando entorno virtual...
    python -m venv venv
)

call venv\Scripts\activate

IF NOT EXIST ".venv_installed" (
    echo Instalando dependencias del backend...
    pip install -r requirements.txt
    echo > .venv_installed
)

:: === 4.1 Verificar que dotenv esté instalado ===  esto es medio al pedo porque ya esta en requeriments.txt pero bue, si funciona no se toca
pip show python-dotenv >nul 2>&1
IF ERRORLEVEL 1 (
    echo Instalando python-dotenv...
    pip install python-dotenv
)

:: === 4.2 Ejecutar el backend ===
echo Iniciando servidor Flask...
start cmd /k "call venv\Scripts\activate && python app.py"
cd ..

:: ===== 5. Iniciar frontend =====
cd frontend

IF NOT EXIST "node_modules" (
    echo Instalando dependencias del frontend...
    npm install
)

echo Iniciando frontend...
start cmd /k "npm run dev"

endlocal
pause
