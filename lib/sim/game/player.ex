defmodule Sim.Game.Player do
  @enforce_keys [:income, :name]
  defstruct [
    :name,
    :income,
    :budget,
    game_over?: false,
    expenses: %{},
    priorities: [],
    approves: true
  ]

  def update_budgets(players, metrics) do
    players
    |> Enum.map(fn {id, player} -> {id, update_budget(player, metrics)} end)
    |> Enum.into(%{})
  end

  def update_budget(%__MODULE__{expenses: expenses, income: income} = player, %{
        cost_of_living: cost,
        tax: tax
      }) do
    player
    |> Map.put(
      :expenses,
      Map.merge(expenses, %{cost_of_living: cost, tax: Float.round(income / 100 * tax, 2)})
    )
    |> update_budget()
  end

  def update_budget(%__MODULE__{expenses: exp, income: income, game_over?: false} = player) do
    budget =
      exp
      |> Map.values()
      |> Enum.reduce(income, &(&2 - &1))
      |> Float.round(2)

    player
    |> Map.put(
      :budget,
      budget
    )
    |> Map.put(:game_over?, budget < 0)
  end

  def update_budget(%__MODULE__{} = player), do: player

  def game_over?(%__MODULE__{game_over?: go?}), do: go?
end
