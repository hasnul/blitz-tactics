//= require jquery
//= require jquery_ujs
//= require jquery-ui/draggable
//= require jquery-ui/droppable
//= require jquery-ui/sortable
//= require imagesloaded.pkgd
//= require underscore
//= require backbone
//= require mousetrap
//= require chess
//= require_self
//= require_tree .


window.Views = {};
window.Models = {};
window.Services = {};

window.d = _.clone(Backbone.Events);
window.blitz = {};
window.config = {
  comboSizeForNextLevel: 100
};


// Preload piece images
//
(function() {
  var colors = [ "w", "b" ];
  var pieces = [ "k", "q", "r", "b", "n" ];

  for (var i in pieces) {
    for (var j in colors) {
      var img = new Image();
      img.src = "/assets/pieces/" + colors[j] + pieces[i] + ".png";
    }
  }

})();


// Initialize views depending on the page
//
$(function() {

  var init = {

    "levels#show": function() {
      new Views.ComboCounter;
      new Views.Chessboard;
      new Views.Instructions;
      new Views.MainHeader;
      new Views.MoveStatus;
      new Views.PiecePromotionModal;
      new Views.ProgressBar;
      new Views.PuzzleCounter;
      new Views.PuzzleHint;
      new Views.Timer;
      new Views.NextStageButton;
      new Views.UnlockedLevelBanner;
      new Views.Background;

      new Services.Puzzles;
      new Services.Notifier;
      new Services.LevelProgress;
    },

    "home#index": function() {
      new Views.ComboCounter;
      new Views.Chessboard;
      new Views.Instructions;
      new Views.MainHeader;
      new Views.MoveStatus;
      new Views.PiecePromotionModal;
      new Views.ProgressBar;
      new Views.PuzzleCounter;
      new Views.PuzzleHint;
      new Views.Timer;
      new Views.NextStageButton;
      new Views.UnlockedLevelBanner;
      new Views.Background;

      new Services.Puzzles({ source: "/level-1" });
      new Services.Notifier;
      new Services.LevelProgress;
    },

    "levels#edit": function() {
      new Views.LevelEditor;
    },

    "puzzles#show": function() {
      new Views.ComboCounter;
      new Views.Chessboard;
      new Views.Instructions;
      new Views.MainHeader;
      new Views.MoveStatus;
      new Views.PiecePromotionModal;
      new Views.PuzzleCounter;
      new Views.PuzzleHint;

      new Services.Puzzles;
    },

  };


  var pageKey = $("body").data("controller") + "#" + $("body").data("action");

  if (typeof init[pageKey] === "function") {
    init[pageKey]();
  }

});
