#!/bin/sh


echo '<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
   "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>translation status</title>
<link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
<table>
'

awk -F'\t' -f `dirname $0`/htmlize.awk

echo '</table>
</body>
</html>
'

