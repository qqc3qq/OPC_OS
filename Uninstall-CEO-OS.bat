@echo off
powershell -ExecutionPolicy Bypass -Command "
Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName System.Drawing;
\$f=New-Object System.Windows.Forms.Form;\$f.Text='CEO OS Uninstaller';\$f.Size=New-Object System.Drawing.Size(500,420);\$f.StartPosition='CenterScreen';\$f.FormBorderStyle='FixedDialog';\$f.MaximizeBox=\$false;\$f.BackColor=[System.Drawing.Color]::FromArgb(0x09,0x0b,0x0d);\$f.ForeColor=[System.Drawing.Color]::White;
\$p=New-Object System.Windows.Forms.Panel;\$p.Size=New-Object System.Drawing.Size(460,80);\$p.Location=New-Object System.Drawing.Point(20,20);\$p.BackColor=[System.Drawing.Color]::FromArgb(0x18,0x18,0x1b);
\$b=New-Object System.Windows.Forms.Panel;\$b.Size=New-Object System.Drawing.Size(48,48);\$b.Location=New-Object System.Drawing.Point(30,16);\$b.BackColor=[System.Drawing.Color]::FromArgb(0x3b,0x82,0xf6);
\$t=New-Object System.Windows.Forms.Label;\$t.Text='CEO OS';\$t.Font=New-Object System.Drawing.Font('Segoe UI',14,[System.Drawing.FontStyle]::Bold);\$t.ForeColor=[System.Drawing.Color]::White;\$t.Size=New-Object System.Drawing.Size(200,30);\$t.Location=New-Object System.Drawing.Point(100,16);
\$s=New-Object System.Windows.Forms.Label;\$s.Text='Remove all application files and data';\$s.Font=New-Object System.Drawing.Font('Segoe UI',9);\$s.ForeColor=[System.Drawing.Color]::FromArgb(0xa1,0xa1,0xaa);\$s.Size=New-Object System.Drawing.Size(300,20);\$s.Location=New-Object System.Drawing.Point(100,44);\$p.Controls.Add(\$b);\$p.Controls.Add(\$t);\$p.Controls.Add(\$s);
\$lp=New-Object System.Windows.Forms.Panel;\$lp.Size=New-Object System.Drawing.Size(460,150);\$lp.Location=New-Object System.Drawing.Point(20,115);\$lp.BackColor=[System.Drawing.Color]::FromArgb(0x09,0x0b,0x0d);\$lp.BorderStyle=[System.Windows.Forms.BorderStyle]::FixedSingle;
\$home=\$env:USERPROFILE;\$appPath=\"\$home\AppData\Local\Programs\CEO OS\";\$dataPath=\"\$home\AppData\Roaming\CEO OS\";\$dbPath=\"\$home\ceo-os.db\";
\$items=@(@{L='Application Files';P=\$appPath;C='#3b82f6'},@{L='User Settings & Data';P=\$dataPath;C='#10b981'},@{L='Local Database';P=\$dbPath;C='#f59e0b'});
\$y=10;foreach(\$i in \$items){\$d=New-Object System.Windows.Forms.Panel;\$d.Size=New-Object System.Drawing.Size(8,8);\$d.Location=New-Object System.Drawing.Point(20,\$y+8);\$d.BackColor=[System.Drawing.Color]::FromArgb([Convert]::ToInt32(\$i.C.Substring(1,2),16),[Convert]::ToInt32(\$i.C.Substring(3,2),16),[Convert]::ToInt32(\$i.C.Substring(5,2),16));
\$l1=New-Object System.Windows.Forms.Label;\$l1.Text=\$i.L;\$l1.Font=New-Object System.Drawing.Font('Segoe UI',10);\$l1.ForeColor=[System.Drawing.Color]::White;\$l1.Size=New-Object System.Drawing.Size(200,20);\$l1.Location=New-Object System.Drawing.Point(40,\$y+2);
\$l2=New-Object System.Windows.Forms.Label;\$l2.Text=(if(Test-Path \$i.P){\$i.P}else{'Not found'});\$l2.Font=New-Object System.Drawing.Font('Segoe UI',8);\$l2.ForeColor=[System.Drawing.Color]::FromArgb(0xa1,0xa1,0xaa);\$l2.Size=New-Object System.Drawing.Size(400,16);\$l2.Location=New-Object System.Drawing.Point(40,\$y+22);
\$lp.Controls.Add(\$d);\$lp.Controls.Add(\$l1);\$lp.Controls.Add(\$l2);\$y+=48};
\$pb=New-Object System.Windows.Forms.ProgressBar;\$pb.Size=New-Object System.Drawing.Size(460,6);\$pb.Location=New-Object System.Drawing.Point(20,280);\$pb.Style='Continuous';\$pb.ForeColor=[System.Drawing.Color]::FromArgb(0x3b,0x82,0xf6);\$pb.BackColor=[System.Drawing.Color]::FromArgb(0x27,0x27,0x2a);\$pb.Visible=\$false;
\$pt=New-Object System.Windows.Forms.Label;\$pt.Text='';\$pt.Font=New-Object System.Drawing.Font('Segoe UI',8);\$pt.ForeColor=[System.Drawing.Color]::FromArgb(0xa1,0xa1,0xaa);\$pt.Size=New-Object System.Drawing.Size(460,16);\$pt.Location=New-Object System.Drawing.Point(20,292);
\$cb=New-Object System.Windows.Forms.Button;\$cb.Text='Cancel';\$cb.Size=New-Object System.Drawing.Size(225,36);\$cb.Location=New-Object System.Drawing.Point(20,320);\$cb.BackColor=[System.Drawing.Color]::FromArgb(0x27,0x27,0x2a);\$cb.ForeColor=[System.Drawing.Color]::FromArgb(0xa1,0xa1,0xaa);\$cb.FlatStyle='Flat';\$cb.FlatAppearance.BorderSize=0;\$cb.Font=New-Object System.Drawing.Font('Segoe UI',10);\$cb.Add_Click({\$f.Close()});
\$ub=New-Object System.Windows.Forms.Button;\$ub.Text='Uninstall';\$ub.Size=New-Object System.Drawing.Size(225,36);\$ub.Location=New-Object System.Drawing.Point(255,320);\$ub.BackColor=[System.Drawing.Color]::FromArgb(0xef,0x44,0x44);\$ub.ForeColor=[System.Drawing.Color]::White;\$ub.FlatStyle='Flat';\$ub.FlatAppearance.BorderSize=0;\$ub.Font=New-Object System.Drawing.Font('Segoe UI',10,[System.Drawing.FontStyle]::Bold);
\$ub.Add_Click({
  \$cb.Enabled=\$false;\$ub.Enabled=\$false;\$pb.Visible=\$true;
  \$pts=@(\$appPath,\$dataPath,\$dbPath,\"\$home\AppData\Roaming\ceo-os\");
  \$tt=(\$pts|Where-Object{Test-Path \$_}).Count;\$j=0;
  foreach(\$x in \$pts){if(Test-Path \$x){\$pt.Text=\"Removing: \$x\";Remove-Item -Path \$x -Recurse -Force -ErrorAction SilentlyContinue;\$j++;\$pb.Value=(\$j/\$tt)*100;Start-Sleep -Milliseconds 400}};
  \$pb.Value=100;\$pt.Text='CEO OS has been uninstalled.';Start-Sleep -Seconds 1;\$f.Close()
});
\$sl=New-Object System.Windows.Forms.Label;\$sl.Text='';\$sl.Font=New-Object System.Drawing.Font('Segoe UI',9);\$sl.Size=New-Object System.Drawing.Size(460,20);\$sl.Location=New-Object System.Drawing.Point(20,365);\$sl.TextAlign='MiddleCenter';
\$f.Controls.Add(\$p);\$f.Controls.Add(\$lp);\$f.Controls.Add(\$pb);\$f.Controls.Add(\$pt);\$f.Controls.Add(\$cb);\$f.Controls.Add(\$ub);\$f.Controls.Add(\$sl);
[void]\$f.ShowDialog()
"
