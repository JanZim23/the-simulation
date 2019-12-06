defmodule Sim.Game.Spending do
  defstruct climate: 0,
            welfare: 867,
            military: 500,
            health: 1300,
            education: 73

  use ExConstructor

  @tick_comp 10

  @d %{
    tax: {2770, 0.07, 21},
    total_expenditures: {0.0, 1.0, 0},
    global_temp: [{:climate, 700, 0.00048}, {:education, 200, 0.00035}],
    safety: [{:military, 500, -0.053}, {:education, 90, -0.01}, {:welfare, 1200, -0.003}],
    cost_of_living: [{:health, 1500, 0.10}, {:welfare, 950, 0.09}, {:education, 150, 0.09}]
  }

  def get_delta_change(%{} = deltas) do
    deltas
    |> Enum.map(fn {key, f} -> {key, f.(0) |> Float.round(4)} end)
    |> Enum.into(%{})
  end

  @spec get_deltas(Sim.Game.Spending.t()) :: map
  def get_deltas(%__MODULE__{} = spending) do
    total_spending =
      spending
      |> Map.from_struct()
      |> Enum.reduce(0, fn {_, s}, acc -> acc + s end)

    @d
    |> Map.to_list()
    |> Enum.map(fn
      {key, ds} when is_list(ds) ->
        {key,
         fn current ->
           Enum.reduce(ds, current, &calc_change(&1, spending, &2))
         end}

      {key, {initial, c, offset}} ->
        {key, fn _ -> (total_spending - initial) * c + offset end}
    end)
    |> Enum.into(%{})
  end

  # the lower spending is than target, the
  # more spending than target will make
  def calc_change({key, t, c}, spending, current) do
    (t - Map.get(spending, key, 0)) * (c / 60) * (1 / @tick_comp) + current
  end

  def adjust_spending(spending, priority_spending) do
    priority_spending
    |> Map.from_struct()
    |> Enum.reduce(spending, fn {key, wish}, spnd ->
      Map.update!(spnd, key, &Float.round((wish - &1) / 7 + &1, 3))
    end)
  end
end
