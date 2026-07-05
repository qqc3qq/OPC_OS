Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$home = $env:USERPROFILE
$appPath = "$home\AppData\Local\Programs\CEO OS"
$dataPath = "$home\AppData\Roaming\CEO OS"
$legacyData = "$home\AppData\Roaming\@ceo-os"
$dbFile = "$home\ceo-os.db"

# Also scan registry for custom install location
$regPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*"
$customInstall = Get-ItemProperty $regPath 2>$null | Where-Object { $_.DisplayName -eq "CEO OS" } | Select-Object -First 1
$regInstallPath = if ($customInstall) { $customInstall.InstallLocation } else { $null }

# Collect all possible paths
$allPaths = @()
$allPaths += $appPath
$allPaths += $dataPath
$allPaths += $legacyData
$allPaths += $dbFile
if ($regInstallPath -and (Test-Path $regInstallPath)) {
  $allPaths += $regInstallPath
}
# Also check D drive and desktop
$allPaths += "D:\CEO_OS"
$allPaths += "D:\OPC_OS"
$allPaths += "C:\Program Files\CEO OS"
$allPaths += "$home\Desktop\CEO_OS\apps\desktop\dist"
# Remove duplicates
$allPaths = $allPaths | Select-Object -Unique
# Only keep existing paths
$allPaths = $allPaths | Where-Object { $_ -and (Test-Path $_) }

$form = New-Object System.Windows.Forms.Form
$form.Text = "CEO OS Uninstaller"
$form.Size = New-Object System.Drawing.Size(520, 580)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false
$form.BackColor = [System.Drawing.Color]::FromArgb(0x09, 0x0b, 0x0d)
$form.ForeColor = [System.Drawing.Color]::White
$form.Icon = $null

# Header
$header = New-Object System.Windows.Forms.Panel
$header.Size = New-Object System.Drawing.Size(480, 80)
$header.Location = New-Object System.Drawing.Point(20, 20)
$header.BackColor = [System.Drawing.Color]::FromArgb(0x18, 0x18, 0x1b)

$icon = New-Object System.Windows.Forms.Label
$icon.Text = "CEO"
$icon.Font = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$icon.ForeColor = [System.Drawing.Color]::FromArgb(0x3b, 0x82, 0xf6)
$icon.Size = New-Object System.Drawing.Size(60, 30)
$icon.Location = New-Object System.Drawing.Point(24, 16)

$title = New-Object System.Windows.Forms.Label
$title.Text = "CEO OS"
$title.Font = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$title.ForeColor = [System.Drawing.Color]::White
$title.Size = New-Object System.Drawing.Size(200, 30)
$title.Location = New-Object System.Drawing.Point(80, 14)

$sub = New-Object System.Windows.Forms.Label
$sub.Text = "Remove CEO OS and all local data from your computer."
$sub.Font = New-Object System.Drawing.Font("Segoe UI", 9)
$sub.ForeColor = [System.Drawing.Color]::FromArgb(0xa1, 0xa1, 0xaa)
$sub.Size = New-Object System.Drawing.Size(380, 20)
$sub.Location = New-Object System.Drawing.Point(80, 44)

$header.Controls.Add($icon)
$header.Controls.Add($title)
$header.Controls.Add($sub)

# File list
$listBox = New-Object System.Windows.Forms.Panel
$listBox.Size = New-Object System.Drawing.Size(480, 160)
$listBox.Location = New-Object System.Drawing.Point(20, 115)
$listBox.BackColor = [System.Drawing.Color]::FromArgb(0x09, 0x0b, 0x0d)
$listBox.BorderStyle = [System.Windows.Forms.BorderStyle]::FixedSingle

$y = 12
$colors = @("#3b82f6","#10b981","#8b5cf6","#f59e0b","#ec4899","#f97316","#06b6d4")
$ci = 0

foreach ($p in $allPaths) {
    $exists = $true
    $label = if ($p -match "AppData") { "User Data" }
             elseif ($p -match "Program Files|:\\") { "Installation" }
             elseif ($p -match "ceo-os\.db") { "Database" }
             else { "Files" }

    $dot = New-Object System.Windows.Forms.Panel
    $dot.Size = New-Object System.Drawing.Size(8, 8)
    $dot.Location = New-Object System.Drawing.Point(20, $y + 6)
    $c = $colors[$ci % $colors.Length]
    $dot.BackColor = [System.Drawing.Color]::FromArgb(
        [Convert]::ToInt32($c.Substring(1,2), 16),
        [Convert]::ToInt32($c.Substring(3,2), 16),
        [Convert]::ToInt32($c.Substring(5,2), 16))

    $l1 = New-Object System.Windows.Forms.Label
    $l1.Text = $label
    $l1.Font = New-Object System.Drawing.Font("Segoe UI", 10)
    $l1.ForeColor = [System.Drawing.Color]::White
    $l1.Size = New-Object System.Drawing.Size(120, 20)
    $l1.Location = New-Object System.Drawing.Point(40, $y)

    $l2 = New-Object System.Windows.Forms.Label
    $l2.Text = $p
    $l2.Font = New-Object System.Drawing.Font("Segoe UI", 8)
    $l2.ForeColor = [System.Drawing.Color]::FromArgb(0x71, 0x71, 0x7a)
    $l2.Size = New-Object System.Drawing.Size(420, 16)
    $l2.Location = New-Object System.Drawing.Point(40, $y + 20)

    $listBox.Controls.Add($dot)
    $listBox.Controls.Add($l1)
    $listBox.Controls.Add($l2)
    $y += 42
    $ci++
}

# Progress
$progress = New-Object System.Windows.Forms.ProgressBar
$progress.Size = New-Object System.Drawing.Size(480, 6)
$progress.Location = New-Object System.Drawing.Point(20, 290)
$progress.Style = "Continuous"
$progress.ForeColor = [System.Drawing.Color]::FromArgb(0x3b, 0x82, 0xf6)
$progress.BackColor = [System.Drawing.Color]::FromArgb(0x27, 0x27, 0x2a)
$progress.Visible = $false

$progressLabel = New-Object System.Windows.Forms.Label
$progressLabel.Text = ""
$progressLabel.Font = New-Object System.Drawing.Font("Segoe UI", 8)
$progressLabel.ForeColor = [System.Drawing.Color]::FromArgb(0xa1, 0xa1, 0xaa)
$progressLabel.Size = New-Object System.Drawing.Size(480, 16)
$progressLabel.Location = New-Object System.Drawing.Point(20, 302)

# Status
$statusLabel = New-Object System.Windows.Forms.Label
$statusLabel.Text = if ($allPaths.Count -gt 0) { "$($allPaths.Count) item(s) will be removed" } else { "Nothing to remove" }
$statusLabel.Font = New-Object System.Drawing.Font("Segoe UI", 9)
$statusLabel.ForeColor = [System.Drawing.Color]::FromArgb(0xa1, 0xa1, 0xaa)
$statusLabel.Size = New-Object System.Drawing.Size(480, 20)
$statusLabel.Location = New-Object System.Drawing.Point(20, 325)
$statusLabel.TextAlign = [System.Drawing.ContentAlignment]::MiddleCenter

# Buttons
$cancelBtn = New-Object System.Windows.Forms.Button
$cancelBtn.Text = "Cancel"
$cancelBtn.Size = New-Object System.Drawing.Size(235, 40)
$cancelBtn.Location = New-Object System.Drawing.Point(20, 365)
$cancelBtn.BackColor = [System.Drawing.Color]::FromArgb(0x27, 0x27, 0x2a)
$cancelBtn.ForeColor = [System.Drawing.Color]::FromArgb(0xa1, 0xa1, 0xaa)
$cancelBtn.FlatStyle = "Flat"
$cancelBtn.FlatAppearance.BorderSize = 0
$cancelBtn.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$cancelBtn.Cursor = [System.Windows.Forms.Cursors]::Hand
$cancelBtn.Add_Click({ $form.Close() })

$uninstallBtn = New-Object System.Windows.Forms.Button
$uninstallBtn.Text = "Uninstall"
$uninstallBtn.Size = New-Object System.Drawing.Size(235, 40)
$uninstallBtn.Location = New-Object System.Drawing.Point(265, 365)
$uninstallBtn.BackColor = [System.Drawing.Color]::FromArgb(0xef, 0x44, 0x44)
$uninstallBtn.ForeColor = [System.Drawing.Color]::White
$uninstallBtn.FlatStyle = "Flat"
$uninstallBtn.FlatAppearance.BorderSize = 0
$uninstallBtn.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$uninstallBtn.Cursor = [System.Windows.Forms.Cursors]::Hand
$uninstallBtn.Enabled = ($allPaths.Count -gt 0)

$uninstallBtn.Add_Click({
    $cancelBtn.Enabled = $false
    $uninstallBtn.Enabled = $false
    $uninstallBtn.Text = "Uninstalling..."
    $progress.Visible = $true

    $total = $allPaths.Count
    $i = 0
    foreach ($p in $allPaths) {
        $progressLabel.Text = "Removing: $p"
        $progress.Value = [Math]::Floor(($i / $total) * 100)
        Remove-Item -Path $p -Recurse -Force -ErrorAction SilentlyContinue
        $i++
        Start-Sleep -Milliseconds 300
    }

    $progress.Value = 100
    $progressLabel.Text = ""
    $statusLabel.Text = "CEO OS has been uninstalled successfully."
    $statusLabel.ForeColor = [System.Drawing.Color]::FromArgb(0x10, 0xb9, 0x81)

    $okBtn = New-Object System.Windows.Forms.Button
    $okBtn.Text = "Close"
    $okBtn.Size = New-Object System.Drawing.Size(480, 40)
    $okBtn.Location = New-Object System.Drawing.Point(20, 365)
    $okBtn.BackColor = [System.Drawing.Color]::FromArgb(0x3b, 0x82, 0xf6)
    $okBtn.ForeColor = [System.Drawing.Color]::White
    $okBtn.FlatStyle = "Flat"
    $okBtn.FlatAppearance.BorderSize = 0
    $okBtn.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
    $okBtn.Cursor = [System.Windows.Forms.Cursors]::Hand
    $okBtn.Add_Click({ $form.Close() })
    $cancelBtn.Visible = $false
    $uninstallBtn.Visible = $false
    $form.Controls.Add($okBtn)
})

# Close button hover effects
$cancelBtn.Add_MouseEnter({
    $cancelBtn.BackColor = [System.Drawing.Color]::FromArgb(0x3f, 0x3f, 0x46)
    $cancelBtn.ForeColor = [System.Drawing.Color]::White
})
$cancelBtn.Add_MouseLeave({
    $cancelBtn.BackColor = [System.Drawing.Color]::FromArgb(0x27, 0x27, 0x2a)
    $cancelBtn.ForeColor = [System.Drawing.Color]::FromArgb(0xa1, 0xa1, 0xaa)
})
$uninstallBtn.Add_MouseEnter({ $uninstallBtn.BackColor = [System.Drawing.Color]::FromArgb(0xdc, 0x26, 0x26) })
$uninstallBtn.Add_MouseLeave({ $uninstallBtn.BackColor = [System.Drawing.Color]::FromArgb(0xef, 0x44, 0x44) })

$form.Controls.Add($header)
$form.Controls.Add($listBox)
$form.Controls.Add($progress)
$form.Controls.Add($progressLabel)
$form.Controls.Add($statusLabel)
$form.Controls.Add($cancelBtn)
$form.Controls.Add($uninstallBtn)

[void] $form.ShowDialog()
