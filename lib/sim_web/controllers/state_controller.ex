defmodule SimWeb.StateController do
  use SimWeb, :controller

  def show(conn, %{"id" => id}) do
    {:via, Registry, {Sim.GameRegistry, id}}
    |> Sim.GameServer.get_state()
    |> render(conn, "state.json")
  end
end
