!macro customInit
  ; Silently kill any running instances before install
  nsExec::ExecToLog 'taskkill /F /IM "CEO OS.exe"'
  Sleep 1000
!macroend

!macro customUnInstall
  ; Silently kill any running instances before uninstall
  nsExec::ExecToLog 'taskkill /F /IM "CEO OS.exe"'
  Sleep 1000
!macroend
