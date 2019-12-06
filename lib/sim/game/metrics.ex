defmodule Sim.Game.Metrics do
  defstruct tax: 21,
            global_temp: 0.0,
            cost_of_living: 700,
            safety: 99,
            total_expenditures: 2740

  use ExConstructor

  def apply_detlas(%__MODULE__{} = metrics, %{} = deltas) do
    metrics
    |> Map.from_struct()
    |> Map.keys()
    |> Enum.reduce(metrics, fn key, m ->
      Map.update!(m, key, &Float.round(Map.get(deltas, key, 0).(&1), 5))
    end)
    |> __MODULE__.new()
  end
end
