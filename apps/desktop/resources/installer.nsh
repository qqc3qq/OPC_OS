!macro customInit
  ExecWait 'taskkill /F /IM "CEO OS.exe"' $0
!macroend

!macro customUnInstall
  ExecWait 'taskkill /F /IM "CEO OS.exe"' $0
!macroend
