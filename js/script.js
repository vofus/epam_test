$(document).ready(function() {

	// var numRow = makeNumRow();
	var products = makeProducts();
	var coordinates = makeCoordinates();
	var id = makeID();
	var rowId = makeRowID();
	var formatter = new Intl.NumberFormat("en", {
		style: "currency",
		currency: "USD"
	});

	$("#add-update-form").bootstrapValidator({
        // message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                message: 'Имя некорректно.',
                validators: {
                    notEmpty: {
                        message: 'Поле имя не может быть пустым'
                    },
                    stringLength: {
                        min: 3,
                        max: 15,
                        message: 'Количество символов не должно быть менее 3 и более 15'
                    },
                    regexp: {
                        regexp: /^[а-яА-Яa-zA-Z0-9]+?([а-яА-Яa-zA-Z0-9]+[\-\s]?)+[а-яА-Яa-zA-Z0-9]+?$/,
                        message: 'Поле должно содержать только буквы, цифры, дефис и символ пробела не более одного подряд. Не должно начинаться и заканчиваться дефисом или пробельным символом.'
                    }
                }
            },
            count: {
                validators: {
                    regexp: {
                    	regexp: /^[0-9]+$/,
                    	message: 'Поле заполняется только цифрами.'
                    }
                }
            },
            price: {
                validators: {
                    regexp: {
                    	regexp: /^[\$0-9]+\.?[0-9]*$/,
                    	message: 'Поле заполняется только цифрами и символом точки, для отделения дробной части.'
                    }
                }
            }
        }
    });

	$(".form-search input[type='submit']").click(function(event) {
		event.preventDefault();
		var filterMask = $(".form-search input[type='text']").val();
		filterProduct(filterMask);
	});

	$(".new").click(function(event) {
		event.preventDefault();
		$(".add").removeClass("update");
		$(".submit-value").removeClass("update").html("Add");
		$(".modal-wrap").fadeIn(600);
	});

	$("table.products").on("click", ".edit", function(event) {
		event.preventDefault();
		var obj = $(this);
		detectRowID(obj);
		contentForUpdate();

		$(".add").addClass("update");
		$(".submit-value").addClass("update").html("Update");
		$(".modal-wrap").fadeIn(600);
	});

	$(".add").click(function(event) {
		event.preventDefault();
		var valid = $(this).siblings(".form-group").hasClass("has-success");
		if (valid) {
			if ( $(".add").hasClass("update") ) {
				updateProduct();
			} else {
				addNewProduct();
			}

			$(".add").removeClass("update");
			$(".submit-value").removeClass("update");
			$(".modal #name").val("");
			$(".modal #count").val("");
			$(".modal #price").val("");
			$("#add-update-form").data('bootstrapValidator').resetForm();
			$(".modal-wrap").fadeOut(600);	
		} else {
			return false;
		}
	});

	$("table.products").on("click", ".delete", function(event) {
		event.preventDefault();
		var offsetTop = $(this).offset().top;
		var obj = $(this);
		coordinates.set(offsetTop);
		detectRowID(obj);
		$(".confirm").css("top", coordinates.get()-100).addClass("confirm-active");
	});

	$(".confirm").on("click", "a.yes", function(event) {
		event.preventDefault();
		$(".confirm").css('top', '-600px').removeClass("confirm-active");
		removeProduct();
	});

	$(".confirm").on("click", "a.no", function(event) {
		event.preventDefault();
		$(".confirm").css('top', '-600px').removeClass("confirm-active");
	});

	$(".btn-close").click(function(event) {
		event.preventDefault();
		$(".add").removeClass("update");
		$(".submit-value").removeClass("update");
		$(".modal #name").val("");
		$(".modal #count").val("");
		$(".modal #price").val("");
		$("#add-update-form").data('bootstrapValidator').resetForm();
		$(".modal-wrap").fadeOut(600);
	});

	$(".triangle").click(function(event) {
		event.preventDefault();
		$(this).toggleClass("triangle-down");
		if ( $(this).hasClass("name") && $(this).hasClass("triangle-down") ) {
			sortProducts(true, true);
		}
		if ( $(this).hasClass("name") && !$(this).hasClass("triangle-down") ) {
			sortProducts(true, false);
		}
		if ( $(this).hasClass("price") && $(this).hasClass("triangle-down") ) {
			sortProducts(false, true);
		}
		if ( $(this).hasClass("price") && !$(this).hasClass("triangle-down") ) {
			sortProducts(false, false);
		}
	});

	$("input#price").blur(function(event) {
		var priceValue = String( $(this).val() ).replace(/[^0-9.]/, '');
		$(this).val(formatter.format(priceValue));
	});

	/* =================== */
	/* ==== FUNCTIONS ==== */
	/* =================== */

	// function detectProductNum(obj) {
	// 	var indexRow = obj.parent().parent()[0].rowIndex;
	// 	numRow.set(indexRow);
	// }

	function detectRowID(obj) {
		var id = obj.siblings("input[type='hidden']").val();
		rowId.set( Number(id) );
	}

	function detectProd(element, index, array) {
		var id = rowId.get();
		while (element.id != id) { return false }
		return element;
	}

	function contentForUpdate() {
		var prods = products.get();
		var prodIndex = prods.findIndex(detectProd);

		$(".modal #name").val(prods[prodIndex].name);
		$(".modal #count").val(prods[prodIndex].count);
		$(".modal #price").val(formatter.format( prods[prodIndex].price) );
	}

	function addNewProduct() {
		var tempObj = {};
		var dataArr = products.get();
		var idProd = id.incriment();
		tempObj.id = Number( idProd );
		tempObj.name = String( $("#name").val() );
		tempObj.count = Number( $("#count").val() );
		tempObj.price = Number( $("#price").val().replace(/[^0-9.]/, '') );
		dataArr.push(tempObj);
		products.set(dataArr);
		addRow();
	}

	function updateProduct() {
		var tempObj = {};
		var dataArr = products.get();
		var idProd = rowId.get();
		var prodIndex = dataArr.findIndex(detectProd);
		dataArr.splice(prodIndex, 1);

		tempObj.id = Number( idProd );
		tempObj.name = String( $("#name").val() );
		tempObj.count = Number( $("#count").val() );
		tempObj.price = Number( $("#price").val().replace(/[^0-9.]/, '') );
		dataArr.push(tempObj);
		products.set(dataArr);
		addRow();
		refresh();
	}

	function removeProduct() {
		var dataArr = products.get();
		var prodIndex = dataArr.findIndex(detectProd);
		dataArr.splice(prodIndex, 1);
		products.set(dataArr);
		refresh();
	}

	function refresh(arr) {
		var dataArr;
		if (arr) {
			dataArr = arr;
		} else {
			dataArr = products.get();
		}
		// var dataArr = products.get();
		var numsOfProducts = dataArr.length;
	    var generateHTML = "";
	    for (var i=0; i<numsOfProducts; i++) {
	    	generateHTML += "<tr>";
			generateHTML += "<td>" + dataArr[i].name;
			generateHTML += "<span class='count'>" + dataArr[i].count + "</span>";
			generateHTML += "</td>";
			generateHTML += "<td>" + formatter.format(dataArr[i].price) + "</td>";
			generateHTML += "<td>";
			generateHTML += "<input type='hidden' value='" + dataArr[i].id + "' name='id'>";
			generateHTML += "<button class='edit btn btn-default'>Edit</button>";
			generateHTML += "<button class='delete btn btn-default'>Delete</button>";
			generateHTML += "</td>";
			generateHTML += "</tr>";
	    }
	    $(".form-search input[type='text']").val("");
	    $(".products tbody").html(generateHTML);
	}

	function addRow() {
		var dataArr = products.get();
	    var numsOfProducts = dataArr.length;
	    var generateHTML = "";
	    generateHTML += "<tr>";
		generateHTML += "<td>" + dataArr[numsOfProducts-1].name;
		generateHTML += "<span class='count'>" + dataArr[numsOfProducts-1].count + "</span>";
		generateHTML += "</td>";
		generateHTML += "<td>" + formatter.format(dataArr[numsOfProducts-1].price) + "</td>";
		generateHTML += "<td>";
		generateHTML += "<input type='hidden' value='" + dataArr[numsOfProducts-1].id + "' name='id'>";
		generateHTML += "<button class='edit btn btn-default'>Edit</button>";
		generateHTML += "<button class='delete btn btn-default'>Delete</button>";
		generateHTML += "</td>";
		generateHTML += "</tr>";
		$(".products tbody").append(generateHTML);
	}

	function sortProducts(name, down) {
		var dataArr = products.get();
		var compare;
		var name = name;
		var down = down;

		if (name) {
			if (down) {
				compare = function(a, b){
					return a.name == b.name ? a < b : a.name < b.name
				};
			} else {
				compare = function(a, b){
					return a.name == b.name ? a > b : a.name > b.name
				};
			}
		}

		if (!name) {
			if (down) {
				compare = function(a, b){
					return a.price == b.price ? a < b : a.price < b.price
				};
			} else {
				compare = function(a, b){
					return a.price == b.price ? a > b : a.price > b.price
				};
			}
		}

		var sortArr = dataArr.sort(compare);
		products.set(sortArr);
		refresh();
	}

	function filterProduct(filterMask) {
		var dataArr = products.get();
		var filterArr = [];
		var myExp = new RegExp(filterMask, "i");
		$.each(dataArr, function(key, val) {
			if (val.name.search(myExp) != -1) {
				filterArr.push(dataArr[key]);
			}
		});
		refresh(filterArr);
	}

	/* ======================== */
	/* ==== Вызовы функций ==== */
	/* ======================== */
	
	refresh();
























});