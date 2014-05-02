#!/bin/sh

english(){
	local rev=`egrep "^<\!-- .LastChangedRevision: [0-9]+ . -->" $1 | awk '{printf $3;}'`
	if [ -n "$rev" ];then
		echo -n $rev
	else
		echo -n "error"
	fi
}

otherlang(){
	if [ -f $1 ];then
		#正規表現はmetafile.plから取った
		local rev=`perl -e 'while(<>){ $rev = $1, last if /<!--\s*English\s+Revision\s*:\s*([^\s:]+)(?::(\S+)\s+\(outdated\))?\s+-->/xi;}; print $rev;' < $1`

		if [ -n "$rev" ];then
			echo -n $rev
		else
			echo -n "error"
		fi 
	fi
}

is_manualpage(){
	test `grep "common.dtd" $1 | wc -l` -gt 0 || 
	test `grep "faq.dtd" $1 | wc -l` -gt 0 || 
	test `grep "lang.dtd" $1 | wc -l` -gt 0 || 
	test `grep "manualpage.dtd" $1 | wc -l` -gt 0 || 
	test `grep "modulesynopsis.dtd" $1 | wc -l` -gt 0 || 
	test `grep "sitemap.dtd" $1 | wc -l` -gt 0
}

find_xml(){
	find $1 -type d -mindepth 1 -maxdepth 1 | sort | while read line; do
		find_xml $line
	done
	find $1 -type f -mindepth 1 -maxdepth 1 -name "*.xml" |  while read line; do
		is_manualpage $line && echo $line
	done | sort
}

#1個目の引数で、マニュアルディレクトリを指定する。
#引数無しの場合、カレントディレクトリとする。
dir="."
if [ $# -ge 1 ];then
	dir=$1
fi


langs=`ls ${dir}/style/lang | egrep -v "^en.xml$" | awk -F . '{printf $1 " ";}'`

#1行目 言語一覧
#2行目以降
# error: ファイルは存在するが、リビジョン不明
# 値無し: ファイルが存在しない

echo -n "	"
echo -n "en"
for lang in $langs; do
	echo -n "	"
	echo -n $lang
done
echo

find_xml $dir | while read file;  do
	echo -n $file
	echo -n "	"
	english $file
	for lang in $langs; do
		echo -n "	"
		otherlang ${file}.$lang
	done
	echo
done