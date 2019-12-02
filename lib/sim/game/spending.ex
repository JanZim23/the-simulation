defmodule Sim.Game.Spending do
  defstruct climate: 0,
            welfare: 867,
            military: 500,
            health: 1300,
            education: 73

  use ExConstructor

  @d %{
    tax: {2740, 0.1, 21},
    total_expenditures: {0.0, 1.0, 0},
    global_temp: [{:climate, 500, 0.0005}, {:education, 150, 0.0001}],
    safety: [{:military, 500, -0.07}, {:education, 70, -0.001}, {:welfare, 900, -0.003}],
    cost_of_living: [{:health, 1500, 0.10}, {:welfare, 700, 0.09}, {:education, 150, 0.08}]
  }

  def get_delta_change(%{} = deltas) do
    deltas
    |> Enum.map(fn {key, f} -> {key, f.(0) |> Float.round(4)} end)
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
    (t - Map.get(spending, key, 0)) * (c / 60) + current
  end

  def adjust_spending(spending, priority_spending) do
    priority_spending
    |> Map.from_struct()
    |> Enum.reduce(spending, fn {key, wish}, spnd ->
      Map.update!(spnd, key, &Float.round((wish - &1) / 10 + &1, 3))
    end)
  end
end
