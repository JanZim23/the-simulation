defmodule Sim do
  @moduledoc """
  Sim keeps the contexts that define your domain
  and business logic.

  Contexts are also responsible for managing your data, regardless
  if it comes from the database, an external API or others.
  """

  alias Sim.Game

  defguard is_game_over(temp) when temp > 26.1

  @spec apply_x(any, Sim.Game.Spending.t(), integer) :: any
  def apply_x(metrics, %Game.Spending{} = spending, x) do
    0..x
    |> Enum.reduce(
      metrics,
      fn _, acc ->
        Game.Metrics.apply_detlas(
          acc,
          Game.Spending.get_deltas(spending)
        )
      end
    )
  end

  def inspect_delta(delta) do
    delta
    |> Enum.map(fn {key, f} -> {key, f.(0)} end)
    |> Enum.each(&IO.inspect/1)

    delta
  end
end
