self.onmessage = function(e) {
	var click = e.data[0];

	postMessage(click);
}