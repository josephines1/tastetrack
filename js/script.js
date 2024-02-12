$(".navbar-toggler").on("click", function () {
  // Toggle kelas show pada elemen .navbar-collapse
  $(".navbar-collapse").toggleClass("show");
});

function randomMeal() {
  $(".result-container").html(
    `<div class="d-flex justify-content-center mt-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>`
  );

  $.ajax({
    url: "https://www.themealdb.com/api/json/v1/1/random.php",
    dataType: "json",
    type: "get",
    success: function (response) {
      showResult(response);
    },
  });
}

$("#swipe-button").on("click", function () {
  randomMeal();
});

function searchMeal() {
  $(".result-container").html(
    `<div class="d-flex justify-content-center mt-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>`
  );
  $.ajax({
    url: "https://www.themealdb.com/api/json/v1/1/search.php",
    data: {
      s: $("#meal-keyword").val(),
    },
    dataType: "json",
    type: "get",
    success: function (response) {
      showResult(response);
    },
  });
}

function showResult(response) {
  $("#instruction-order").html("");
  $("#ingredients-list").html("");

  if (response.meals !== null) {
    let meal = response.meals[0];
    if (meal.strTags === null) {
      meal.strTags = "-";
    }

    $(".result-container").html(
      `<div class="card mb-3">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                    <img
                        src="${meal.strMealThumb}"
                        alt="${meal.strMeal}"
                        style="width: 100%"
                        id="meal-image"
                        class="img-thumbnail"
                    />
                    </div>
                    <div class="col-md-8">
                    <h3 id="meal-name">${meal.strMeal}</h3>
                    <p class="text-muted" id="meal-category">Category: ${meal.strTags}</p>
                    <h4>Ingredient(s):</h4>
                    <div id="ingredients-list"></div>
                    <a
                        class="btn btn-outline-secondary mt-1 ms-auto"
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#instructionModal"
                        >See Instruction</a
                    >
                    </div>
                </div>
            </div>
        </div>`
    );

    // Mendefinisikan ingredients
    var ingredients = [];
    for (var i = 1; i <= 20; i++) {
      var ingredient = meal["strIngredient" + i];
      if (ingredient !== "" && ingredient !== null) {
        ingredients.push(ingredient);
      }
    }

    // Mendefinisikan measures
    var measures = [];
    for (var j = 1; j <= 20; j++) {
      var measure = meal["strMeasure" + j];
      if (measure !== "" && measure !== null) {
        measures.push(measure);
      }
    }

    var ingredientsArray = $.map(ingredients, function (value, key) {
      return { ingredient: value, measure: measures[key] };
    });

    // Membuat daftar HTML
    var $list = $("<ul class='ingredient-column'>");
    $.each(ingredientsArray, function (index, item) {
      if (item.ingredient !== "") {
        var $li = $("<li>").text(item.measure + " " + item.ingredient);
        $list.append($li);
      }
    });

    // Menambahkan daftar ke dalam elemen dengan id 'ingredients-list'
    $("#ingredients-list").append($list);

    var paragraph = meal.strInstructions;
    var sentences = paragraph.split(". ");
    var $orderedList = $("<ol>");
    $.each(sentences, function (index, sentence) {
      var $listItem = $("<li>").text(sentence);
      $orderedList.append($listItem);
    });

    // Menambahkan ordered list ke dalam elemen dengan id 'paragraph-list'
    $("#instruction-order").append($orderedList);
  } else {
    $(".result-container").html(`
            <h5 class="text-center">We're sorry, no recipes found.</h5>
            `);
  }
}
