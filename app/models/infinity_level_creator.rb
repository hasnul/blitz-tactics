# For defining the criteria for puzzles to add to levels and building them

module InfinityLevelCreator

  def easy_puzzles
    NewLichessPuzzle.rating_lte(1000)
      .vote_gt(50).attempts_gt(5000).white_to_move
  end

  def medium_puzzles
    NewLichessPuzzle.rating_gt(1000).rating_lte(1600)
      .vote_gt(50).attempts_gt(5000).white_to_move
  end

  def hard_puzzles
    NewLichessPuzzle.rating_gt(1600).rating_lte(2000)
      .vote_gt(50).attempts_gt(5000).white_to_move
  end

  def insane_puzzles
    NewLichessPuzzle.rating_gt(2000)
      .vote_gt(50).attempts_gt(5000).white_to_move
  end

  def build_easy_level!
    level = InfinityLevel.find_or_create_by(difficulty: 'easy')
    easy_puzzles.each do |puzzle|
      level.add_puzzle_id puzzle.id
    end
    true
  end

  def build_medium_level!
    level = InfinityLevel.find_or_create_by(difficulty: 'medium')
    medium_puzzles.each do |puzzle|
      level.add_puzzle_id puzzle.id
    end
    true
  end

  extend self
end
