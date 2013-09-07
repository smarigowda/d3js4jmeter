//var file_name = GetUrlValue('file_name');
var file_name = 'aggregate_report2.1.csv';
d3.csv("./data/".concat(file_name), function(data) {
        console.log('csv data read');
        // data is an array of objects
        console.log(data);
});


