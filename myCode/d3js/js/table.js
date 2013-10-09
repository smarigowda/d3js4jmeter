var tablegen = (function (results_passed) {
   
   // this creates a closure
   var results = results_passed;
   
   return {
       
        showResults: function() { console.log(results)},

        setResults: function(results_passed) { results = results_passed },

        genTable: function genTable() { 
        
                d3.csv(["./data/", results[0].folder_name, "/", results[0].file_name, "/"].join(''), function(data) { 
                
                    d3.select('body').append('p').text(results[0].file_name);
                    var table = d3.select("body").append("table")
                    
                    // data_2 = data;
                    
                    // header
                    table.append("thead").append("tr")
                            .selectAll("td")
                            .data(_.keys(data[0]))
                            .enter()
                            .append("td")
                            .text(function(d) { return d } )
                            //.attr("bgcolor", "#F8F8F8");
                            //.attr({"bgcolor": "#F8F8F8"});
                    
                    // data rows
                    table.append("tbody")
                            .selectAll("tr")
                                .data(data)
                                .enter()
                                .append("tr")
                                // .attr("bgcolor", function(d) {
                                //         console.log(d.sampler_label); 
                                //         return d.sampler_label === "TOTAL"? "#F8F8F8" : "white";
                                // })
                                .attr("class", function(d) {
                                         console.log(d.sampler_label); 
                                         return d.sampler_label === "TOTAL"? "total" : "none";
                                 })
                            .selectAll("td")
                                .data(function(d) { return _.values(d) })
                                .enter()
                                .append("td")
                                .text(function(d, i, j) { 
                                        //console.log( i + " " + j ); // j = row index, i = column within each row
                                        return(i == 7 || i == 8 || i == 9? Number(d).toFixed(2): d);
                                 })
                                .attr("class", function(d, i) { return (i == 4 & +d > 5000) ? (+d > 10000 ? "gt10" : "gt5"): "none"; });
                    
                    
                 })

        }
   }

})([ {file_name: 'aggregate_table_self_reg.csv', folder_name: 'saltare'} ]);
