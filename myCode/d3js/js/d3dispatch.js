d3.myd3lib = {}

d3.myd3lib.table = function() {

	var dispatch = d3.dispatch('customHover');

	function exports (_selection) {
		_selection.each( function() {
			d3.select(this).on('mouseover', dispatch.customHover) 
            // dispatch.customHover is a trigger
            // we can attach a listener from outside using .on
		});
	}

    // to rebind the custom event from dispatch object to exports function
    // so that we can access the event handler outside the function
	d3.rebind(exports, dispatch, "on");
    
    // for demo
    dispatch.on('customHover', function() { console.log('inside module...');});
	return exports;

}
