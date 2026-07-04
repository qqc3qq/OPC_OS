Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$form = New-Object System.Windows.Forms.Form
$form.Text = "CEO OS Uninstaller"
$form.Size = New-Object System.Drawing.Size(500, 420)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false
$form.BackColor = [System.Drawing.Color]::FromArgb(0x09, 0x0b, 0x0d)
$form.ForeColor = [System.Drawing.Color]::White

# Icon section
$iconPanel = New-Object System.Windows.Forms.Panel
$iconPanel.Size = New-Object System.Drawing.Size(460, 80)
$iconPanel.Location = New-Object System.Drawing.Point(20, 20)
$iconPanel.BackColor = [System.Drawing.Color]::FromArgb(0x18, 0x18, 0x1b)

$iconBox = New-Object System.Windows.Forms.Panel
$iconBox.Size = New-Object System.Drawing.Size(48, 48)
$iconBox.Location = New-Object System.Drawing.Point(30, 16)
$iconBox.BackColor = [System.Drawing.Color]::FromArgb(0x3b, 0x82, 0xf6)

$title = New-Object System.Windows.Forms.Label
$title.Text = "CEO OS"
$title.Font = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)
$title.ForeColor = [System.Drawing.Color]::White
$title.Size = New-Object System.Drawing.Size(200, 30)
$title.Location = New-Object System.Drawing.Point(100, 16)

$subtitle = New-Object System.Windows.Forms.Label
$subtitle.Text = "Remove all application files and data"
$subtitle.Font = New-Object System.Drawing.Font("Segoe UI", 9)
$subtitle.ForeColor = [System.Drawing.Color]::FromArgb(0xa1, 0xa1, 0xaa)
$subtitle.Size = New-Object System.Drawing.Size(300, 20)
$subtitle.Location = New-Object System.Drawing.Point(100, 44)

$iconPanel.Controls.Add($iconBox)
$iconPanel.Controls.Add($title)
$iconPanel.Controls.Add($subtitle)

# Items list
$listPanel = New-Object System.Windows.Forms.Panel
$listPanel.Size = New-Object System.Drawing.Size(460, 150)
$listPanel.Location = New-Object System.Drawing.Point(20, 115)
$listPanel.BackColor = [System.Drawing.Color]::FromArgb(0x09, 0x0b, 0x0d)
$listPanel.BorderStyle = [System.Windows.Forms.BorderStyle]::FixedSingle

$items = @(
  @{label="Application Files"; path=""; color="#3b82f6"},
  @{label="User Settings & Data"; path=""; color="#10b981"},
  @{label="Local Database"; path=""; color="#f59e0b"}
)

$y = 10
$home = $env:USERPROFILE

$appPath = "$home\AppData\Local\Programs\CEO OS"
if (Test-Path $appPath) { $items[0].path = $appPath } else { $items[0].path = "Not found" }

$dataPath = "$home\AppData\Roaming\CEO OS"
if (Test-Path $dataPath) { $items[1].path = $dataPath } else { $items[1].path = "Not found" }

$dbPath = "$home\ceo-os.db"
if (Test-Path $dbPath) { $items[2].path = $dbPath } else { $items[2].path = "Not found" }

foreach ($item in $items) {
  $dot = New-Object System.Windows.Forms.Panel
  $dot.Size = New-Object System.Drawing.Size(8, 8)
  $dot.Location = New-Object System.Drawing.Point(20, $y + 8)
  $dot.BackColor = [System.Drawing.Color]::FromArgb(
    [Convert]::ToInt32($item.color.Substring(1, 2), 16),
    [Convert]::ToInt32($item.color.Substring(3, 2), 16),
    [Convert]::ToInt32($item.color.Substring(5, 2), 16)
  )

  $label = New-Object System.Windows.Forms.Label
  $label.Text = $item.label
  $label.Font = New-Object System.Drawing.Font("Segoe UI", 10)
  $label.ForeColor = [System.Drawing.Color]::White
  $label.Size = New-Object System.Drawing.Size(200, 20)
  $label.Location = New-Object System.Drawing.Point(40, $y + 2)

  $pathLabel = New-Object System.Windows.Forms.Label
  $pathLabel.Text = $item.path
  $pathLabel.Font = New-Object System.Drawing.Font("Segoe UI", 8)
  $pathLabel.ForeColor = [System.Drawing.Color]::FromArgb(0xa1, 0xa1, 0xaa)
  $pathLabel.Size = New-Object System.Drawing.Size(400, 16)
  $pathLabel.Location = New-Object System.Drawing.Point(40, $y + 22)

  $listPanel.Controls.Add($dot)
  $listPanel.Controls.Add($label)
  $listPanel.Controls.Add($pathLabel)
  $y += 48
}

# Progress bar
$progressBar = New-Object System.Windows.Forms.ProgressBar
$progressBar.Size = New-Object System.Drawing.Size(460, 6)
$progressBar.Location = New-Object System.Drawing.Point(20, 280)
$progressBar.Style = "Continuous"
$progressBar.ForeColor = [System.Drawing.Color]::FromArgb(0x3b, 0x82, 0xf6)
$progressBar.BackColor = [System.Drawing.Color]::FromArgb(0x27, 0x27, 0x2a)
$progressBar.Visible = $false

$progressText = New-Object System.Windows.Forms.Label
$progressText.Text = ""
$progressText.Font = New-Object System.Drawing.Font("Segoe UI", 8)
$progressText.ForeColor = [System.Drawing.Color]::FromArgb(0xa1, 0xa1, 0xaa)
$progressText.Size = New-Object System.Drawing.Size(460, 16)
$progressText.Location = New-Object System.Drawing.Point(20, 292)

# Buttons
$cancelBtn = New-Object System.Windows.Forms.Button
$cancelBtn.Text = "Cancel"
$cancelBtn.Size = New-Object System.Drawing.Size(225, 36)
$cancelBtn.Location = New-Object System.Drawing.Point(20, 320)
$cancelBtn.BackColor = [System.Drawing.Color]::FromArgb(0x27, 0x27, 0x2a)
$cancelBtn.ForeColor = [System.Drawing.Color]::FromArgb(0xa1, 0xa1, 0xaa)
$cancelBtn.FlatStyle = "Flat"
$cancelBtn.FlatAppearance.BorderSize = 0
$cancelBtn.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$cancelBtn.Add_Click({ $form.Close() })

$uninstallBtn = New-Object System.Windows.Forms.Button
$uninstallBtn.Text = "Uninstall"
$uninstallBtn.Size = New-Object System.Drawing.Size(225, 36)
$uninstallBtn.Location = New-Object System.Drawing.Point(255, 320)
$uninstallBtn.BackColor = [System.Drawing.Color]::FromArgb(0xef, 0x44, 0x44)
$uninstallBtn.ForeColor = [System.Drawing.Color]::White
$uninstallBtn.FlatStyle = "Flat"
$uninstallBtn.FlatAppearance.BorderSize = 0
$uninstallBtn.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$uninstallBtn.Add_Click({
  $cancelBtn.Enabled = $false
  $uninstallBtn.Enabled = $false
  $progressBar.Visible = $true
  $paths = @($appPath, $dataPath, $dbPath, "$home\AppData\Roaming\ceo-os")
  $total = ($paths | Where-Object { Test-Path $_ }).Count
  $i = 0
  foreach ($p in $paths) {
    if (Test-Path $p) {
      $progressText.Text = "Removing: $p"
      Remove-Item -Path $p -Recurse -Force -ErrorAction SilentlyContinue
      $i++
      $progressBar.Value = ($i / $total) * 100
      Start-Sleep -Milliseconds 400
    }
  }
  $progressBar.Value = 100
  $progressText.Text = "CEO OS has been uninstalled."
  Start-Sleep -Seconds 1
  $form.Close()
})

# Status
$statusLabel = New-Object System.Windows.Forms.Label
$statusLabel.Text = ""
$statusLabel.Font = New-Object System.Drawing.Font("Segoe UI", 9)
$statusLabel.Size = New-Object System.Drawing.Size(460, 20)
$statusLabel.Location = New-Object System.Drawing.Point(20, 365)
$statusLabel.TextAlign = "MiddleCenter"

$form.Controls.Add($iconPanel)
$form.Controls.Add($listPanel)
$form.Controls.Add($progressBar)
$form.Controls.Add($progressText)
$form.Controls.Add($cancelBtn)
$form.Controls.Add($uninstallBtn)
$form.Controls.Add($statusLabel)

[void] $form.ShowDialog()
