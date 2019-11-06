defmodule Sim.Event do
  defstruct [:text, :description, :triggers, :effect]
  use ExConstructor

  alias Sim.Game.Spending

  def is_triggered(%__MODULE__{triggers: triggers}, %Spending{} = spending) do
    triggers
    |> Enum.any?(fn [key, value] -> Map.get(spending, key) < value end)
  end

  def apply_effect()
end
