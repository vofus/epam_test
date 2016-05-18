function makeRowID() {
	var rowId = 0;

	return {
		set: function(val) {
			rowId = val;
		},

		get: function(){
			return rowId;
		},

		reset: function() {
			rowId = 0;
		}
	};
}

function makeID() {
	var id = 2;

	return {
		set: function() {
			id++;
		},

		get: function(){
			return id;
		},

		incriment: function() {
			id++;
			return id;
		},

		reset: function() {
			id = 2;
		}
	};
}

// function makeNumRow() {
// 	var row = 0;

// 	return {
// 		set: function(val) {
// 			row = val;
// 		},

// 		get: function(){
// 			return row;
// 		},

// 		reset: function() {
// 			row = 0;
// 		}
// 	};
// }

function makeProducts() {
	var products = [
		{
			id: 0,
			name: "Яблоки",
			count: 40,
			price: 75
		},
		{
			id: 1,
			name: "Груши",
			count: 60,
			price: 86
		},
		{
			id: 2,
			name: "Арбуз",
			count: 20,
			price: 17
		}
	];

	return {
		get: function() {
			return products;
		},
		
		set: function(val) {
			products = val;
		}
	};
}

function makeCoordinates() {
	var top = 0;

	return {
		set: function(val) {
			top = val;
		},

		get: function(){
			return top;
		},

		reset: function() {
			top = 0;
		}
	};
}