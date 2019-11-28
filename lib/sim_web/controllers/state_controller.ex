defmodule SimWeb.StateController do
  use SimWeb, :controller

  def show(conn, %{"id" => id}) do
    state =
      {:via, Registry, {Sim.GameRegistry, id}}
      |> Sim.GameServer.get_state()

    render(conn, "state.json", state: state)
  end
end
