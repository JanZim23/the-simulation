defmodule Sim.Game.State do
  alias Sim.Game.{Player, Spending, Metrics, Messages}

  defstruct [
    :id,
    :tick_timer,
    tick: 0,
    spending: %Spending{},
    metrics: %Metrics{},
    detlas: %{},
    president: nil,
    senate: [],
    players: %{},
    remaining_events: [],
    votes: %{},
    approval: %{},
    game_over: false
  ]

  use ExConstructor

  def add_player(state, id, name) do
    state
    |> Map.update!(:players, &Map.put(&1, id, %Player{income: random_income(), name: name}))
  end

  defp elect_president(%__MODULE__{players: players} = state, id) do
    state
    |> Map.put(:president, Map.get(players, id))
    |> Map.put(:players, Map.delete(players, id))
  end

  defp elect_senate(%__MODULE__{players: players} = state, ids) do
    state
    |> Map.put(:senate, Enum.map(ids, &Map.get(players, &1)))
    |> Map.put(:players, Map.drop(players, ids))
  end

  def close_vote(%__MODULE__{id: id, votes: votes} = state) do
    ballots = Map.values(votes)
    candidates = ballots |> Enum.uniq()

    results =
      for c <- candidates do
        {c, Enum.count(ballots, &(c == &1))}
      end

    Messages.broadcast(id, "game", "election_results", results |> Enum.into(%{}))

    [president | senate] =
      Enum.sort_by(results, fn {_, count} -> count end) |> Enum.map(fn {c, _} -> c end)

    Messages.broadcast(id, "game", "president", %{"president" => president})
    Messages.broadcast(id, "game", "senate", %{"senate" => senate})

    state
    |> elect_president(president)
    |> elect_senate(senate)
  end

  def tick(%__MODULE__{metrics: metrics, spending: spending} = state) do
    deltas = Spending.get_deltas(spending)

    state
    |> Map.update!(:tick, &(&1 + 1))
    |> Map.put(:metrics, Metrics.apply_detlas(metrics, deltas))
    |> Map.put(:deltas, Spending.get_delta_change(deltas))
    |> update_player_budget()
    |> check_game_over()
  end

  def check_game_over(state) do
    state
    |> Map.put(:game_over, game_over?(state))
  end

  def cast_vote(%__MODULE__{} = state, player_id, voted_for) do
    state
    |> Map.update!(:votes, &Map.put(&1, player_id, voted_for))
  end

  def update_spending(%__MODULE__{spending: old} = state, spending) do
    state
    |> Map.put(:spending, Map.merge(old, spending))
    |> update_player_budget()
  end

  defp game_over?(%__MODULE__{
         metrics: %Metrics{global_temp: global_temp, safety: safety},
         players: players
       }) do
    player_count = map_size(players)

    players
    |> Map.values()
    |> Enum.count(&Player.game_over?/1) > player_count / 2 or
      global_temp > 26.1 or
      safety < 50
  end

  defp update_player_budget(%__MODULE__{metrics: metrics, players: players} = state) do
    state
    |> Map.put(:players, Player.update_budgets(players, metrics))
  end

  def random_income() do
    x = Enum.random(1..200)
    1200 + Float.floor(:math.pow(x / 20 + 1, 4))
  end
end
