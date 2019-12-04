defmodule SimWeb.StateController do
  use SimWeb, :controller

  def show(conn, %{"id" => id}) do
    state =
      {:via, Registry, {Sim.GameRegistry, id}}
      |> Sim.GameServer.get_state()
      |> Map.drop([:deltas])

    render(conn, "state.json", state: state)
  end

  def new(conn, %{"name" => id}) do
    {:ok, _} = Sim.GameServer.start(id)
    resp(conn, 201, "")
  end

  def start(conn, %{"name" => id}) do
    :ok = id |> get_game() |> Sim.GameServer.start_game()
    resp(conn, 201, "")
  end

  defp get_game(id), do: {:via, Registry, {Sim.GameRegistry, id}}
end
