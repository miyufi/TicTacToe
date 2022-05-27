$(document).ready(function () {
  $(".submit").click(function (event) {
    event.preventDefault();
    choice = $(this).val();
    $.post("/move", { choice: choice })
      .done(function (data) {
        $(".message").html(data.message);
        if (data.message != "") {
          $(".submit").css({ "pointer-events": "none" }).addClass("active");
          $(".alertMessage").html(
            `<div class="alert alert-secondary alert-dismissible shadow-soft fade show " role="alert">
                    <h4 class = "text-secondary text-center"><span class="alert-inner--icon"><span class="fas fa-exclamation-circle"></span></span>
                    <span>` +
              data.message +
              `</span></h4>
                    <button type="button" class="close text-dark" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>`
          );
        }
        for (let j = 0; j < 3; j++) {
          for (let i = 0; i < 3; i++) {
            val = j * 3 + i + 1;
            if (data.tttBoard[val - 1] == "X") {
              $("#boardValue" + val).html(
                `<h1 class = "fas fa-times text-danger val" style = "font-size: 80px;"></h1>`
              );
            } else if (data.tttBoard[val - 1] == "O") {
              $("#boardValue" + val).html(
                `<h1 class = "far fa-circle text-secondary val" style = "font-size: 80px;"></h1>`
              );
            }
            if (data.tttBoard[val - 1] != "_") {
              $("#boardValue" + val)
                .css({ "pointer-events": "none" })
                .addClass("active");
            }
          }
        }
      })
      .fail(function () {
        $("#message").html("An error has occurred.");
      });
  });
  $(".reset").click(function (event) {
    event.preventDefault();
    $(".close").click();
    $.post("/reset", { reset: $(this).val() })
      .done(function () {
        $(".val").fadeOut(200);
        setTimeout(function () {
          for (let j = 0; j < 3; j++) {
            for (let i = 0; i < 3; i++) {
              val = j * 3 + i + 1;
              $("#boardValue" + val)
                .html("")
                .css({ "pointer-events": "auto" })
                .removeClass("active");
            }
          }
        }, 300);
      })
      .fail(function () {
        $("#message").html("An error has occurred.");
      });
  });

  var difficulty = $("button.difficulty.active").val();
  $(".difficulty").on("click", function () {
    $(this).addClass("active").siblings().removeClass("active");
    difficulty = $("button.difficulty.active").val();
  });

  $(".check").click(function (event) {
    event.preventDefault();
    $(".close").click();
    $.post("/difficulty", { difficulty: difficulty })
      .done(function (data) {
        $(".val").fadeOut(200);
        setTimeout(function () {
          for (let j = 0; j < 3; j++) {
            for (let i = 0; i < 3; i++) {
              val = j * 3 + i + 1;
              $("#boardValue" + val)
                .html("")
                .css({ "pointer-events": "auto" })
                .removeClass("active");
            }
          }
        }, 300);
      })
      .fail(function () {
        $("#message").html("An error has occurred.");
      });
  });
});
