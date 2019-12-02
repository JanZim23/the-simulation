defmodule Sim.Event do
  defstruct [:text, :description, :triggers, :effects, :player_effects]
  use ExConstructor

  alias Sim.Game.Spending
  alias Sim.Game.State

  def is_triggered(%__MODULE__{triggers: triggers}, %Spending{} = spending) do
    triggers
    |> Enum.any?(fn [key, value] -> Map.get(spending, key) < value end)
  end

  def apply_effects(%__MODULE__{effects: metric_effects, player_effects: player_effects}, state) do
    state
    |> apply_metric_effects(metric_effects)
    |> apply_player_effects(player_effects)
  end

  def apply_metric_effects(%State{metrics: metrics} = state, effects) do
    state
    |> Map.put(:metrics, Sim.Game.Metrics.apply_deltas(metrics, Enum.into(effects, %{})))
  end

  def apply_player_effects(%State{players: players} = state, effects) do
    state
    |> Map.put(:players, Enum.map(players, &Player.apply_effects(&1, effects)))
  end
end
