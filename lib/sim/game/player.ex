defmodule Sim.Game.Player do
  @enforce_keys [:income, :name]
  defstruct [
    :name,
    :income,
    budget: 0,
    bankrupt?: false,
    expenses: %{},
    priorities: [],
    approves: true,
    polution: 1.0
  ]

  def scew_spending({_id, %__MODULE__{priorities: priorities} = player}, spending, player_count) do
    all_pris =
      spending
      |> Map.from_struct()
      |> Map.keys()

    spending =
      (all_pris -- priorities)
      |> Enum.take(length(priorities))
      |> Enum.reduce(spending, &scew_spending_down(player, &1, &2, player_count))

    priorities
    |> Enum.reduce(spending, &scew_spending(player, &1, &2, player_count))
  end

  defp scew_spending(%__MODULE__{budget: budget}, priority, spending, player_count) do
    spending
    |> Map.update!(priority, fn d -> d + calc_impact(budget, player_count) end)
  end

  defp scew_spending_down(%__MODULE__{budget: budget}, priority, spending, player_count) do
    spending
    |> Map.update!(priority, fn d -> d - calc_impact(budget, player_count) end)
  end

  def update_priorities(%__MODULE__{} = player, priorities) do
    priorities = priorities |> Enum.take(7) |> Enum.map(&String.to_atom/1)

    player
    |> Map.put(:priorities, priorities)
  end

  defp calc_impact(budget, player_count) do
    budget / 5 / 50 / player_count
  end

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
      Map.merge(expenses, %{
        "Cost of Living" => cost,
        "Taxes (%)" => Float.round(income / 100 * tax, 2)
      })
    )
    |> update_budget()
  end

  def add_expense(%__MODULE__{} = player, {expense_name, amt}) do
    player
    |> Map.update!(:expenses, &Map.put(&1, expense_name, amt))
  end

  def update_budget(%__MODULE__{expenses: exp, income: income, bankrupt?: false} = player) do
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
    |> Map.put(:bankrupt?, budget < 0)
  end

  def update_budget(%__MODULE__{} = player), do: player

  def apply_effects(%__MODULE__{} = player, effects) do
    effects
    |> Enum.reduce(player, fn [name, min_income, max_income, amount],
                              %__MODULE__{income: income} = player ->
      if income > min_income and income < max_income do
        player |> add_expense({name, amount})
      else
        player
      end
    end)
  end

  def game_over?(%__MODULE__{bankrupt?: go?}), do: go?
end
