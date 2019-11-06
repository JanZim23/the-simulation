defmodule SimTest do
  use ExUnit.Case
  alias Sim.Game.Metrics
  require Sim

  @max_temp 26.1
  @max_cost_of_living 1500

  describe "sensefullness" do
    test "you win when you make sensefull investions" do
      assert %Metrics{global_temp: gt, cost_of_living: col} =
               %Sim.Game.Metrics{}
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 0}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 10}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 40}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 100}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 100}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 440, climate: 100}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 420, climate: 200}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 400, climate: 300}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 430, climate: 400}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 300}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 400}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 400}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 300}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 500}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 500}, 60 * 1)

      assert gt < @max_temp
      assert col < @max_cost_of_living
    end

    test "you win when you make sensefull investions at the last minute" do
      assert %Metrics{global_temp: gt, cost_of_living: col} =
               %Sim.Game.Metrics{}
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 0}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 10}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 40}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 20}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 30}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 440, climate: 40}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 420, climate: 40}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 400, climate: 400}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 430, climate: 400}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 400}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 400}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 500}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 500}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 500}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 500}, 60 * 1)

      assert gt < @max_temp
      assert col < @max_cost_of_living
    end

    test "you lose when you dont make big investments" do
      assert %Metrics{global_temp: gt, cost_of_living: col} =
               %Sim.Game.Metrics{}
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 0}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 10}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 40}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 100}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 100}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 440, climate: 100}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 420, climate: 200}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 400, climate: 200}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 430, climate: 200}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 200}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 200}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 200}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 200}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 200}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 200}, 60 * 1)

      assert gt > @max_temp
      assert col < @max_cost_of_living
    end

    test "you lose when you dont make big enough investments" do
      assert %Metrics{global_temp: gt, cost_of_living: col} =
               %Sim.Game.Metrics{}
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 300}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 200}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 400}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 100}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 100}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 440, climate: 100}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 420, climate: 200}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 400, climate: 200}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 430, climate: 200}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 200}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 200}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 200}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 200}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 200}, 60 * 1)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 200}, 60 * 1)

      assert gt > @max_temp
      assert col < @max_cost_of_living
    end

    test "you lose when you make to big changes" do
      assert %Metrics{global_temp: gt, cost_of_living: col} =
               %Sim.Game.Metrics{}
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 400}, 60 * 5)
               |> Sim.apply_x(%Sim.Game.Spending{military: 480, climate: 500}, 60 * 10)

      assert gt > @max_temp
      assert col < @max_cost_of_living
    end
  end
end
