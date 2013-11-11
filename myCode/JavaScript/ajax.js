$.ajax({
  //url: "https://script.google.com/a/macros/pearson.com/s/AKfycbzuoIwvImIuCeyCIWh7HwHlzhRdpq727Ivkie7L5TSDzm0IQta8/exec?id=0AsflWcQS4BXmdEhUUVctWE9BYXdLOFFlWmdJWXl0eHc&sheet=Sheet1",
  url: 'http://localhost:9999/myCode/JavaScript/JQueryTemplate2.html',
  beforeSend: function( xhr ) {
    xhr.overrideMimeType( "text/plain" );
  }
})
  .done(function( data ) {
    if ( console && console.log ) {
      console.log( "Sample of data:", data.slice( 0, 100 ) );
    }
  });