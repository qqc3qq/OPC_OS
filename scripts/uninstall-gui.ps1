Add-Type -AssemblyName System.Windows.Forms, System.Drawing

# Kill running process first
try { Get-Process "CEO OS" -ErrorAction Stop | Stop-Process -Force } catch {}
Start-Sleep -Seconds 1

$home = $env:USERPROFILE

# 1. Find install path from registry (NSIS stores it here)
$installPaths = @()
$regPaths = @(
  "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*",
  "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*",
  "HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*"
)
foreach ($rp in $regPaths) {
  try {
    $entries = Get-ItemProperty $rp -ErrorAction SilentlyContinue
    foreach ($e in $entries) {
      if ($e.DisplayName -eq "CEO OS" -and $e.InstallLocation) {
        $installPaths += $e.InstallLocation.TrimEnd('\')
      }
    }
  } catch {}
}
# Also add known paths
$installPaths += "$home\AppData\Local\Programs\CEO OS"
$installPaths += "D:\CEO OS"
$installPaths += "D:\OPC_OS"
$installPaths += "C:\Program Files\CEO OS"
$installPaths = ($installPaths | Select-Object -Unique | Where-Object { $_ -and (Test-Path $_) })

# 2. Data paths
$dataPaths = @(
  "$home\AppData\Roaming\CEO OS",
  "$home\AppData\Roaming\@ceo-os",
  "$home\AppData\Roaming\@ceo-os\desktop",
  "$home\ceo-os.db"
)
$dataPaths = ($dataPaths | Select-Object -Unique | Where-Object { $_ -and (Test-Path $_) })

# 3. Temp logs
$tempPaths = @("$env:TEMP\ceo-os-logs")
$tempPaths = ($tempPaths | Where-Object { $_ -and (Test-Path $_) })

# Combine
$allPaths = @($installPaths + $dataPaths + $tempPaths)

if ($allPaths.Count -eq 0) {
  [System.Windows.Forms.MessageBox]::Show("No CEO OS installation found.", "CEO OS Uninstaller", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
  exit
}

# GUI
$f = New-Object System.Windows.Forms.Form
$f.Text = "CEO OS Uninstaller"; $f.Size = New-Object System.Drawing.Size(540, 500)
$f.StartPosition = "CenterScreen"; $f.FormBorderStyle = "FixedDialog"; $f.MaximizeBox = $false
$f.BackColor = [System.Drawing.Color]::FromArgb(0x0f, 0x0f, 0x11); $f.ForeColor = [System.Drawing.Color]::White

$head = New-Object System.Windows.Forms.Panel; $head.Size = New-Object System.Drawing.Size(500, 70); $head.Location = New-Object System.Drawing.Point(18, 15)
$head.BackColor = [System.Drawing.Color]::FromArgb(0x1a, 0x1a, 0x1d)
$tl = New-Object System.Windows.Forms.Label; $tl.Text = "CEO OS Uninstaller"; $tl.Font = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)
$tl.ForeColor = [System.Drawing.Color]::White; $tl.Size = New-Object System.Drawing.Size(460, 28); $tl.Location = New-Object System.Drawing.Point(20, 10)
$sl = New-Object System.Windows.Forms.Label; $sl.Text = "$($allPaths.Count) location(s) found — all files and data will be removed."
$sl.Font = New-Object System.Drawing.Font("Segoe UI", 9); $sl.ForeColor = [System.Drawing.Color]::FromArgb(0x8b, 0x8b, 0x95)
$sl.Size = New-Object System.Drawing.Size(460, 20); $sl.Location = New-Object System.Drawing.Point(20, 38)
$head.Controls.Add($tl); $head.Controls.Add($sl)

$list = New-Object System.Windows.Forms.ListBox; $list.Size = New-Object System.Drawing.Size(500, 220); $list.Location = New-Object System.Drawing.Point(18, 95)
$list.BackColor = [System.Drawing.Color]::FromArgb(0x0c, 0x0c, 0x0e); $list.ForeColor = [System.Drawing.Color]::FromArgb(0xa0, 0xa0, 0xaa)
$list.BorderStyle = "None"; $list.Font = New-Object System.Drawing.Font("Consolas", 9)
foreach ($p in $allPaths) {
  $cat = if ($p -match "AppData") { "DATA " } elseif ($p -match "Temp") { "TEMP " } else { "APP  " }
  $list.Items.Add("  [$cat] $p")
}

$pb = New-Object System.Windows.Forms.ProgressBar; $pb.Size = New-Object System.Drawing.Size(500, 4); $pb.Location = New-Object System.Drawing.Point(18, 330)
$pb.Style = "Continuous"; $pb.ForeColor = [System.Drawing.Color]::FromArgb(0x3b, 0x82, 0xf6); $pb.Visible = $false
$pl = New-Object System.Windows.Forms.Label; $pl.Size = New-Object System.Drawing.Size(500, 16); $pl.Location = New-Object System.Drawing.Point(18, 340)
$pl.Font = New-Object System.Drawing.Font("Segoe UI", 8); $pl.ForeColor = [System.Drawing.Color]::FromArgb(0x8b, 0x8b, 0x95)

$st = New-Object System.Windows.Forms.Label; $st.Text = "Click Uninstall to begin."
$st.Size = New-Object System.Drawing.Size(500, 20); $st.Location = New-Object System.Drawing.Point(18, 360)
$st.Font = New-Object System.Drawing.Font("Segoe UI", 9); $st.ForeColor = [System.Drawing.Color]::FromArgb(0x8b, 0x8b, 0x95); $st.TextAlign = [System.Drawing.ContentAlignment]::MiddleCenter

$cb = New-Object System.Windows.Forms.Button; $cb.Text = "Cancel"; $cb.Size = New-Object System.Drawing.Size(245, 38); $cb.Location = New-Object System.Drawing.Point(18, 395)
$cb.BackColor = [System.Drawing.Color]::FromArgb(0x25, 0x25, 0x28); $cb.ForeColor = [System.Drawing.Color]::FromArgb(0x8b, 0x8b, 0x95); $cb.FlatStyle = "Flat"; $cb.FlatAppearance.BorderSize = 0; $cb.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$cb.Add_Click({ $f.Close() })

$ub = New-Object System.Windows.Forms.Button; $ub.Text = "Uninstall"; $ub.Size = New-Object System.Drawing.Size(245, 38); $ub.Location = New-Object System.Drawing.Point(273, 395)
$ub.BackColor = [System.Drawing.Color]::FromArgb(0xdc, 0x26, 0x26); $ub.ForeColor = [System.Drawing.Color]::White; $ub.FlatStyle = "Flat"; $ub.FlatAppearance.BorderSize = 0; $ub.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$ub.Add_Click({
  $cb.Enabled = $false; $ub.Enabled = $false; $pb.Visible = $true
  $total = $allPaths.Count; $done = 0
  foreach ($p in $allPaths) {
    $pl.Text = "Removing: $p"
    $pb.Value = [Math]::Floor(($done / $total) * 100)
    try { Remove-Item -Path $p -Recurse -Force -ErrorAction Stop } catch { $pl.Text = "Skipping: $p (in use)" }
    $done++; Start-Sleep -Milliseconds 200
  }
  # Remove registry entries
  foreach ($rp in $regPaths) {
    try {
      $entries = Get-ItemProperty $rp -ErrorAction SilentlyContinue
      foreach ($e in $entries) {
        if ($e.PSChildName -and $e.DisplayName -eq "CEO OS") {
          Remove-Item -Path "$($rp.TrimEnd('*'))$($e.PSChildName)" -Force -ErrorAction SilentlyContinue
        }
      }
    } catch {}
  }
  $pb.Value = 100; $pl.Text = ""; $st.Text = "CEO OS has been completely uninstalled."
  $st.ForeColor = [System.Drawing.Color]::FromArgb(0x10, 0xb9, 0x81)
  $ok = New-Object System.Windows.Forms.Button; $ok.Text = "Done"; $ok.Size = New-Object System.Drawing.Size(500, 38); $ok.Location = New-Object System.Drawing.Point(18, 395)
  $ok.BackColor = [System.Drawing.Color]::FromArgb(0x3b, 0x82, 0xf6); $ok.ForeColor = [System.Drawing.Color]::White; $ok.FlatStyle = "Flat"; $ok.FlatAppearance.BorderSize = 0; $ok.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold); $ok.Add_Click({ $f.Close() })
  $cb.Visible = $false; $ub.Visible = $false; $f.Controls.Add($ok)
})

$f.Controls.Add($head); $f.Controls.Add($list); $f.Controls.Add($pb); $f.Controls.Add($pl); $f.Controls.Add($st); $f.Controls.Add($cb); $f.Controls.Add($ub)
[void] $f.ShowDialog()
