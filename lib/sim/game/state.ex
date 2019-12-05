defmodule Sim.Game.State do
  alias Sim.Game.{Player, Spending, Metrics, Messages}

  # One event every 2 minutes
  @event_rate 120

  defstruct [
    :id,
    :tick_timer,
    tick: 0,
    started?: false,
    direct_democracy?: true,
    spending: %Spending{},
    priority_spending: %Spending{},
    metrics: %Metrics{},
    deltas: %{},
    delta_change: %{},
    president: nil,
    senate: [],
    players: %{},
    remaining_events: Sim.EventProvider.get_events(),
    votes: %{},
    game_over: false
  ]

  use ExConstructor

  def add_player(state, id, name) do
    state
    |> Map.update!(
      :players,
      &Map.put(&1, id, %Player{income: random_income(), name: name})
    )
  end

  def hold_election(%__MODULE__{} = state) do
    Messages.broadcast_start_election()

    state
    |> Map.put(:direct_democracy?, false)
  end

  def start_game(state), do: state |> Map.put(:started?, true)

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

  def update_player_priorities(%__MODULE__{players: players} = state, player_id, priorities) do
    state
    |> Map.put(
      :players,
      players |> Map.update!(player_id, &Player.update_priorities(&1, priorities))
    )
  end

  def get_player(%__MODULE__{players: players}, id) do
    Map.get(players, id, nil)
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

  def calc_priority_spending(%__MODULE__{} = state) do
    state
    |> Map.put(:priority_spending, determine_spending(state))
  end

  def tick(%__MODULE__{} = state) do
    state
    |> Map.update!(:tick, &(&1 + 1))
    |> update_priority_for_dd()
    |> scew_spending()
    |> calc_deltas()
    |> apply_deltas()
    # |> check_next_event()
    |> update_player_budget()
    |> check_game_over()
    |> Messages.broadcast_tick()
  end

  def calc_deltas(%__MODULE__{spending: spending} = state) do
    state
    |> Map.put(:deltas, Spending.get_deltas(spending))
    |> Map.put(:delta_change, Spending.get_delta_change(Spending.get_deltas(spending)))
  end

  def apply_deltas(%__MODULE__{deltas: deltas, metrics: metrics, started?: true} = state) do
    state
    |> Map.put(:metrics, Metrics.apply_detlas(metrics, deltas))
  end

  def apply_deltas(state), do: state

  def update_priority_for_dd(%__MODULE__{direct_democracy?: true} = state) do
    state
    |> calc_priority_spending()
  end

  def update_priority_for_dd(state), do: state

  def scew_spending(%__MODULE__{spending: spending, priority_spending: ps} = state) do
    state
    |> update_spending(Spending.adjust_spending(spending, ps))
  end

  def check_next_event(%__MODULE__{tick: tick} = state) when rem(tick, @event_rate) == 0 do
    next_event(state)
  end

  def check_next_event(state), do: state

  def check_game_over(%__MODULE__{started?: st?} = state) do
    go? = game_over?(state)

    state
    |> Map.put(:game_over, go?)
    |> Map.put(:started, st? and not go?)
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

  def next_event(
        %__MODULE__{
          remaining_events: remaining_events,
          spending: spending,
          metrics: metrics
        } = state
      ) do
    remaining_events
    |> Enum.find(&Event.is_triggered(&1, spending), nil)
    |> Messages.broadcast_event()
    |> Event.apply_effects(state)
  end

  defp game_over?(%__MODULE__{
         metrics: %Metrics{global_temp: global_temp, safety: safety},
         players: players
       }) do
    player_count = map_size(players)

    players
    |> Map.values()
    |> Enum.count(&Player.game_over?/1) > player_count / 2 or
      global_temp > 1.5 or
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

  defp determine_spending(%__MODULE__{players: players, spending: spending}) do
    Enum.reduce(players, spending, &Player.scew_spending(&1, &2, map_size(players)))
  end

  def export(state) do
    state
    |> Map.from_struct()
    |> Map.drop([:deltas, :tick_timer])
  end
end
