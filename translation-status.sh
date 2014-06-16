#!/bin/sh
#   Copyright 2014 Takashi Sato
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.

english(){
	local rev=`egrep "^<\!-- .LastChangedRevision: [0-9]+ . -->" $1 | awk '{printf $3;}'`
	if [ -n "$rev" ];then
		echo -n $rev
	else
		echo -n "\"error\""
	fi
}

otherlang(){
	if [ -f $1 ];then
		#正規表現はmetafile.plから取った
		local rev=`perl -e 'while(<>){ $rev = $1, last if /<!--\s*English\s+Revision\s*:\s*(\d+)(?::(\S+)\s+\(outdated\))?\s+-->/xi;}; print $rev;' < $1`

		if [ -n "$rev" ];then
			echo -n $rev
		else
			echo -n "\"error\""
		fi 
	fi
}

is_manualpage(){
	test `grep "common.dtd" $1 | wc -l` -gt 0 || 
	test `grep "faq.dtd" $1 | wc -l` -gt 0 || 
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
if [ $# -ge 1 ];then
	cd "$1" || exit 1
fi


langs=`ls style/lang | egrep -v "^en.xml$" | awk -F . '{printf $1 " ";}'`

#1行目 言語一覧
#2行目以降
# error: ファイルは存在するが、リビジョン不明
# 値無し: ファイルが存在しない


echo -n "{\"langs\":["
first=1
for lang in $langs; do
	if [ $first -eq 1 ];then
		first=0
	else
		echo -n ","
	fi
	echo -n "\"$lang\""
done
echo "],"
echo "\"files\":{"


(
	cd style/lang && (
		echo -n "\"style/lang/\":{"
		echo -n "\"rev\":"
		english en.xml
		echo -n ",\"translations\":{"
		first=1
		for lang in $langs; do
			foo=$(otherlang "${lang}.xml")
			if [ $first -eq 1 ];then
				first=0
			else
				echo -n ","
			fi
			if [ "$foo" != "" ];then
				echo -n "\"${lang}\":${foo}"
			fi
		done
		echo -n "}}"
	)
)

find_xml . | while read file;  do
	echo ","
	echo -n "\"${file#./}\":{"
	echo -n "\"rev\":"
	english $file
	echo -n ",\"translations\":{"
	first=1
	for lang in $langs; do
		foo=$(otherlang ${file}.$lang)
		if [ "$foo" != "" ];then
			if [ $first -eq 1 ];then
				first=0
			else
				echo -n ","
			fi
			echo -n "\"${lang}\":${foo}"
		fi
	done
	echo -n "}}"
done
echo ""
echo "}}"
