{
	printf "<tr>";
	if ( FNR == 1 ){
		for(i = 1; i < NF; ++i){
			printf("<th>%s</th>", $i);
		}
		columncount = NF;
	}
	else{
		printf("<td class=\"filename\" >%s</td><td>%s</td>", $1, $2);
		++total;
		for(i = 3; i < NF; ++i){
			if($i == ""){
				class = "notranslation";
			}
			else if($i == "error"){
				class = "error";
			}
			else if($2 > $i){
				class = "outdated";
				
			}
			else if($2 == $i){
				class = "uptodate";
			}
			else{
				class = "unknown";
			}
			++count[class, i];
			printf("<td class=\"%s\">%s</td>", class, $i);
		}
	}
	print "</tr>";
}
END{
	printf("<tr><td>total up-to-date/outdated/error/unknown</td><td>%s</td>", total);
	for(i = 3; i < columncount; ++i){
		printf("<td>%d/%d/%d/%d</td>", count["uptodate", i], count["outdated", i], count["error", i], count["unknown", i]);
	}
	print "</tr>";
}
