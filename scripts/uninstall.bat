@echo off
echo ======================================
echo   CEO OS Uninstaller
echo ======================================
echo.

:: Remove installed app
if exist "%LOCALAPPDATA%\Programs\CEO OS" (
    echo Removing app from %LOCALAPPDATA%\Programs\CEO OS...
    rmdir /S /Q "%LOCALAPPDATA%\Programs\CEO OS"
    echo Done.
) else if exist "C:\Program Files\CEO OS" (
    echo Removing app from C:\Program Files\CEO OS...
    rmdir /S /Q "C:\Program Files\CEO OS"
    echo Done.
) else (
    echo App installation not found in standard locations.
)

:: Remove app data
if exist "%APPDATA%\CEO OS" (
    echo Removing app data from %APPDATA%\CEO OS...
    rmdir /S /Q "%APPDATA%\CEO OS"
    echo Done.
)

:: Remove database
if exist "%APPDATA%\ceo-os" (
    echo Removing database from %APPDATA%\ceo-os...
    rmdir /S /Q "%APPDATA%\ceo-os"
    echo Done.
)

:: Remove from user data
if exist "%USERPROFILE%\AppData\Roaming\CEO OS" (
    echo Removing user data...
    rmdir /S /Q "%USERPROFILE%\AppData\Roaming\CEO OS"
    echo Done.
)

:: Clean any local db files
if exist "%USERPROFILE%\ceo-os.db" (
    del /Q "%USERPROFILE%\ceo-os.db"
    echo Removed database file.
)

echo.
echo Uninstall complete.
pause
