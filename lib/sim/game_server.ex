defmodule Sim.GameServer do
  use ExActor.Tolerant

  alias Sim.Game.State

  defstart start(id), gen_server_opts: [name: {:via, Registry, {Sim.GameRegistry, id}}] do
    {:ok, tref} =
      :timer.apply_interval(1_000, __MODULE__, :tick, [{:via, Registry, {Sim.GameRegistry, id}}])

    %State{id: id, tick_timer: tref}
    |> initial_state()
  end

  defcast start_game(), state: state do
    state
    |> State.start_game()
    |> new_state()
  end

  defcall get_state(), state: state do
    reply(state)
  end

  defcast sign_up(id, name), state: state do
    state
    |> State.add_player(id, name)
    |> new_state()
  end

  defcast tick(), state: state do
    state
    |> State.tick()
    |> new_state()
  end

  defcall get_player(id), state: state do
    state
    |> State.get_player(id)
    |> reply()
  end

  defcast update_spending(spending), state: state do
    state
    |> State.update_spending(spending)
    |> new_state()
  end

  defcast update_player_priorities(player_id, priorities), state: state do
    state
    |> State.update_player_priorities(player_id, priorities)
    |> new_state()
  end

  defcast next_event(), state: state do
    state
    |> State.next_event()
    |> new_state()
  end

  defcast vote(player_id, voted_for), state: state do
    state |> State.cast_vote(player_id, voted_for) |> new_state()
  end
end
