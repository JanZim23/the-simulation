defmodule Sim.Game do
  defmodule Player do
    @enforce_keys [:income, :name]
    defstruct [:name, :income, :budget, game_over?: false, expenses: %{}, priorities: []]

    def update_budgets(players, metrics) do
      players
      |> Enum.map(fn {id, player} -> {id, update_budget(player, metrics)} end)
      |> Enum.into(%{})
    end

    def update_budget(%Player{expenses: expenses, income: income} = player, %{
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

    def update_budget(%Player{expenses: exp, income: income, game_over?: false} = player) do
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

    def update_budget(%Player{} = player), do: player

    def game_over?(%Player{game_over?: go?}), do: go?
  end

  defmodule Metrics do
    defstruct tax: 21,
              global_temp: 24.0,
              cost_of_living: 700,
              safety: 99,
              total_expenditures: 2740

    use ExConstructor

    def apply_detlas(%__MODULE__{} = metrics, %{} = deltas) do
      metrics
      |> Map.from_struct()
      |> Map.keys()
      |> Enum.reduce(metrics, fn key, m ->
        Map.update!(m, key, &Float.round(Map.get(deltas, key, 0).(&1), 3))
      end)
      |> __MODULE__.new()
    end
  end

  defmodule Spending do
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
  end

  defmodule State do
    alias Sim.Game.Player

    defstruct [
      :id,
      tick: 0,
      spending: %Spending{},
      metrics: %Metrics{},
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

    defp elect_president(%State{players: players} = state, id) do
      state
      |> Map.put(:president, Map.get(players, id))
      |> Map.put(:players, Map.delete(players, id))
    end

    defp elect_senate(%State{players: players} = state, ids) do
      state
      |> Map.put(:senate, Enum.map(ids, &Map.get(players, &1)))
      |> Map.put(:players, Map.drop(players, ids))
    end

    def close_vote(%State{id: id, votes: votes} = state) do
      ballots = Map.values(votes)
      candidates = ballots |> Enum.uniq()

      results =
        for c <- candidates do
          {c, Enum.count(ballots, &(c == &1))}
        end

      Sim.Game.broadcast(id, "game", "election_results", results |> Enum.into(%{}))

      [president | senate] =
        Enum.sort_by(results, fn {_, count} -> count end) |> Enum.map(fn {c, _} -> c end)

      Sim.Game.broadcast(id, "game", "president", %{"president" => president})
      Sim.Game.broadcast(id, "game", "senate", %{"senate" => senate})

      state
      |> elect_president(president)
      |> elect_senate(senate)
    end

    def tick(%State{metrics: metrics, spending: spending} = state) do
      state
      |> Map.update!(:tick, &(&1 + 1))
      |> Map.put(:metrics, Metrics.apply_detlas(metrics, Spending.get_deltas(spending)))
      |> update_player_budget()
      |> check_game_over()
    end

    def check_game_over(state) do
      state
      |> Map.put(:game_over, game_over?(state))
    end

    def cast_vote(%State{} = state, player_id, voted_for) do
      state
      |> Map.update!(:votes, &Map.put(&1, player_id, voted_for))
    end

    def update_spending(%State{spending: old} = state, spending) do
      state
      |> Map.put(:spending, Map.merge(old, spending))
      |> update_player_budget()
    end

    defp game_over?(%State{
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

    defp update_player_budget(%State{metrics: metrics, players: players} = state) do
      state
      |> Map.put(:players, Player.update_budgets(players, metrics))
    end

    def random_income() do
      x = Enum.random(1..200)
      1200 + Float.floor(:math.pow(x / 20 + 1, 4))
    end
  end

  def broadcast(id, channel, event, message) do
    SimWeb.Endpoint.broadcast(channel <> ":" <> id, event, message)
  end
end

defmodule Sim.GameServer do
  use ExActor.Tolerant

  alias Sim.Game.State

  defstart start(id), gen_server_opts: [name: {:via, Registry, {Sim.GameRegistry, id}}] do
    :timer.apply_interval(1_000, __MODULE__, :tick, [{:via, Registry, {Sim.GameRegistry, id}}])

    %State{id: id}
    |> initial_state()
  end

  defcast sign_up(id, name), state: state do
    state
    |> State.add_player(id, name)
    |> new_state()
  end

  defcast tick(), state: state do
    state
    |> State.tick()
    |> IO.inspect()
    |> new_state()
  end

  defcast update_spending(spending), state: state do
    state
    |> State.update_spending(spending)
    |> new_state()
  end

  defcast vote(player_id, voted_for), state: state do
    state |> State.cast_vote(player_id, voted_for) |> new_state()
  end
end
